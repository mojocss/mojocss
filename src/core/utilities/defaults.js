// Array of filter properties
export const filter = [
  "blur",
  "brightness",
  "contrast",
  "grayscale",
  "hue-rotate",
  "invert",
  "saturate",
  "sepia",
  "drop-shadow",
];
// Array of transform properties
export const transform = [
  "translateX",
  "translateY",
  "translateZ",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skewX",
  "skewY",
  "scale3d",
  "scaleX",
  "scaleY",
  "scaleZ",
];

/**
 * Generates a CSS string based on variables, property, and prefix.
 * @param {string[]} variables - The array of variables.
 * @param {string} property - The CSS property.
 * @param {string} prefix - The prefix string.
 * @returns {string} The generated CSS string.
 */
const genStr = (variables, property, prefix) => {
  if (prefix.includes("bf")) {
    variables.pop();
    variables.push("opacity");
  }
  return `${property}: ${variables
    .map((variable) => {
      let exception;
      if (variable === "scale3d") {
        let t = "var(--m-t-scale)";
        exception = `scale3d(${t},${t},${t})`;
      }
      return `${
        exception
          ? exception
          : `${
              prefix.includes("t") ? `${variable}(` : ""
            }var(--${prefix}-${variable
              .replace(/[A-Z]/g, "-$&")
              .toLowerCase()})${prefix.includes("t") ? ")" : ""}`
      }`;
    })
    .join(" ")}`;
};

/**
 * Generate CSS for filters and transforms.
 * @returns {string[]} An array of generated CSS strings.
 */
export default [
  genStr(filter, "filter", "m-f"),
  `${genStr(filter, "-webkit-backdrop-filter", "m-bf")};${genStr(
    filter,
    "backdrop-filter",
    "m-bf"
  )}`,
  genStr(transform, "transform", "m-t"),
];
