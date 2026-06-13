import { bg, body, chip, C, footer, kicker, metric, title } from "./theme.mjs";

export async function slide01(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  kicker(slide, ctx, "agent forge demo");
  title(slide, ctx, "FlowForge turns observed work into tested automation.", 58, 88, 770, 50);
  body(
    slide,
    ctx,
    "A workflow auditor for the AI era: watch a repetitive task once, diagnose where AI belongs, research live web data, generate the automation, and validate it safely.",
    62,
    260,
    760,
    88,
    22
  );
  chip(slide, ctx, "VideoDB perception", 64, 390, 176, C.mint);
  chip(slide, ctx, "Bright Data web", 254, 390, 168, C.blue);
  chip(slide, ctx, "Kimi reasoning", 436, 390, 150, C.amber);
  chip(slide, ctx, "Daytona sandbox", 600, 390, 170, C.mint);
  metric(slide, ctx, "93%", "repetition detected", 906, 112, 210, C.mint);
  metric(slide, ctx, "4", "sponsor products in loop", 906, 226, 210, C.blue);
  metric(slide, ctx, "1", "recording to automation", 906, 340, 210, C.amber);
  footer(slide, ctx, 1);
  return slide;
}
