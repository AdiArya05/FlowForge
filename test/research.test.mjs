import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, rm } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));

async function listen(server) {
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  return server.address().port;
}

for (const mode of ["direct", "bright-data"]) {
  test(`${mode} research rejects HTTP error pages`, { timeout: 15000 }, async (t) => {
    const upstream = createServer(async (req, res) => {
      let path = req.url;
      if (mode === "bright-data") {
        let body = "";
        for await (const chunk of req) body += chunk;
        path = new URL(JSON.parse(body).url).pathname;
      }
      res.writeHead(path === "/ok" ? 200 : 503, { "Content-Type": "text/html" });
      res.end(path === "/ok"
        ? '<title>Working company</title><meta name="description" content="Real company description">'
        : '<title>Service unavailable</title><meta name="description" content="Error page">');
    });
    t.after(() => new Promise((resolve) => upstream.close(resolve)));
    const upstreamPort = await listen(upstream);
    const upstreamUrl = `http://127.0.0.1:${upstreamPort}`;

    // Reserve an available port before starting the app's existing entry point.
    const reservation = createServer();
    const port = await listen(reservation);
    await new Promise((resolve) => reservation.close(resolve));
    // Keep developer .env.local files out of these local-only requests.
    const cwd = await mkdtemp(join(tmpdir(), "flowforge-research-test-"));
    t.after(() => rm(cwd, { recursive: true, force: true }));
    const app = spawn(process.execPath, [join(root, "server.mjs")], {
      cwd,
      env: {
        ...process.env,
        PORT: String(port),
        KIMI_API_KEY: "",
        DAYTONA_API_KEY: "",
        BRIGHTDATA_API_KEY: mode === "bright-data" ? "local-test-key" : "",
        BRIGHTDATA_WEB_UNLOCKER_ENDPOINT: mode === "bright-data" ? upstreamUrl : ""
      },
      stdio: ["ignore", "pipe", "pipe"]
    });
    t.after(async () => {
      if (app.exitCode === null && app.signalCode === null) {
        const exited = once(app, "exit");
        app.kill();
        await exited;
      }
    });
    await new Promise((resolve, reject) => {
      app.once("error", reject);
      app.once("exit", (code) => reject(new Error(`App exited before startup: ${code}`)));
      app.stdout.on("data", (chunk) => {
        if (chunk.toString().includes("FlowForge demo running")) resolve();
      });
    });

    async function research(companies) {
      const response = await fetch(`http://127.0.0.1:${port}/api/pipeline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companies })
      });
      assert.equal(response.status, 200);
      return (await response.json()).run.results;
    }

    const mixed = await research(`Working,${upstreamUrl}/ok\nBroken,${upstreamUrl}/error`);
    assert.equal(mixed.length, 1);
    assert.equal(mixed[0].company, "Working");
    assert.equal(mixed[0].title, "Working company");
    assert.equal(mixed[0].description, "Real company description");
    assert.equal(mixed[0].source, mode === "direct" ? "direct-fetch" : "bright-data");

    const failed = await research(`Broken,${upstreamUrl}/error`);
    assert.ok(failed.length > 0);
    assert.ok(failed.every((row) => row.source === "demo-fallback"));
  });
}
