import { bg, C, fonts, footer, kicker, title } from "./theme.mjs";

function layer(slide, ctx, label, detail, y, color) {
  ctx.addShape(slide, { left: 64, top: y, width: 500, height: 72, fill: C.panel, line: { fill: color, width: 1, style: "solid" } });
  ctx.addText(slide, { left: 86, top: y + 14, width: 190, height: 24, text: label, fontSize: 18, color, bold: true, typeface: fonts.body });
  ctx.addText(slide, { left: 280, top: y + 14, width: 250, height: 38, text: detail, fontSize: 13, color: C.muted, typeface: fonts.body });
}

export async function slide06(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  kicker(slide, ctx, "architecture");
  title(slide, ctx, "The system is designed to graduate from demo to production.", 58, 84, 560, 34);
  layer(slide, ctx, "Observe", "screen recordings become structured evidence", 232, C.mint);
  layer(slide, ctx, "Reason", "Kimi scores automation potential and writes a plan", 320, C.amber);
  layer(slide, ctx, "Research", "Bright Data retrieves live public web context", 408, C.blue);
  layer(slide, ctx, "Execute", "Daytona validates generated automation safely", 496, C.mint);
  await ctx.addImage(slide, {
    path: `${ctx.assetDir}/demo-command-center.png`,
    left: 690,
    top: 86,
    width: 500,
    height: 528,
    fit: "cover",
    alt: "Abstract demo command center illustration"
  });
  footer(slide, ctx, 6);
  return slide;
}
