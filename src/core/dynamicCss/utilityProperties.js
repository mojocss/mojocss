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
  border["border-" + borderSides[i]] = "border-" + borderSides[i] + "-width";
  border["border-" + borderSides[i] + "-s"] =
    "border-" + borderSides[i] + "-style";
  border["border-" + borderSides[i] + "-c"] =
    "border-" + borderSides[i] + "-color";
  border["border-" + borderSides[i] + "-c-alpha"] =
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
    "pointer-events",
    "will-change",
    "columns",
    "top",
    "right",
    "bottom",
    "left",
    "opacity",
    "flex-grow",
    "flex-shrink",
    "flex",
    "visibility",
    "clip-path",
  ],
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
  "bg-c": "background-color",
  "bg-a": "background-attachment",
  "bg-o": "background-origin",
  "bg-p": "background-position",
  "bg-r": "background-repeat",
  "bg-s": "background-size",
  "bg-img": "background-image",
  "bg-blend": "background-blend-mode",
  "bg-clip": "background-clip",
  ma: "margin",
  mt: "margin-top",
  mb: "margin-bottom",
  ml: "margin-left",
  mr: "margin-right",
  mx: ["margin-left", "margin-right"],
  my: ["margin-top", "margin-bottom"],
  pa: "padding",
  pt: "padding-top",
  pb: "padding-bottom",
  pl: "padding-left",
  pr: "padding-right",
  px: ["padding-left", "padding-right"],
  py: ["padding-top", "padding-bottom"],
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
  "rounded-top": ["border-top-right-radius", "border-top-left-radius"],
  "rounded-bottom": ["border-bottom-right-radius", "border-bottom-left-radius"],
  "rounded-right": ["border-top-right-radius", "border-bottom-right-radius"],
  "rounded-left": ["border-top-left-radius", "border-bottom-left-radius"],
  "rounded-top-r": "border-top-right-radius",
  "rounded-top-l": "border-top-left-radius",
  "rounded-bottom-r": "border-bottom-right-radius",
  "rounded-bottom-l": "border-bottom-left-radius",
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
  ts: [
    "-mojo-delay--webkit-transition-duration",
    "-mojo-delay--o-transition-duration",
    "-mojo-delay-transition-duration",
  ],
  "ts-d": [
    "-mojo-delay--webkit-transition-delay",
    "-mojo-delay--o-transition-delay",
    "-mojo-delay-transition-delay",
  ],
  "ts-f": [
    "-mojo-delay--webkit-transition-timing-function",
    "-mojo-delay--o-transition-timing-function",
    "-mojo-delay-transition-timing-function",
  ],
  "ts-p": [
    "-mojo-delay--webkit-transition-property",
    "-mojo-delay--o-transition-property",
    "-mojo-delay-transition-property",
  ],
  tsm: [
    "-webkit-transition-duration",
    "-o-transition-duration",
    "transition-duration",
  ],
  "tsm-d": [
    "-webkit-transition-delay",
    "-o-transition-delay",
    "transition-delay",
  ],
  "tsm-f": [
    "-webkit-transition-timing-function",
    "-o-transition-timing-function",
    "transition-timing-function",
  ],
  "tsm-p": [
    "-webkit-transition-property",
    "-o-transition-property",
    "transition-property",
  ],
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
