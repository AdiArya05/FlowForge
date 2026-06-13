export const C = {
  bg: "#070A0F",
  panel: "#111722",
  panel2: "#172131",
  text: "#F2F7FF",
  muted: "#A6B2C4",
  blue: "#68A8FF",
  mint: "#3DDC97",
  amber: "#FFC857",
  line: "#263141"
};

export const fonts = {
  title: "Arial",
  body: "Arial",
  mono: "Courier New"
};

export function bg(slide, ctx) {
  ctx.addShape(slide, { left: 0, top: 0, width: 1280, height: 720, fill: C.bg });
  ctx.addShape(slide, { left: 0, top: 0, width: 1280, height: 720, fill: "#0B111A" });
  ctx.addShape(slide, { left: 0, top: 0, width: 1280, height: 720, fill: "#070A0F", opacity: 0.78 });
}

export function footer(slide, ctx, n) {
  ctx.addText(slide, {
    left: 46,
    top: 668,
    width: 260,
    height: 24,
    text: `FlowForge / ${String(n).padStart(2, "0")}`,
    fontSize: 11,
    color: C.muted,
    typeface: fonts.body
  });
  ctx.addText(slide, {
    left: 1086,
    top: 666,
    width: 150,
    height: 26,
    text: "FlowForge",
    fontSize: 14,
    color: C.text,
    bold: true,
    align: "right",
    typeface: fonts.body
  });
}

export function kicker(slide, ctx, label, x = 58, y = 48) {
  ctx.addShape(slide, {
    left: x,
    top: y + 6,
    width: 24,
    height: 4,
    fill: C.mint,
    name: `kicker-${label}-marker`
  });
  ctx.addText(slide, {
    left: x + 34,
    top: y,
    width: 360,
    height: 18,
    text: label.toUpperCase(),
    fontSize: 11,
    color: C.mint,
    bold: true,
    typeface: fonts.body,
    name: `kicker-${label}-label`
  });
}

export function title(slide, ctx, text, x = 58, y = 82, w = 760, size = 46) {
  ctx.addText(slide, {
    left: x,
    top: y,
    width: w,
    height: 120,
    text,
    fontSize: size,
    color: C.text,
    bold: true,
    typeface: fonts.title,
    insets: { left: 0, right: 0, top: 0, bottom: 0 }
  });
}

export function body(slide, ctx, text, x, y, w, h, size = 20) {
  ctx.addText(slide, {
    left: x,
    top: y,
    width: w,
    height: h,
    text,
    fontSize: size,
    color: C.muted,
    typeface: fonts.body,
    insets: { left: 0, right: 0, top: 0, bottom: 0 }
  });
}

export function chip(slide, ctx, text, x, y, w, color = C.blue) {
  ctx.addShape(slide, {
    left: x,
    top: y,
    width: w,
    height: 34,
    fill: C.panel2,
    line: { fill: color, width: 1, style: "solid" }
  });
  ctx.addText(slide, {
    left: x + 12,
    top: y + 9,
    width: w - 24,
    height: 17,
    text,
    fontSize: 11,
    color: C.text,
    bold: true,
    align: "center",
    typeface: fonts.body
  });
}

export function metric(slide, ctx, value, label, x, y, w = 180, color = C.blue) {
  ctx.addShape(slide, {
    left: x,
    top: y,
    width: w,
    height: 92,
    fill: C.panel,
    line: { fill: C.line, width: 1, style: "solid" }
  });
  ctx.addText(slide, {
    left: x + 18,
    top: y + 16,
    width: w - 36,
    height: 36,
    text: value,
    fontSize: 30,
    color,
    bold: true,
    typeface: fonts.body
  });
  ctx.addText(slide, {
    left: x + 18,
    top: y + 54,
    width: w - 36,
    height: 20,
    text: label,
    fontSize: 12,
    color: C.muted,
    typeface: fonts.body
  });
}
