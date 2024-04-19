const alpha = {};
const alphaUtls = [
  "bg",
  "text",
  "border",
  "outline",
  "shadow",
  "fill",
  "stroke",
  "start",
  "mid",
  "end",
  "accent",
  "caret",
  "placeholder",
];
for (let i in alphaUtls) {
  alpha[alphaUtls[i] + "-alpha"] = "--m-" + alphaUtls[i] + "-c-alpha";
}

const border = {};
const borderSides = ["top", "right", "left", "bottom"];
for (let i in borderSides) {
  border["border-" + borderSides[i][0]] = "border-" + borderSides[i] + "-width";
  border["border-" + borderSides[i][0] + "-s"] =
    "border-" + borderSides[i] + "-style";
  border["border-" + borderSides[i][0] + "-c"] =
    "border-" + borderSides[i] + "-color";
  border["border-" + borderSides[i][0] + "-c-alpha"] =
    "--m-border-c" + borderSides[i] + "-alpha";
}

const filter = {};
const filterUtls = [
  "blur",
  "brightness",
  "contrast",
  "drop-shadow",
  "contrast",
  "grayscale",
  "hue-rotate",
  "invert",
  "saturate",
  "sepia",
  "backdrop-opacity",
];
for (let i in filterUtls) {
  let bValue = "--m-bf-" + filterUtls[i];
  if (filterUtls[i] === "backdrop-opacity")
    filter[filterUtls[i]] = bValue.replace("backdrop-", "");
  else {
    filter[filterUtls[i]] = "--m-f-" + filterUtls[i];
    if (
      !filterUtls[i].includes("shadow") ||
      !filterUtls[i].includes("opacity")
    ) {
      filter["backdrop-" + filterUtls[i]] = bValue;
    }
  }
}

const transform = {};
const transformUtls = ["translate", "rotate", "scale"];
const transformSides = ["x", "y", "z"];
for (let i in transformUtls) {
  for (let j in transformSides) {
    transform[transformUtls[i] + "-" + transformSides[j]] =
      "--m-t-" + transformUtls[i] + "-" + transformSides[j];
  }
}

const transition = {};
const ts_prefixes = ["-webkit-", "-o-", ""];
const ts_delayStr = "-mojo-d-";
const ts_properties = ["duration", "delay", "timing-function", "property"];

ts_properties.forEach((p, i) => {
  const type = `transition-${p}`;
  transition[`ts${i === 0 ? "" : `-${p[0].replace("t", "f")}`}`] =
    ts_prefixes.map((prefix) => `${ts_delayStr}${prefix}${type}`);
  transition[`tsm${i === 0 ? "" : `-${p[0].replace("t", "f")}`}`] =
    ts_prefixes.map((prefix) => `${prefix}${type}`);
});

const background = {};
const bg_properties = [
  "color",
  "attachment",
  "origin",
  "position",
  "repeat",
  "size",
  "img",
  "blend-mode",
];

bg_properties.forEach((p) => {
  background[
    `bg-${p[0].replace("i", "img").replace("b", "blend")}`
  ] = `background-${p.replace("img", "image")}`;
});

