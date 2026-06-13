import { bg, C, fonts, footer, kicker, title } from "./theme.mjs";

function node(slide, ctx, label, detail, x, y, color) {
  ctx.addShape(slide, { left: x, top: y, width: 250, height: 116, fill: C.panel, line: { fill: color, width: 1, style: "solid" } });
  ctx.addText(slide, { left: x + 18, top: y + 18, width: 214, height: 24, text: label, fontSize: 20, color, bold: true, typeface: fonts.body });
  ctx.addText(slide, { left: x + 18, top: y + 50, width: 210, height: 44, text: detail, fontSize: 14, color: C.muted, typeface: fonts.body });
}

export async function slide04(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  kicker(slide, ctx, "sponsor stack");
  title(slide, ctx, "The sponsors combine into one production agent loop.", 58, 84, 760, 42);
  node(slide, ctx, "VideoDB", "Sees the screen recording and extracts workflow evidence.", 96, 238, C.mint);
  node(slide, ctx, "Kimi API", "Reasons over the workflow and generates the automation plan.", 384, 238, C.amber);
  node(slide, ctx, "Bright Data", "Fetches live public web data for each repeated research step.", 672, 238, C.blue);
  node(slide, ctx, "Daytona", "Runs the generated automation safely before deployment.", 960, 238, C.mint);
  ctx.addShape(slide, { left: 350, top: 292, width: 28, height: 4, fill: C.line });
  ctx.addShape(slide, { left: 638, top: 292, width: 28, height: 4, fill: C.line });
  ctx.addShape(slide, { left: 926, top: 292, width: 28, height: 4, fill: C.line });
  ctx.addText(slide, { left: 160, top: 430, width: 960, height: 72, text: "The wedge is not another assistant. It is a workflow mining layer that discovers where AI should be applied, then proves the first automation safely.", fontSize: 25, color: C.text, bold: true, align: "center", typeface: fonts.body });
  ctx.addText(slide, { left: 260, top: 532, width: 760, height: 54, text: "Every sponsor product has a core job in the loop, so usage is integral rather than decorative.", fontSize: 18, color: C.muted, align: "center", typeface: fonts.body });
  footer(slide, ctx, 4);
  return slide;
}
