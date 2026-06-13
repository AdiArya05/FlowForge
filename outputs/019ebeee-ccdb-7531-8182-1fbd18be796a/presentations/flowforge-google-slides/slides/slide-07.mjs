import { bg, C, fonts, footer, kicker, title } from "./theme.mjs";

function lane(slide, ctx, label, detail, x, color) {
  ctx.addShape(slide, { left: x, top: 286, width: 300, height: 190, fill: C.panel, line: { fill: color, width: 1, style: "solid" } });
  ctx.addText(slide, { left: x + 22, top: 312, width: 250, height: 34, text: label, fontSize: 22, color, bold: true, typeface: fonts.body });
  ctx.addText(slide, { left: x + 22, top: 362, width: 246, height: 82, text: detail, fontSize: 16, color: C.muted, typeface: fonts.body });
}

export async function slide07(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  kicker(slide, ctx, "next move");
  title(slide, ctx, "FlowForge can become the workflow mining layer for AI transformation.", 58, 86, 950, 46);
  lane(slide, ctx, "Wedge", "Start with vendor research, sales ops, and repetitive spreadsheet workflows.", 78, C.mint);
  lane(slide, ctx, "Expansion", "Turn every observed workflow into an automation suggestion and approval flow.", 490, C.blue);
  lane(slide, ctx, "Ask", "Use sponsor stack credits to wire real VideoDB ingestion and Daytona execution next.", 902, C.amber);
  ctx.addText(slide, { left: 160, top: 540, width: 960, height: 72, text: "Close: this is not a chatbot. It is an AI operations analyst that discovers where automation should exist and ships the first safe draft.", fontSize: 22, color: C.text, bold: true, align: "center", typeface: fonts.body });
  footer(slide, ctx, 7);
  return slide;
}
