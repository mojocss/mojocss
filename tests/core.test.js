import mojoCore from "../src/core/index.js";
import config from "../src/interop/mojo.config.js";

describe('MojoCore:: Initialization', () => {
  beforeAll(() => {
    config.options.minify = true;
    config.base.themes.dark = {
      body: "#111",
      invert: "#222",
    }
  });
  test('Check initialization', () => {
    expect(mojoCore.init({
      isExtend: false,
      pseudo: "class",
      attribute: "class",
      classes:["text-110"],
    })).toBe(mojoCore);

    expect(mojoCore.args.isExtend).toBe(false);
    expect(mojoCore.args.pseudo).toBe("class");
    expect(mojoCore.args.attribute).toBe("class");
    expect(mojoCore.args.classes).toContain("text-110");
  });

  test('Check set config', () => {
    expect(mojoCore.setConfig(config)).toBe(mojoCore);
    expect(mojoCore.config).toBe(config);
  });

  test('Check init styles', () => {
    if(!mojoCore.config) mojoCore.setConfig(config);
    expect(mojoCore.getInitStyles()).toBeTruthy();
  });

  test('Check root styles', () => {
    if(!mojoCore.config) mojoCore.setConfig(config);
    expect(mojoCore.getRootStyles()).toBeTruthy();
  });

  test('Check pseudos', () => {
    expect(mojoCore.getPseudos()).toBeTruthy();
  });

  test('Check get styles', () => {
    if(!mojoCore.config) mojoCore.setConfig(config);
    expect(mojoCore.getStyles()).toBeTruthy();
    expect(mojoCore.getStyles().css).toBe('.text-110{font-size: 1.1rem}');

    expect(mojoCore.init({
      tiny: "@i-lg:i-dark:hover:focus .test",
      pseudo: "class",
      attribute: "_",
      element: "1",
      classes:["text-110"],
    }).getStyles().css).toBe('@media only screen and (max-width: 991.98px) {html:not([m-theme="dark"]) [m-id="1"][_~="text-110"] .test:hover:focus{font-size: 1.1rem}}');
  });

  test('Check get pattern styles', () => {
    expect(mojoCore.getPatternStyles({
      ".test": "text-110"
    })).toMatch('.test{font-size: 1.1rem}');
  });

  test('Check extend', () => {
    expect(mojoCore.init({
      isExtend: true,
      classes:["text-110"],
    }).getStyles().css).toBe("font-size: 1.1rem");

    expect(mojoCore.init({
      isExtend: true,
      pseudo: "hover",
      selector: ".test",
      theme: "dark",
      breakpoint: "sm",
      classes:["text-110"],
    }).getStyles().css).toBe('@media only screen and (min-width: 576px) {[m-theme="dark"] .test:hover{font-size: 1.1rem}}');
  });

});

