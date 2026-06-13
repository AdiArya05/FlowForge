import { bg, body, C, footer, kicker, title } from "./theme.mjs";

export async function slide02(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  kicker(slide, ctx, "hidden ops pain");
  title(slide, ctx, "Repetitive workflows are everywhere, but they rarely become automations.", 58, 86, 560, 34);
  body(
    slide,
    ctx,
    "Teams still burn hours on small manual loops: searching sites, copying fields, summarizing pages, filling spreadsheets, and repeating the pattern for every new row.",
    62,
    238,
    500,
    118,
    20
  );
  body(
    slide,
    ctx,
    "The missing signal is not intent. It is observed behavior: what people actually do, step by step, before anyone writes a spec.",
    62,
    388,
    500,
    78,
    20
  );
  ctx.addShape(slide, { left: 60, top: 520, width: 460, height: 2, fill: C.line });
  body(slide, ctx, "FlowForge starts from a screen recording, not a blank prompt.", 62, 544, 500, 34, 18);
  await ctx.addImage(slide, {
    path: `${ctx.assetDir}/workflow-automation.png`,
    left: 666,
    top: 74,
    width: 540,
    height: 560,
    fit: "cover",
    alt: "Abstract workflow automation illustration"
  });
  footer(slide, ctx, 2);
  return slide;
}
