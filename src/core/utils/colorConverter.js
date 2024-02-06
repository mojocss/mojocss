const colorDict = {
  transparent: [0, 0, 0, 0],
  black: [0, 0, 0, 1],
  silver: [192, 192, 192, 1],
  gray: [128, 128, 128, 1],
  white: [255, 255, 255, 1],
  maroon: [128, 0, 0, 1],
  red: [255, 0, 0, 1],
  purple: [128, 0, 128, 1],
  fuchsia: [255, 0, 255, 1],
  green: [0, 128, 0, 1],
  lime: [0, 255, 0, 1],
  olive: [128, 128, 0, 1],
  yellow: [255, 255, 0, 1],
  navy: [0, 0, 128, 1],
  blue: [0, 0, 255, 1],
  teal: [0, 128, 128, 1],
  aqua: [0, 255, 255, 1],
  pink: [255, 192, 203, 1],
  orange: [255, 165, 0, 1],
  brown: [165, 42, 42, 1],
  tan: [210, 180, 140, 1],
  beige: [245, 245, 220, 1],
  lavender: [230, 230, 250, 1],
  violet: [238, 130, 238, 1],
  magenta: [255, 0, 255, 1],
  cyan: [0, 255, 255, 1],
  turquoise: [64, 224, 208, 1],
};

const cc = {
  hslToRgba: function (h, s, l, a) {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let rgba = [];
    if (h >= 0 && h < 60) {
      rgba = [c, x, 0];
    } else if (h >= 60 && h < 120) {
      rgba = [x, c, 0];
    } else if (h >= 120 && h < 180) {
      rgba = [0, c, x];
    } else if (h >= 180 && h < 240) {
      rgba = [0, x, c];
    } else if (h >= 240 && h < 300) {
      rgba = [x, 0, c];
    } else if (h >= 300 && h < 360) {
      rgba = [c, 0, x];
    }
    rgba = rgba.map((val) => Math.round((val + m) * 255));
    return [...rgba, a];
  },

  rgbToRgba: function (r, g, b, a) {
    return [r, g, b, a];
  },
  parseColor: function (colorString) {
    if (typeof colorString !== typeof "") colorString = "transparent";
    let colorValues;
    if (colorDict[colorString]) {
      colorValues = colorDict[colorString];
    } else if (colorString.startsWith("#")) {
      const hex = colorString.substring(1);
      if (hex.length === 3 || hex.length === 4) {
        const r = parseInt(`${hex[0]}${hex[0]}`, 16);
        const g = parseInt(`${hex[1]}${hex[1]}`, 16);
        const b = parseInt(`${hex[2]}${hex[2]}`, 16);
        const a = hex.length === 4 ? parseInt(`${hex[3]}${hex[3]}`, 16) : 255;
        colorValues = this.rgbToRgba(r, g, b, a / 255);
      } else {
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const a =
          hex.length === 8 ? parseInt(hex.substring(6, 8), 16) / 255 : 1;
        colorValues = this.rgbToRgba(r, g, b, a);
      }
    } else if (colorString.startsWith("rgb")) {
      colorValues = colorString
        .substring(colorString.indexOf("(") + 1, colorString.lastIndexOf(")"))
        .split(",");
      if (colorValues.length === 3) {
        colorValues.push(1);
      }
      colorValues = this.rgbToRgba(
        ...colorValues.map((val) => parseFloat(val))
      );
    } else if (colorString.startsWith("hsl")) {
      colorValues = colorString
        .substring(colorString.indexOf("(") + 1, colorString.lastIndexOf(")"))
        .split(",");
      colorValues[0] = parseFloat(colorValues[0]);
      colorValues[1] = parseFloat(colorValues[1]) / 100;
      colorValues[2] = parseFloat(colorValues[2]) / 100;
      if (colorValues.length === 3) {
        colorValues.push(1);
      } else {
        colorValues[3] = parseFloat(colorValues[3]);
        colorValues[3] = colorValues[3] > 1 ? 1 : colorValues[3];
        colorValues[3] = colorValues[3] < 0 ? 0 : colorValues[3];
      }
      colorValues = this.hslToRgba(...colorValues);
    }
    return colorValues;
  },
  lighten: function (color, percent) {
    const colorValues = this.parseColor(color);
    if(colorValues) {
      const increase = Math.round((255 * percent) / 100);
      return colorValues.map((c, i) =>
        i === colorValues.length - 1 ? c : Math.min(c + increase, 255)
      );
    }
    return color;
  },
  darken: function (color, percent) {
    const colorValues = this.parseColor(color);
    if(colorValues) {
      const decrease = Math.round((255 * percent) / 100);
      return colorValues.map((c, i) =>
        i === colorValues.length - 1 ? c : Math.max(c - decrease, 0)
      );
    }
    return color;
  },
};

export default cc;
