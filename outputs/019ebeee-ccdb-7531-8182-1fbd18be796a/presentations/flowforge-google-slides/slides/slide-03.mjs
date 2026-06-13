import { bg, body, C, fonts, footer, kicker, title } from "./theme.mjs";

function step(slide, ctx, n, label, detail, y, color) {
  ctx.addShape(slide, { left: 62, top: y, width: 42, height: 42, fill: color });
  ctx.addText(slide, { left: 62, top: y + 10, width: 42, height: 22, text: String(n), fontSize: 15, color: "#071019", bold: true, align: "center", typeface: fonts.body });
  ctx.addText(slide, { left: 122, top: y - 2, width: 420, height: 24, text: label, fontSize: 18, color: C.text, bold: true, typeface: fonts.body });
  ctx.addText(slide, { left: 122, top: y + 25, width: 420, height: 38, text: detail, fontSize: 13, color: C.muted, typeface: fonts.body });
}

export async function slide03(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  kicker(slide, ctx, "product loop");
  title(slide, ctx, "One observed workflow becomes an automation plan and a runnable first draft.", 58, 84, 570, 34);
  step(slide, ctx, 1, "Watch the work", "VideoDB-style workflow steps from screen recording evidence.", 236, C.mint);
  step(slide, ctx, 2, "Diagnose the opportunity", "Kimi scores repetition, risk, complexity, and AI suitability.", 326, C.blue);
  step(slide, ctx, 3, "Research live context", "Bright Data replaces manual browsing with structured public web data.", 416, C.amber);
  step(slide, ctx, 4, "Validate safely", "Daytona sandbox preview runs the generated automation path.", 506, C.mint);
  await ctx.addImage(slide, {
    path: `${ctx.assetDir}/agent-stack.png`,
    left: 690,
    top: 82,
    width: 500,
    height: 538,
    fit: "cover",
    alt: "Abstract AI agent stack illustration"
  });
  footer(slide, ctx, 3);
  return slide;
}