export default {
  _: [
    "all",
    "appearance",
    "animation",
    "overflow",
    "overflow-x",
    "overflow-y",
    "user-select",
    "content",
    "resize",
    "clear",
    "order",
    "cursor",
    "float",
    "perspective",
    "will-change",
    "columns",
    "top",
    "right",
    "bottom",
    "left",
    "opacity",
    "flex",
    "visibility",
    "clip-path",
  ],
  "flex-g": "flex-grow",
  "flex-s": "flex-shrink",
  "pointer-e": "pointer-events",
  "user-s": "user-select",
  outline: "outline-width",
  "outline-s": "outline-style",
  "outline-c": "outline-color",
  "outline-o": "outline-offset",
  dir: "direction",
  font: "font-family",
  p: "position",
  d: "display",
  "transform-o": "transform-origin",
  "transform-s": "transform-style",
  "perspective-o": "perspective-origin",
  "fill-c": "fill",
  "stroke-c": "stroke",
  "stroke-dash": "stroke-dasharray",
  "list-style": "list-style-type",
  "list-style-p": "list-style-position",
  scroll: "scroll-behavior",
  touch: "touch-action",
  overscroll: "overscroll-behavior",
  "overscroll-x": "overscroll-behavior-x",
  "overscroll-y": "overscroll-behavior-y",
  "mix-blend": "mix-blend-mode",
  "obj-f": "object-fit",
  "obj-p": "object-position",
  "box-s": "box-sizing",
  bg: "background",
  "bg-clip": "background-clip",
  ...background,
  ma: "margin",
  mt: "margin-top",
  mb: "margin-bottom",
  ml: "margin-left",
  mr: "margin-right",
  mx: ["margin-left", "margin-right"],
  my: ["margin-top", "margin-bottom"],
  ms: "margin-inline-start",
  me: "margin-inline-end",
  pa: "padding",
  pt: "padding-top",
  pb: "padding-bottom",
  pl: "padding-left",
  pr: "padding-right",
  px: ["padding-left", "padding-right"],
  py: ["padding-top", "padding-bottom"],
  ps: "padding-inline-start",
  pe: "padding-inline-end",
  gap: "gap",
  "gap-x": ["column-gap", "grid-column-gap"],
  "gap-y": ["row-gap", "grid-row-gap"],
  w: "width",
  h: "height",
  "min-w": "min-width",
  "min-h": "min-height",
  "max-w": "max-width",
  "max-h": "max-height",
  inset: ["top", "right", "bottom", "left"],
  "inset-x": ["right", "left"],
  "inset-y": ["top", "bottom"],
  rounded: "border-radius",
  "rounded-t": ["border-top-right-radius", "border-top-left-radius"],
  "rounded-b": ["border-bottom-right-radius", "border-bottom-left-radius"],
  "rounded-r": ["border-top-right-radius", "border-bottom-right-radius"],
  "rounded-l": ["border-top-left-radius", "border-bottom-left-radius"],
  "rounded-t-r": "border-top-right-radius",
  "rounded-t-l": "border-top-left-radius",
  "rounded-b-r": "border-bottom-right-radius",
  "rounded-b-l": "border-bottom-left-radius",
  text: "font-size",
  "text-c": "color",
  "text-a": "text-align",
  "text-ls": "letter-spacing",
  "text-lh": "line-height",
  "text-ws": "white-space",
  "text-w": "font-weight",
  "text-d": "text-decoration",
  "text-s": "font-style",
  "text-t": "text-transform",
  "v-align": "vertical-align",
  z: "z-index",
  ...alpha,
  "accent-c": "accent-color",
  "caret-c": "caret-color",
  placeholder: "font-size",
  "placeholder-c": "color",
  border: "border-width",
  "border-s": "border-style",
  "border-c": "border-color",
  ...border,
  ...transition,
  cols: "grid-template-columns",
  rows: "grid-template-rows",
  col: "grid-column",
  "col-offset": "grid-column-start",
  "c-span": "grid-column",
  "c-start": "grid-column-start",
  "c-end": "grid-column-end",
  "r-span": "grid-row",
  "r-start": "grid-row-start",
  "r-end": "grid-row-end",
  "j-items": "justify-items",
  "j-content": "justify-content",
  "j-self": "justify-self",
  "a-items": "align-items",
  "a-content": "align-content",
  "a-self": "align-self",
  "p-items": "place-items",
  "p-content": "place-content",
  "p-self": "place-self",
  ...filter,
  scale: ["--m-t-scale"],
  rotate: "--m-t-rotate",
  "skew-x": "--m-t-skew-x",
  "skew-y": "--m-t-skew-y",
  ...transform,
  shadow: "box-shadow",
  "shadow-c": "--m-shadow-color",
  "shadow-solid": "box-shadow",
  "start-c": "--m-gd-start-color",
  "mid-c": "--m-gd-mid-color",
  "end-c": "--m-gd-end-color",
  "gd-dir": "--m-gd-dir",
};
