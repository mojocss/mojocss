import Splitter from "../src/core/builders/splitter";
import CssBuilder from "../src/core/builders/css";
import BreakpointBuilder from "../src/core/builders/breakpoint";
import Tiny from "../src/core/builders/tiny";
import StringBuilder from "../src/core/builders/string";
import config from "../src/interop/mojo.config"

describe('Splitter', () => {
  test('Dynamic Utility', () => {
    const className = 'bg-c-red';
    const userUtilities = {};
    const splitterInstance = new Splitter(className, userUtilities);

    expect(splitterInstance.className).toBe('bg-c-red');
    expect(splitterInstance.name).toBe('bg-c');
    expect(splitterInstance.value).toBe('red');
    expect(splitterInstance.props).toBe("background-color");
    expect(splitterInstance.appends).toBe(undefined);
    expect(splitterInstance.body).toBe(undefined);
    expect(splitterInstance.isForcedValue).toBe(false);
    expect(splitterInstance.isImportant).toBe(false);
  });

  test('Important Dynamic Utility', () => {
    const className = '!bg-c-red';
    const userUtilities = {};
    const splitterInstance = new Splitter(className, userUtilities);

    expect(splitterInstance.className).toBe('bg-c-red');
    expect(splitterInstance.name).toBe('bg-c');
    expect(splitterInstance.value).toBe('red');
    expect(splitterInstance.props).toBe("background-color");
    expect(splitterInstance.appends).toBe(undefined);
    expect(splitterInstance.body).toBe(undefined);
    expect(splitterInstance.isForcedValue).toBe(false);
    expect(splitterInstance.isImportant).toBe(true);
  });

  test('Dynamic Utility With Append', () => {
    const className = 'bg-c-red[50]';
    const userUtilities = {};
    const splitterInstance = new Splitter(className, userUtilities);

    expect(splitterInstance.className).toBe('bg-c-red\\[50\\]');
    expect(splitterInstance.name).toBe('bg-c');
    expect(splitterInstance.value).toBe('red');
    expect(splitterInstance.props).toBe("background-color");
    expect(splitterInstance.appends).not.toBe(undefined);
    expect(splitterInstance.appends[0]).toBe("50");
    expect(splitterInstance.body).toBe(undefined);
    expect(splitterInstance.isForcedValue).toBe(false);
    expect(splitterInstance.isImportant).toBe(false);
  });

  test('Forced Dynamic Utility', () => {
    const className = 'bg-c-(red)';
    const userUtilities = {};
    const splitterInstance = new Splitter(className, userUtilities);

    expect(splitterInstance.className).toBe('bg-c-\\(red\\)');
    expect(splitterInstance.name).toBe('bg-c');
    expect(splitterInstance.value).toBe('(red)');
    expect(splitterInstance.props).toBe("background-color");
    expect(splitterInstance.appends).toBe(undefined);
    expect(splitterInstance.body).toBe(undefined);
    expect(splitterInstance.isForcedValue).toBe(true);
    expect(splitterInstance.isImportant).toBe(false);
  });

  test('Static Utility', () => {
    const className = 'outline-none';
    const userUtilities = {};
    const splitterInstance = new Splitter(className, userUtilities);

    expect(splitterInstance.className).toBe('outline-none');
    expect(splitterInstance.name).toBe('outline-none');
    expect(splitterInstance.value).toBe('');
    expect(splitterInstance.props).toBe(undefined);
    expect(splitterInstance.appends).toBe(undefined);
    expect(splitterInstance.body).toBe("outline:none");
    expect(splitterInstance.isForcedValue).toBe(false);
    expect(splitterInstance.isImportant).toBe(false);
  });

  test('Auto Utility', () => {
    const className = 'transform:none';
    const userUtilities = {};
    const splitterInstance = new Splitter(className, userUtilities);

    expect(splitterInstance.className).toBe('transform\\:none');
    expect(splitterInstance.name).toBe('transform:none');
    expect(splitterInstance.value).toBe("(none)");
    expect(splitterInstance.props).toBe("transform");
    expect(splitterInstance.appends).toBe(undefined);
    expect(splitterInstance.body).toBe(undefined);
    expect(splitterInstance.isForcedValue).toBe(true);
    expect(splitterInstance.isImportant).toBe(false);
  });
});

describe('CssBuilder', () => {
  test('Test Builder', () => {
    const className = 'text-110';
    const userUtilities = {};
    const splittedClass = new Splitter(className, userUtilities);

    const args = {
      config,
      splittedClass,
      usedColors: [],
      justBody: false,
      pseudo: 'class',
      theme: 'dark',
      isExtend: false,
      attribute: 'dark',
      breakpoint: 'sm',
    };

    const cssBuilderInstance = new CssBuilder(args);
    const result = cssBuilderInstance.create();

    expect(result).toBe('[m-theme="dark"] [dark~="text-110"]{font-size: 1.1rem}');
  });

});

describe('Breakpoint', () => {
  test('Test Breakpoints', () => {

    const args = {
      config,
      breakpoint: 'sm',
      pseudo: 'class',
    };

    const breakpointBuilderInstance = new BreakpointBuilder(args);
    const CSS = '.test{ font-size: 1.1rem}';
    const result = breakpointBuilderInstance.insertBreakpoint(CSS);

    expect(result).toBe('@media only screen and (min-width: 576px) {.test{ font-size: 1.1rem}}');

  });
});


describe('Tiny', () => {

  test('Test Child', () => {
    const tinyInstance = new Tiny();

    const result = tinyInstance.parseTiny(".card");

    expect(result.child).toBe('.card');
  });

  test('Test Parent', () => {
    const tinyInstance = new Tiny();

    const result = tinyInstance.parseTiny("<.parent");

    expect(result.parent).toBe('.parent');
  });


  test('Test Parent and Child', () => {
    const tinyInstance = new Tiny();

    const result = tinyInstance.parseTiny("<.parent {.card:hover}");

    expect(result.parent).toBe('.parent');
    expect(result.child).toBe('.card:hover');
  });

});


describe('CSS String', () => {
  test('Create Simple Class', () => {
    const args = {
      className: 'text-110',
      body: 'font-size: 1.1rem',
      pseudo: ["class"],
      attribute:"class",
      isExtend: false,
    };

    const stringBuilderInstance = new StringBuilder( args );
    const result = stringBuilderInstance.getCss();

    expect(result).toBe('.text-110{font-size: 1.1rem}');
  });

  test('Create Advanced Class', () => {
    const args = {
      className: 'bg-red',
      body: 'background: red',
      isExtend: false,
      pseudo: ['first', 'hover'],
      theme: "dark",
      attribute: 'first:hover',
    };

    const stringBuilderInstance = new StringBuilder( args );
    const result = stringBuilderInstance.getCss();


    expect(result).toBe('[m-theme="dark"] [first\\:hover~="bg-red"]:first-child:hover{background: red}');
  });

});

