import { bg, C, fonts, footer, kicker, metric, title } from "./theme.mjs";

export async function slide05(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  kicker(slide, ctx, "live demo proof");
  title(slide, ctx, "The MVP already turns vendor research into a scored automation run.", 58, 84, 900, 40);
  metric(slide, ctx, "93%", "repetition detected", 70, 220, 200, C.mint);
  metric(slide, ctx, "41", "complexity score", 294, 220, 200, C.blue);
  metric(slide, ctx, "22", "risk score", 518, 220, 200, C.amber);
  metric(slide, ctx, "3.5-6h", "saved per 100 rows", 742, 220, 220, C.mint);
  ctx.addShape(slide, { left: 70, top: 360, width: 1050, height: 186, fill: C.panel, line: { fill: C.line, width: 1, style: "solid" } });
  ctx.addText(slide, { left: 92, top: 382, width: 280, height: 22, text: "Bright Data research output", fontSize: 16, color: C.blue, bold: true, typeface: fonts.body });
  ctx.addText(slide, { left: 92, top: 426, width: 210, height: 24, text: "Linear", fontSize: 18, color: C.text, bold: true, typeface: fonts.body });
  ctx.addText(slide, { left: 310, top: 426, width: 430, height: 44, text: "Purpose-built product development workflows for high-velocity software teams.", fontSize: 14, color: C.muted, typeface: fonts.body });
  ctx.addText(slide, { left: 774, top: 426, width: 160, height: 24, text: "/pricing", fontSize: 14, color: C.mint, typeface: fonts.body });
  ctx.addText(slide, { left: 92, top: 486, width: 210, height: 24, text: "Notion", fontSize: 18, color: C.text, bold: true, typeface: fonts.body });
  ctx.addText(slide, { left: 310, top: 486, width: 430, height: 44, text: "AI workspace for docs, projects, knowledge work, and automations.", fontSize: 14, color: C.muted, typeface: fonts.body });
  ctx.addText(slide, { left: 774, top: 486, width: 220, height: 24, text: "/contact-sales", fontSize: 14, color: C.mint, typeface: fonts.body });
  ctx.addText(slide, { left: 70, top: 574, width: 1060, height: 56, text: "Demo line: FlowForge watched a repeated manual research workflow once; now it can do the next rows automatically.", fontSize: 20, color: C.text, bold: true, align: "center", typeface: fonts.body });
  footer(slide, ctx, 5);
  return slide;
}
