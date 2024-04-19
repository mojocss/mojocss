import mojoCore from "../src/core/index.js";
import config from "../src/interop/mojo.config.js";

describe('MojoCore:: Check CSS Results', () => {
  beforeAll(() => {
    config.options.minify = true;
    mojoCore.setConfig(config);
  });

  test('Check class result', () => {
    const css = mojoCore.init({
      isExtend: false,
      pseudo: "class",
      attribute: "class",
      classes: ["text-110"],
    }).getStyles().css;

    expect(css).toBe(".text-110{font-size: 1.1rem}");
  });

  test('Check pseudo result', () => {
    const css = mojoCore.init({
      isExtend: false,
      pseudo: "hover",
      attribute: "hover",
      classes: ["text-110"],
    }).getStyles().css;

    expect(css).toBe('[hover~="text-110"]:hover{font-size: 1.1rem}');
  });


  test('Check theme result', () => {
    const css = mojoCore.init({
      isExtend: false,
      pseudo: "class",
      attribute: "class",
      theme: "dark",
      classes: ["text-110"],
    }).getStyles().css;

    expect(css).toBe('[m-theme="dark"] .text-110{font-size: 1.1rem}');
  });


  test('Check pseudo and theme result', () => {
    const css = mojoCore.init({
      isExtend: false,
      pseudo: "focus",
      theme: "dark",
      attribute: "dark:focus",
      classes: ["text-110"],
    }).getStyles().css;

    expect(css).toBe('[m-theme="dark"] [dark\\:focus~="text-110"]:focus{font-size: 1.1rem}');
  });


  test('Check breakpoint result', () => {
    const css = mojoCore.init({
      isExtend: false,
      pseudo: "class",
      attribute: "class",
      breakpoint: "sm",
      classes: ["text-110"],
    }).getStyles().css;

    expect(css).toBe('@media only screen and (min-width: 576px) {.text-110{font-size: 1.1rem}}');
  });


  test('Check pseudo, theme and breakpoint result', () => {
    const css = mojoCore.init({
      isExtend: false,
      pseudo: "focus",
      theme: "dark",
      attribute: "class",
      breakpoint: "sm",
      classes: ["text-110"],
    }).getStyles().css;

    expect(css).toBe('@media only screen and (min-width: 576px) {[m-theme="dark"] [class~="text-110"]:focus{font-size: 1.1rem}}');
  });

  test('Check tiny result', () => {
    const css = mojoCore.init({
      isExtend: false,
      pseudo: "class",
      attribute: "_",
      tiny: ".test:hover",
      element: "1",
      classes: ["text-110"],
    }).getStyles().css;

    expect(css).toBe('[m-id="1"][_~="text-110"] .test:hover{font-size: 1.1rem}');
  });


  test('Check print result', () => {
    const css = mojoCore.init({
      isExtend: false,
      pseudo: "print",
      attribute: "print",
      classes: ["text-110"],
    }).getStyles().css;

    expect(css).toBe("@media print{[print~=\"text-110\"]{font-size: 1.1rem}}");
  });
});

