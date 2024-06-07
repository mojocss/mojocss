import mojoCore from "../src/core/index.js";
import config from "../src/interop/mojo.config.js";

describe("MojoCore:: Check Utilities Results", () => {
  beforeAll(() => {
    config.options.minify = true;
    mojoCore.setConfig(config);
  });

  let utilities = {
    "bg-alpha-10": "--m-bg-c-alpha: 0.1",
    "text-alpha-15": "--m-text-c-alpha: 0.15",
    "border-alpha-20": "--m-border-c-alpha: 0.2",
    "border-alpha-25": "--m-border-c-alpha: 0.25",
    "outline-alpha-30": "--m-outline-c-alpha: 0.3",
    "shadow-alpha-35": "--m-shadow-c-alpha: 0.35000000000000003",
    "fill-alpha-40": "--m-fill-c-alpha: 0.4",
    "stroke-alpha-45": "--m-stroke-c-alpha: 0.45",
    "start-alpha-50": "--m-start-c-alpha: 0.5",
    "end-alpha-55": "--m-end-c-alpha: 0.55",
    "mid-alpha-60": "--m-mid-c-alpha: 0.6",
    "accent-alpha-65": "--m-accent-c-alpha: 0.65",
    "caret-alpha-70": "--m-caret-c-alpha: 0.7000000000000001",
    "placeholder-alpha-75": "--m-placeholder-c-alpha: 0.75",
    "top-4": "top: 1rem",
    "left-6": "left: 1.5rem",
    "right-2": "right: 0.5rem",
    "bottom-8": "bottom: 2rem",
    "border-2": "border-width: 2px",
    "border-t-1": "border-top-width: 1px",
    "border-l-2": "border-left-width: 2px",
    "border-r-3": "border-right-width: 3px",
    "border-b-4": "border-bottom-width: 4px",
    "border-s-dotted": "border-style: dotted",
    "border-t-s-dashed": "border-top-style: dashed",
    "border-l-s-solid": "border-left-style: solid",
    "border-r-s-double": "border-right-style: double",
    "border-b-s-groove": "border-bottom-style: groove",
    "border-c-primary":
      "--m-border-c-lightness: 0%;\n" +
      "    --m-border-c-alpha: 1;\n" +
      "    border-color: hsla(var(--m-color-primary), calc(var(--m-color-primary-l) + var(--m-border-c-lightness)), var(--m-border-c-alpha))",
    "border-t-c-green":
      "--m-border-t-c-lightness: 0%;\n" +
      "    --m-border-t-c-alpha: 1;\n" +
      "    border-top-color: hsla(var(--m-color-green), calc(var(--m-color-green-l) + var(--m-border-t-c-lightness)), var(--m-border-t-c-alpha))",
    "border-l-c-white":
      "--m-border-l-c-lightness: 0%;\n" +
      "    --m-border-l-c-alpha: 1;\n" +
      "    border-left-color: hsla(var(--m-color-white), calc(var(--m-color-white-l) + var(--m-border-l-c-lightness)), var(--m-border-l-c-alpha))",
    "border-r-c-white":
      "--m-border-r-c-lightness: 0%;\n" +
      "    --m-border-r-c-alpha: 1;\n" +
      "    border-right-color: hsla(var(--m-color-white), calc(var(--m-color-white-l) + var(--m-border-r-c-lightness)), var(--m-border-r-c-alpha))",
    "border-b-c-red":
      "--m-border-b-c-lightness: 0%;\n" +
      "    --m-border-b-c-alpha: 1;\n" +
      "    border-bottom-color: hsla(var(--m-color-red), calc(var(--m-color-red-l) + var(--m-border-b-c-lightness)), var(--m-border-b-c-alpha))",
    "blur-4":
      "--m-f-blur: blur(4px);\n    filter: var(--m-f-blur) var(--m-f-brightness) var(--m-f-contrast) var(--m-f-grayscale) var(--m-f-hue-rotate) var(--m-f-invert) var(--m-f-saturate) var(--m-f-sepia) var(--m-f-drop-shadow)",
    "brightness-50":
      "--m-f-brightness: brightness(0.5);\n    filter: var(--m-f-blur) var(--m-f-brightness) var(--m-f-contrast) var(--m-f-grayscale) var(--m-f-hue-rotate) var(--m-f-invert) var(--m-f-saturate) var(--m-f-sepia) var(--m-f-drop-shadow)",
    "contrast-125":
      "--m-f-contrast: contrast(1.25);\n    filter: var(--m-f-blur) var(--m-f-brightness) var(--m-f-contrast) var(--m-f-grayscale) var(--m-f-hue-rotate) var(--m-f-invert) var(--m-f-saturate) var(--m-f-sepia) var(--m-f-drop-shadow)",
    "hue-rotate-85":
      "--m-f-hue-rotate: hue-rotate(85deg);\n    filter: var(--m-f-blur) var(--m-f-brightness) var(--m-f-contrast) var(--m-f-grayscale) var(--m-f-hue-rotate) var(--m-f-invert) var(--m-f-saturate) var(--m-f-sepia) var(--m-f-drop-shadow)",
    "grayscale-100":
      "--m-f-grayscale: grayscale(1);\n    filter: var(--m-f-blur) var(--m-f-brightness) var(--m-f-contrast) var(--m-f-grayscale) var(--m-f-hue-rotate) var(--m-f-invert) var(--m-f-saturate) var(--m-f-sepia) var(--m-f-drop-shadow)",
    "invert-30":
      "--m-f-invert: invert(0.3);\n    filter: var(--m-f-blur) var(--m-f-brightness) var(--m-f-contrast) var(--m-f-grayscale) var(--m-f-hue-rotate) var(--m-f-invert) var(--m-f-saturate) var(--m-f-sepia) var(--m-f-drop-shadow)",
    "saturate-60":
      "--m-f-saturate: saturate(0.6);\n    filter: var(--m-f-blur) var(--m-f-brightness) var(--m-f-contrast) var(--m-f-grayscale) var(--m-f-hue-rotate) var(--m-f-invert) var(--m-f-saturate) var(--m-f-sepia) var(--m-f-drop-shadow)",
    "sepia-0":
      "--m-f-sepia: sepia(0);\n    filter: var(--m-f-blur) var(--m-f-brightness) var(--m-f-contrast) var(--m-f-grayscale) var(--m-f-hue-rotate) var(--m-f-invert) var(--m-f-saturate) var(--m-f-sepia) var(--m-f-drop-shadow)",
    "backdrop-opacity-20":
      "--m-bf-opacity: opacity(0.2);\n    -webkit-backdrop-filter: var(--m-bf-blur) var(--m-bf-brightness) var(--m-bf-contrast) var(--m-bf-grayscale) var(--m-bf-hue-rotate) var(--m-bf-invert) var(--m-bf-saturate) var(--m-bf-sepia) var(--m-bf-opacity);\n    backdrop-filter: var(--m-bf-blur) var(--m-bf-brightness) var(--m-bf-contrast) var(--m-bf-grayscale) var(--m-bf-hue-rotate) var(--m-bf-invert) var(--m-bf-saturate) var(--m-bf-sepia) var(--m-bf-opacity)",
    "transform-o-top-left": "transform-origin: top left",
    "all-initial": "all: initial",
    "appearance-none": "appearance: none",
    "overflow-hidden": "overflow: hidden",
    "overflow-x-visible": "overflow-x: visible",
    "overflow-y-scroll": "overflow-y: scroll",
    "content-''": "content: ''",
    "resize-both": "resize: both",
    "order-last": "order: 99999",
    "cursor-pointer": "cursor: pointer",
    "float-left": "float: left",
    "pointer-e-auto": "pointer-events: auto",
    "opacity-50": "opacity: 0.5",
    "flex-g-1": "flex-grow: 1",
    "flex-s-1": "flex-shrink: 1",
    "flex-auto-auto": "flex: 1 1 auto",
    "visibility-visible": "visibility: visible",
    "outline-4": "outline-width: 4px;\n    outline-style:solid",
    "outline-s-dotted": "outline-style: dotted",
    "outline-c-red":
      "--m-outline-c-lightness: 0%;\n" +
      "    --m-outline-c-alpha: 1;\n" +
      "    outline-color: hsla(var(--m-color-red), calc(var(--m-color-red-l) + var(--m-outline-c-lightness)), var(--m-outline-c-alpha))",
    "outline-o-5": "outline-offset: 1.25rem",
    "dir-rtl": "direction: rtl",
    "font-default":
      "font-family: system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif",
    "p-absolute": "position: absolute",
    "d-flex":
      "display: flex;\n    --m-box-start: flex-start;\n    --m-box-end: flex-end",
    "transform-o-top-right": "transform-origin: top right",
    "transform-s-preserve-3d": "transform-style: preserve-3d",
    "perspective-o-left": "perspective-origin: left",
    "perspective-20": "perspective: 5rem",
    "stroke-c-blue":
      "--m-stroke-c-lightness: 0%;\n" +
      "    --m-stroke-c-alpha: 1;\n" +
      "    stroke: hsla(var(--m-color-blue), calc(var(--m-color-blue-l) + var(--m-stroke-c-lightness)), var(--m-stroke-c-alpha))",
    "list-style-none": "list-style-type: none",
    "list-style-p-outside": "list-style-position: outside",
    "scroll-contain": "scroll-behavior: contain",
    "mix-blend-lighten": "mix-blend-mode: lighten",
    "obj-f-cover": "object-fit: cover",
    "box-s-border-box": "box-sizing: border-box-box",
    "bg-none": "background: none",
    "bg-c-red":
      "--m-bg-c-lightness: 0%;\n" +
      "    --m-bg-c-alpha: 1;\n" +
      "    background-color: hsla(var(--m-color-red), calc(var(--m-color-red-l) + var(--m-bg-c-lightness)), var(--m-bg-c-alpha))",
    "bg-s-cover": "background-size: cover",
    "bg-p-center": "background-position: center",
    "bg-o-border": "background-origin: border-box",
    "bg-clip-border": "background-clip: border-box",
    "bg-r-repeat": "background-repeat: repeat",
    "bg-a-fixed": "background-attachment: fixed",
    "ma-4": "margin: 1rem",
    "-ma-3": "margin: -0.75rem",
    "mt-6": "margin-top: 1.5rem",
    "-mt-12": "margin-top: -3rem",
    "ml-1": "margin-left: 0.25rem",
    "-ml-5": "margin-left: -1.25rem",
    "mr-7": "margin-right: 1.75rem",
    "mb-18": "margin-bottom: 4.5rem",
    "-mb-28": "margin-bottom: -7rem",
    "mx-4": "margin-left: 1rem;\n    margin-right: 1rem",
    "-mx-6": "margin-left: -1.5rem;\n    margin-right: -1.5rem",
    "my-5": "margin-top: 1.25rem;\n    margin-bottom: 1.25rem",
    "-my-7": "margin-top: -1.75rem;\n    margin-bottom: -1.75rem",
    "pa-4": "padding: 1rem",
    "pt-5": "padding-top: 1.25rem",
    "pr-6": "padding-right: 1.5rem",
    "pl-1": "padding-left: 0.25rem",
    "pb-2": "padding-bottom: 0.5rem",
    "px-3": "padding-left: 0.75rem;\n    padding-right: 0.75rem",
    "py-7": "padding-top: 1.75rem;\n    padding-bottom: 1.75rem",
    "gap-5": "gap: 1.25rem",
    "gap-x-8": "column-gap: 2rem;\n    grid-column-gap: 2rem",
    "gap-y-4": "row-gap: 1rem;\n    grid-row-gap: 1rem",
    "w-8": "width: 2rem",
    "h-8": "height: 2rem",
    "min-w-4": "min-width: 1rem",
    "min-h-4": "min-height: 1rem",
    "max-w-16": "max-width: 4rem",
    "max-h-16": "max-height: 4rem",
    "inset-0":
      "top: 0rem;\n    right: 0rem;\n    bottom: 0rem;\n    left: 0rem",
    "inset-x-0": "right: 0rem;\n    left: 0rem",
    "inset-y-0": "top: 0rem;\n    bottom: 0rem",
    "rounded-full": "border-radius: 999rem",
    "rounded-8": "border-radius: 1rem",
    "rounded-t-4":
      "border-top-right-radius: 0.5rem;\n    border-top-left-radius: 0.5rem",
    "rounded-b-5":
      "border-bottom-right-radius: 0.625rem;\n    border-bottom-left-radius: 0.625rem",
    "rounded-r-6":
      "border-top-right-radius: 0.75rem;\n    border-bottom-right-radius: 0.75rem",
    "rounded-l-7":
      "border-top-left-radius: 0.875rem;\n    border-bottom-left-radius: 0.875rem",
    "rounded-t-r-8": "border-top-right-radius: 1rem",
    "rounded-t-l-9": "border-top-left-radius: 1.125rem",
    "rounded-b-r-10": "border-bottom-right-radius: 1.25rem",
    "rounded-b-l-11": "border-bottom-left-radius: 1.375rem",
    "text-200": "font-size: 2rem",
    "text-c-orange":
      "--m-text-c-lightness: 0%;\n" +
      "    --m-text-c-alpha: 1;\n" +
      "    color: hsla(var(--m-color-orange), calc(var(--m-color-orange-l) + var(--m-text-c-lightness)), var(--m-text-c-alpha))",
    "text-a-center": "text-align: center",
    "text-ls-loose": "letter-spacing: 0.05em",
    "text-lh-open": "line-height: 2",
    "text-ws-nowrap": "white-space: nowrap",
    "text-d-none": "text-decoration: none",
    "text-s-italic": "font-style: italic",
    "text-t-uppercase": "text-transform: uppercase",
    "v-align-middle": "vertical-align: middle",
    "z-100": "z-index: 100",
    "accent-c-red":
      "--m-accent-c-lightness: 0%;\n" +
      "    --m-accent-c-alpha: 1;\n" +
      "    accent-color: hsla(var(--m-color-red), calc(var(--m-color-red-l) + var(--m-accent-c-lightness)), var(--m-accent-c-alpha))",
    "caret-c-blue":
      "--m-caret-c-lightness: 0%;\n" +
      "    --m-caret-c-alpha: 1;\n" +
      "    caret-color: hsla(var(--m-color-blue), calc(var(--m-color-blue-l) + var(--m-caret-c-lightness)), var(--m-caret-c-alpha))",
    "gd-dir-bottom-right": "--m-gd-dir: to bottom right",
    "end-c-red":
      "--m-end-c-lightness: 0%;\n" +
      "    --m-end-c-alpha: 1;\n" +
      "    --m-gd-end-color: hsla(var(--m-color-red), calc(var(--m-color-red-l) + var(--m-end-c-lightness)), var(--m-end-c-alpha))",
    "start-c-blue":
      "--m-start-c-lightness: 0%;\n" +
      "    --m-start-c-alpha: 1;\n" +
      "    --m-gd-start-color: hsla(var(--m-color-blue), calc(var(--m-color-blue-l) + var(--m-start-c-lightness)), var(--m-start-c-alpha))",
    "mid-c-green":
      "--m-mid-c-lightness: 0%;\n" +
      "    --m-mid-c-alpha: 1;\n" +
      "    --m-gd-mid-color: hsla(var(--m-color-green), calc(var(--m-color-green-l) + var(--m-mid-c-lightness)), var(--m-mid-c-alpha)),",
    "shadow-solid-1": "box-shadow: 0 0 0 1px var(--m-shadow-color, #000)",
    "shadow-c-red":
      "--m-shadow-c-lightness: 0%;\n" +
      "    --m-shadow-c-alpha: 1;\n" +
      "    --m-shadow-color: hsla(var(--m-color-red), calc(var(--m-color-red-l) + var(--m-shadow-c-lightness)), var(--m-shadow-c-alpha))",
    "translate-x-12":
      "--m-t-translate-x: 3rem;\n    transform: translateX(var(--m-t-translate-x)) translateY(var(--m-t-translate-y)) translateZ(var(--m-t-translate-z)) rotate(var(--m-t-rotate)) rotateX(var(--m-t-rotate-x)) rotateY(var(--m-t-rotate-y)) rotateZ(var(--m-t-rotate-z)) skewX(var(--m-t-skew-x)) skewY(var(--m-t-skew-y)) scale3d(var(--m-t-scale),var(--m-t-scale),var(--m-t-scale)) scaleX(var(--m-t-scale-x)) scaleY(var(--m-t-scale-y)) scaleZ(var(--m-t-scale-z))",
    "-translate-x-12":
      "--m-t-translate-x: -3rem;\n    transform: translateX(var(--m-t-translate-x)) translateY(var(--m-t-translate-y)) translateZ(var(--m-t-translate-z)) rotate(var(--m-t-rotate)) rotateX(var(--m-t-rotate-x)) rotateY(var(--m-t-rotate-y)) rotateZ(var(--m-t-rotate-z)) skewX(var(--m-t-skew-x)) skewY(var(--m-t-skew-y)) scale3d(var(--m-t-scale),var(--m-t-scale),var(--m-t-scale)) scaleX(var(--m-t-scale-x)) scaleY(var(--m-t-scale-y)) scaleZ(var(--m-t-scale-z))",
    "-translate-x-(5px)":
      "--m-t-translate-x: -5px;\n    transform: translateX(var(--m-t-translate-x)) translateY(var(--m-t-translate-y)) translateZ(var(--m-t-translate-z)) rotate(var(--m-t-rotate)) rotateX(var(--m-t-rotate-x)) rotateY(var(--m-t-rotate-y)) rotateZ(var(--m-t-rotate-z)) skewX(var(--m-t-skew-x)) skewY(var(--m-t-skew-y)) scale3d(var(--m-t-scale),var(--m-t-scale),var(--m-t-scale)) scaleX(var(--m-t-scale-x)) scaleY(var(--m-t-scale-y)) scaleZ(var(--m-t-scale-z))",
    "translate-y-12":
      "--m-t-translate-y: 3rem;\n    transform: translateX(var(--m-t-translate-x)) translateY(var(--m-t-translate-y)) translateZ(var(--m-t-translate-z)) rotate(var(--m-t-rotate)) rotateX(var(--m-t-rotate-x)) rotateY(var(--m-t-rotate-y)) rotateZ(var(--m-t-rotate-z)) skewX(var(--m-t-skew-x)) skewY(var(--m-t-skew-y)) scale3d(var(--m-t-scale),var(--m-t-scale),var(--m-t-scale)) scaleX(var(--m-t-scale-x)) scaleY(var(--m-t-scale-y)) scaleZ(var(--m-t-scale-z))",
    "-translate-y-12":
      "--m-t-translate-y: -3rem;\n    transform: translateX(var(--m-t-translate-x)) translateY(var(--m-t-translate-y)) translateZ(var(--m-t-translate-z)) rotate(var(--m-t-rotate)) rotateX(var(--m-t-rotate-x)) rotateY(var(--m-t-rotate-y)) rotateZ(var(--m-t-rotate-z)) skewX(var(--m-t-skew-x)) skewY(var(--m-t-skew-y)) scale3d(var(--m-t-scale),var(--m-t-scale),var(--m-t-scale)) scaleX(var(--m-t-scale-x)) scaleY(var(--m-t-scale-y)) scaleZ(var(--m-t-scale-z))",
    "-translate-y-(5px)":
      "--m-t-translate-y: -5px;\n    transform: translateX(var(--m-t-translate-x)) translateY(var(--m-t-translate-y)) translateZ(var(--m-t-translate-z)) rotate(var(--m-t-rotate)) rotateX(var(--m-t-rotate-x)) rotateY(var(--m-t-rotate-y)) rotateZ(var(--m-t-rotate-z)) skewX(var(--m-t-skew-x)) skewY(var(--m-t-skew-y)) scale3d(var(--m-t-scale),var(--m-t-scale),var(--m-t-scale)) scaleX(var(--m-t-scale-x)) scaleY(var(--m-t-scale-y)) scaleZ(var(--m-t-scale-z))",
    "rotate-45":
      "--m-t-rotate: 45deg;\n    transform: translateX(var(--m-t-translate-x)) translateY(var(--m-t-translate-y)) translateZ(var(--m-t-translate-z)) rotate(var(--m-t-rotate)) rotateX(var(--m-t-rotate-x)) rotateY(var(--m-t-rotate-y)) rotateZ(var(--m-t-rotate-z)) skewX(var(--m-t-skew-x)) skewY(var(--m-t-skew-y)) scale3d(var(--m-t-scale),var(--m-t-scale),var(--m-t-scale)) scaleX(var(--m-t-scale-x)) scaleY(var(--m-t-scale-y)) scaleZ(var(--m-t-scale-z))",
    "-rotate-45":
      "--m-t-rotate: -45deg;\n    transform: translateX(var(--m-t-translate-x)) translateY(var(--m-t-translate-y)) translateZ(var(--m-t-translate-z)) rotate(var(--m-t-rotate)) rotateX(var(--m-t-rotate-x)) rotateY(var(--m-t-rotate-y)) rotateZ(var(--m-t-rotate-z)) skewX(var(--m-t-skew-x)) skewY(var(--m-t-skew-y)) scale3d(var(--m-t-scale),var(--m-t-scale),var(--m-t-scale)) scaleX(var(--m-t-scale-x)) scaleY(var(--m-t-scale-y)) scaleZ(var(--m-t-scale-z))",
    "scale-80":
      "--m-t-scale: 0.8;\n    transform: translateX(var(--m-t-translate-x)) translateY(var(--m-t-translate-y)) translateZ(var(--m-t-translate-z)) rotate(var(--m-t-rotate)) rotateX(var(--m-t-rotate-x)) rotateY(var(--m-t-rotate-y)) rotateZ(var(--m-t-rotate-z)) skewX(var(--m-t-skew-x)) skewY(var(--m-t-skew-y)) scale3d(var(--m-t-scale),var(--m-t-scale),var(--m-t-scale)) scaleX(var(--m-t-scale-x)) scaleY(var(--m-t-scale-y)) scaleZ(var(--m-t-scale-z))",
    "scale-x-80":
      "--m-t-scale-x: 0.8;\n    transform: translateX(var(--m-t-translate-x)) translateY(var(--m-t-translate-y)) translateZ(var(--m-t-translate-z)) rotate(var(--m-t-rotate)) rotateX(var(--m-t-rotate-x)) rotateY(var(--m-t-rotate-y)) rotateZ(var(--m-t-rotate-z)) skewX(var(--m-t-skew-x)) skewY(var(--m-t-skew-y)) scale3d(var(--m-t-scale),var(--m-t-scale),var(--m-t-scale)) scaleX(var(--m-t-scale-x)) scaleY(var(--m-t-scale-y)) scaleZ(var(--m-t-scale-z))",
    "scale-y-80":
      "--m-t-scale-y: 0.8;\n    transform: translateX(var(--m-t-translate-x)) translateY(var(--m-t-translate-y)) translateZ(var(--m-t-translate-z)) rotate(var(--m-t-rotate)) rotateX(var(--m-t-rotate-x)) rotateY(var(--m-t-rotate-y)) rotateZ(var(--m-t-rotate-z)) skewX(var(--m-t-skew-x)) skewY(var(--m-t-skew-y)) scale3d(var(--m-t-scale),var(--m-t-scale),var(--m-t-scale)) scaleX(var(--m-t-scale-x)) scaleY(var(--m-t-scale-y)) scaleZ(var(--m-t-scale-z))",
    "scale-z-80":
      "--m-t-scale-z: 0.8;\n    transform: translateX(var(--m-t-translate-x)) translateY(var(--m-t-translate-y)) translateZ(var(--m-t-translate-z)) rotate(var(--m-t-rotate)) rotateX(var(--m-t-rotate-x)) rotateY(var(--m-t-rotate-y)) rotateZ(var(--m-t-rotate-z)) skewX(var(--m-t-skew-x)) skewY(var(--m-t-skew-y)) scale3d(var(--m-t-scale),var(--m-t-scale),var(--m-t-scale)) scaleX(var(--m-t-scale-x)) scaleY(var(--m-t-scale-y)) scaleZ(var(--m-t-scale-z))",
    "skew-x-20":
      "--m-t-skew-x: 20deg;\n    transform: translateX(var(--m-t-translate-x)) translateY(var(--m-t-translate-y)) translateZ(var(--m-t-translate-z)) rotate(var(--m-t-rotate)) rotateX(var(--m-t-rotate-x)) rotateY(var(--m-t-rotate-y)) rotateZ(var(--m-t-rotate-z)) skewX(var(--m-t-skew-x)) skewY(var(--m-t-skew-y)) scale3d(var(--m-t-scale),var(--m-t-scale),var(--m-t-scale)) scaleX(var(--m-t-scale-x)) scaleY(var(--m-t-scale-y)) scaleZ(var(--m-t-scale-z))",
    "skew-y-20":
      "--m-t-skew-y: 20deg;\n    transform: translateX(var(--m-t-translate-x)) translateY(var(--m-t-translate-y)) translateZ(var(--m-t-translate-z)) rotate(var(--m-t-rotate)) rotateX(var(--m-t-rotate-x)) rotateY(var(--m-t-rotate-y)) rotateZ(var(--m-t-rotate-z)) skewX(var(--m-t-skew-x)) skewY(var(--m-t-skew-y)) scale3d(var(--m-t-scale),var(--m-t-scale),var(--m-t-scale)) scaleX(var(--m-t-scale-x)) scaleY(var(--m-t-scale-y)) scaleZ(var(--m-t-scale-z))",
    "p-self-start": "place-self: var(--m-box-start)",
    "p-items-end": "place-items: var(--m-box-end)",
    "p-content-around": "place-content: space-around",
    "a-self-end": "align-self: var(--m-box-end)",
    "a-items-center": "align-items: center",
    "a-content-around": "align-content: space-around",
    "j-self-start": "justify-self: var(--m-box-start)",
    "j-items-stretch": "justify-items: stretch",
    "j-content-evenly": "justify-content: space-evenly",
    "r-end-2": "grid-row-end: 2",
    "r-start-7": "grid-row-start: 7",
    "c-end-5": "grid-column-end: 5",
    "c-start-12": "grid-column-start: 12",
    "c-span-5": "grid-column: auto / span 5",
    "col-offset-4": "grid-column-start: 5",
    "col-5": "grid-column: auto / span 5",
    "rows-7": "grid-template-rows: repeat(7, minmax(0, 1fr))",
    "cols-8": "grid-template-columns: repeat(8, minmax(0, 1fr))",
    "tsm-p-opacity":
      "-webkit-transition-property: opacity;\n    -o-transition-property: opacity;\n    transition-property: opacity",
    "tsm-f-linear":
      "-webkit-transition-timing-function: linear;\n    -o-transition-timing-function: linear;\n    transition-timing-function: linear",
    "tsm-d-150":
      "-webkit-transition-delay: 150ms;\n    -o-transition-delay: 150ms;\n    transition-delay: 150ms",
    "tsm-450":
      "-webkit-transition-duration: 450ms;\n    -o-transition-duration: 450ms;\n    transition-duration: 450ms",
    "ts-p-opacity":
      "-mojo-d--webkit-transition-property: opacity;\n    -mojo-d--o-transition-property: opacity;\n    -mojo-d-transition-property: opacity",
    "ts-f-linear":
      "-mojo-d--webkit-transition-timing-function: linear;\n    -mojo-d--o-transition-timing-function: linear;\n    -mojo-d-transition-timing-function: linear",
    "ts-d-150":
      "-mojo-d--webkit-transition-delay: 150ms;\n    -mojo-d--o-transition-delay: 150ms;\n    -mojo-d-transition-delay: 150ms",
    "ts-450":
      "-mojo-d--webkit-transition-duration: 450ms;\n    -mojo-d--o-transition-duration: 450ms;\n    -mojo-d-transition-duration: 450ms",
    "bg-gradient":
      "--m-gd-dir: to bottom;\n    --m-gd-start-color: ;\n    --m-gd-mid-color: ;\n    --m-gd-end-color: ;\n    background-image: linear-gradient(var(--m-gd-dir), var(--m-gd-start-color), var(--m-gd-mid-color) var(--m-gd-end-color))",
    "filter-none": "filter: none;\n    -webkit-filter: none",
    "backdrop-filter-none":
      "backdrop-filter: none;\n    -webkit-backdrop-filter: none",
    "transform-none":
      "transform: none;\n    -webkit-transform: none;\n    -ms-transform: none",
    "transition-none":
      "-mojo-d-transition-property: none;\n    -webkit--mojo-d-transition-property: none;\n    -o--mojo-d-transition-property: none",
    grid: "display: grid;\n    grid-template-columns: repeat(1, minmax(0, 1fr));\n    grid-gap: 1rem;\n    --m-box-start: start;\n    --m-box-end: end",
    "cols-auto": "grid-template-columns: repeat(auto-fit, minmax(0, 1fr))",
    "rows-auto": "grid-template-rows: repeat(auto-fit, minmax(0, 1fr))",
    "col-auto": "grid-column: auto",
    "col-offset-auto": "grid-column-start: auto",
    "flex-fluid": "flex: 1 1 0%",
    "flex-auto": "flex: 1 1 auto",
    "flex-none": "flex: none",
    "flex-wrap": "flex-wrap: wrap",
    "flex-nowrap": "flex-wrap: nowrap",
    "flex-wrap-reverse": "flex-wrap: wrap-reverse",
    "flex-col": "flex-direction: column",
    "flex-row": "flex-direction: row",
    "flex-col-reverse": "flex-direction: column-reverse",
    "flex-row-reverse": "flex-direction: row-reverse",
    "text-wb-normal": "word-break: normal;\n    overflow-wrap: normal",
    "text-wb-words": "overflow-wrap: break-word",
    "text-wb-all": "word-break: break-all",
    "text-wb-keep": "word-break: keep-all",
    "text-truncate":
      "overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap",
    hidden: "visibility: hidden",
    visible: "visibility: visible",
    "resize-xy": "resize: both",
    "resize-x": "resize: horizontal",
    "resize-y": "resize: vertical",
    "outline-none": "outline:none",
    "shadow-xs": "box-shadow: 0 1px 2px var(--m-shadow-color, #0000001a)",
    "gd-dir-45deg": "--m-gd-dir: 45deg",
    "w-lg": "width: 992px",
    "-w-lg": "width: -992px",
    "bg-clip-text": "background-clip: text;\n    -webkit-background-clip: text",
    "d-grid": "display: grid;\n    --m-box-start: start;\n    --m-box-end: end",
    "d-block": "display: block",
    "a-items-start": "align-items: var(--m-box-start)",
    "outline-thick": "outline-width: thick;\n    outline-style:solid",
    "blur-26px": "--m-f-blur: blur(26px);\n    filter: var(--m-f-blur) var(--m-f-brightness) var(--m-f-contrast) var(--m-f-grayscale) var(--m-f-hue-rotate) var(--m-f-invert) var(--m-f-saturate) var(--m-f-sepia) var(--m-f-drop-shadow)",
    "animation-pulse": "animation: m-pulse 2s cubic-bezier(0.4, 0, 0.8, 1) infinite",
    "w-(calc(85%/85px))": "width: calc(85% / 85px)",
    "-translate-x-50%": "--m-t-translate-x: -50%;\n    transform: translateX(var(--m-t-translate-x)) translateY(var(--m-t-translate-y)) translateZ(var(--m-t-translate-z)) rotate(var(--m-t-rotate)) rotateX(var(--m-t-rotate-x)) rotateY(var(--m-t-rotate-y)) rotateZ(var(--m-t-rotate-z)) skewX(var(--m-t-skew-x)) skewY(var(--m-t-skew-y)) scale3d(var(--m-t-scale),var(--m-t-scale),var(--m-t-scale)) scaleX(var(--m-t-scale-x)) scaleY(var(--m-t-scale-y)) scaleZ(var(--m-t-scale-z))",
    "scale-50": "--m-t-scale: 0.5;\n    transform: translateX(var(--m-t-translate-x)) translateY(var(--m-t-translate-y)) translateZ(var(--m-t-translate-z)) rotate(var(--m-t-rotate)) rotateX(var(--m-t-rotate-x)) rotateY(var(--m-t-rotate-y)) rotateZ(var(--m-t-rotate-z)) skewX(var(--m-t-skew-x)) skewY(var(--m-t-skew-y)) scale3d(var(--m-t-scale),var(--m-t-scale),var(--m-t-scale)) scaleX(var(--m-t-scale-x)) scaleY(var(--m-t-scale-y)) scaleZ(var(--m-t-scale-z))",
    "scale-x-50": "--m-t-scale-x: 0.5;\n    transform: translateX(var(--m-t-translate-x)) translateY(var(--m-t-translate-y)) translateZ(var(--m-t-translate-z)) rotate(var(--m-t-rotate)) rotateX(var(--m-t-rotate-x)) rotateY(var(--m-t-rotate-y)) rotateZ(var(--m-t-rotate-z)) skewX(var(--m-t-skew-x)) skewY(var(--m-t-skew-y)) scale3d(var(--m-t-scale),var(--m-t-scale),var(--m-t-scale)) scaleX(var(--m-t-scale-x)) scaleY(var(--m-t-scale-y)) scaleZ(var(--m-t-scale-z))",
    "shadow-var(--test)": "box-shadow: var(--test)",
    "bg-c-primary:-3": "--m-bg-c-lightness: -3%;\n" +
      "    --m-bg-c-alpha: 1;\n" +
      "    background-color: hsla(var(--m-color-primary), calc(var(--m-color-primary-l) + var(--m-bg-c-lightness)), var(--m-bg-c-alpha))",
    "bg-c-#fafafa": "--m-bg-c-lightness: 0%;\n" +
      "    --m-bg-c-alpha: 1;\n" +
      "    background-color: hsla(0, 0%, calc(98% + var(--m-bg-c-lightness)), var(--m-bg-c-alpha))",
    "bg-c-000": "--m-bg-c-lightness: 0%;\n" +
      "    --m-bg-c-alpha: 1;\n" +
      "    background-color: hsla(0, 0%, calc(0% + var(--m-bg-c-lightness)), var(--m-bg-c-alpha))",
    "bg-c-bisque": "background-color: bisque",
    "bg-c-inherit": "background-color: inherit",
    "bg-c-transparent": "background-color: transparent",
    "bg-c:+10": "--m-bg-c-lightness: 10%",
    "bg-c:+15[50]": "--m-bg-c-alpha: 0.50;\n" +
      "    --m-bg-c-lightness: 15%",
    "fill-c:-10": "--m-fill-c-lightness: -10%",
    "border-c:+20": "--m-border-c-lightness: 20%",
    "outline-c:-25": "--m-outline-c-lightness: -25%",
    "backdrop-blur-10": "--m-bf-blur: blur(10px);\n" +
      "    -webkit-backdrop-filter: var(--m-bf-blur) var(--m-bf-brightness) var(--m-bf-contrast) var(--m-bf-grayscale) var(--m-bf-hue-rotate) var(--m-bf-invert) var(--m-bf-saturate) var(--m-bf-sepia) var(--m-bf-opacity);\n" +
      "    backdrop-filter: var(--m-bf-blur) var(--m-bf-brightness) var(--m-bf-contrast) var(--m-bf-grayscale) var(--m-bf-hue-rotate) var(--m-bf-invert) var(--m-bf-saturate) var(--m-bf-sepia) var(--m-bf-opacity)",
    "aspect-ratio:1/1": "aspect-ratio: 1/1",
    "text-c-current": "color: currentColor",
    "ms-4": "margin-inline-start: 1rem",
    "-ms-4": "margin-inline-start: -1rem",
    "blur-10": "--m-f-blur: blur(10px);\n" +
      "    filter: var(--m-f-blur) var(--m-f-brightness) var(--m-f-contrast) var(--m-f-grayscale) var(--m-f-hue-rotate) var(--m-f-invert) var(--m-f-saturate) var(--m-f-sepia) var(--m-f-drop-shadow)",
    "box-shadow:1rem_1rem_0.5rem_1rem": "box-shadow: 1rem 1rem 0.5rem 1rem",
    "-webkit-box-orient:vertical": "-webkit-box-orient: vertical",
    "-webkit-line-clamp:2": "-webkit-line-clamp: 2",
    "bg-($c.primary)": "background: #ff6145",
    "blur-(10px)": "--m-f-blur: blur(10px);\n" +
      "    filter: var(--m-f-blur) var(--m-f-brightness) var(--m-f-contrast) var(--m-f-grayscale) var(--m-f-hue-rotate) var(--m-f-invert) var(--m-f-saturate) var(--m-f-sepia) var(--m-f-drop-shadow)",
    "-backdrop-blur-(10px)": "--m-bf-blur: blur(-10px);\n" +
      "    -webkit-backdrop-filter: var(--m-bf-blur) var(--m-bf-brightness) var(--m-bf-contrast) var(--m-bf-grayscale) var(--m-bf-hue-rotate) var(--m-bf-invert) var(--m-bf-saturate) var(--m-bf-sepia) var(--m-bf-opacity);\n" +
      "    backdrop-filter: var(--m-bf-blur) var(--m-bf-brightness) var(--m-bf-contrast) var(--m-bf-grayscale) var(--m-bf-hue-rotate) var(--m-bf-invert) var(--m-bf-saturate) var(--m-bf-sepia) var(--m-bf-opacity)",
  };


  utilities = Object.fromEntries(
    Object.entries(utilities).sort(([a], [b]) => {
      const keyA = a.startsWith("-") ? a.substring(1) : a;
      const keyB = b.startsWith("-") ? b.substring(1) : b;
      return keyA.localeCompare(keyB);
    })
  );

  const { prefix } = config.options
  for (let i in utilities) {
    let utlName = prefix + i;
    test("Check utility: " + utlName, () => {
      const css = mojoCore
        .init({
          isExtend: true,
          classes: [utlName],
        })
        .getStyles().css;

      expect(css).toBe(utilities[i]);
    });
  }
});
