import Splitter from "../src/core/builders/splitter";
import CssBuilder from "../src/core/builders/css";
import BreakpointBuilder from "../src/core/builders/breakpoint";
import Tiny from "../src/core/builders/tiny";
import StringBuilder from "../src/core/builders/string";
import config from "../src/interop/mojo.config"
import PatternBuilder from "../src/core/builders/pattern";

describe('Splitter', () => {
  test('Dynamic Utility', () => {
    const className = 'bg-c-red';
    const userUtilities = {};
    const splitterInstance = new Splitter(className, userUtilities, config);

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
    const splitterInstance = new Splitter(className, userUtilities, config);

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
    const splitterInstance = new Splitter(className, userUtilities, config);

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
    const splitterInstance = new Splitter(className, userUtilities, config);

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
    const splitterInstance = new Splitter(className, userUtilities, config);

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
    const splitterInstance = new Splitter(className, userUtilities, config);

    expect(splitterInstance.className).toBe('transform\\:none');
    expect(splitterInstance.name).toBe('transform');
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
    const splittedClass = new Splitter(className, userUtilities, config);

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
      allPseudos: StringBuilder.pseudos
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

    const result = tinyInstance.parseTiny(".card", config, Object.keys(StringBuilder.pseudos));

    expect(result.child).toBe('.card');
  });

  test('Test Parent', () => {
    const tinyInstance = new Tiny();

    const result = tinyInstance.parseTiny("<.parent", config, Object.keys(StringBuilder.pseudos));

    expect(result.parent).toBe('.parent');
  });


  test('Test Parent and Child', () => {
    const tinyInstance = new Tiny();

    const result = tinyInstance.parseTiny("<.parent {.card:hover}", config, Object.keys(StringBuilder.pseudos));

    expect(result.parent).toBe('.parent');
    expect(result.child).toBe('.card:hover');
  });

  test('Test Variant', () => {
    const tinyInstance = new Tiny();

    const result = tinyInstance.parseTiny("@dark", config, Object.keys(StringBuilder.pseudos));
    const result2 = tinyInstance.parseTiny("@md", config, Object.keys(StringBuilder.pseudos));
    const result3 = tinyInstance.parseTiny("@hover", config, Object.keys(StringBuilder.pseudos));

    expect(result.args.theme).toBe('dark');
    expect(result2.args.breakpoint).toBe('md');
    expect(result3.args.pseudo[0]).toBe('hover');
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


describe('Patterns', () => {
  const usedColors = ["body", "invert"];

  const args = {
    config,
    userUtilities: {},
    usedColors,
    allPseudos: Object.keys(StringBuilder.pseudos),
  };
  config.base.themes.dark = {
    body: "#111111",
    invert: "#ffffff"
  }
  
  test('Check Simple Pattern', () => {
    const patterns = {
      '.test': {
        'idle': 'text-100',
      },
    };
    
    let result = new PatternBuilder({...args, patterns}).getStyles();
    
    expect(result).toBe('.test{font-size: 1rem}');
  });
  
  
  test('Check Nested Pattern', () => {
    const patterns = {
      '.test': {
        'idle': 'text-100',
        'h1': {
          'idle': 'text-120',
        },
      },
    };
    
    let result = new PatternBuilder({...args, patterns}).getStyles();
    
    expect(result).toBe('.test{font-size: 1rem}.test h1{font-size: 1.2rem}');
  });
  
  test('Check Variant', () => {
    const patterns = {
      '.test': {
        'hover': 'text-100',
      },
    };
    
    let result = new PatternBuilder({...args, patterns}).getStyles();
    
    expect(result).toBe('.test:hover{font-size: 1rem}');
  });
  
  test('Check Theme', () => {
    const patterns = {
      '.test': {
        'dark': 'text-100',
      },
    };
    
    let result = new PatternBuilder({...args, patterns}).getStyles();
    
    expect(result).toBe('[m-theme="dark"] .test{font-size: 1rem}');
  });

  test('Check Theme And Pseudo', () => {
    const patterns = {
      '.test': {
        'dark:focus:hover': 'text-100',
      },
    };

    let result = new PatternBuilder({...args, patterns}).getStyles();

    expect(result).toBe('[m-theme="dark"] .test:focus:hover{font-size: 1rem}');
  });
  
  test('Check Breakpoints', () => {
    const patterns = {
      '.test': {
        'sm': 'text-100',
        'md': 'text-110',
        'i-sm': 'text-a-center',
        'i-md': 'text-w-bold',
      },
    };
    
    let result = new PatternBuilder({...args, patterns}).getStyles();
    
    expect(result).toBe('@media only screen and (min-width: 576px) {.test{font-size: 1rem}}@media only screen and (min-width: 768px) {.test{font-size: 1.1rem}}@media only screen and (max-width: 767.98px) {.test{font-weight: 700}}@media only screen and (max-width: 575.98px) {.test{text-align: center}}');
  });
  
  test('Check Keyframe', () => {
    const patterns = {
      '@keyframe animation': {
        '0%, 100%': 'opacity-0',
        '50%': 'opacity-100',
      },
    };
    
    let result = new PatternBuilder({...args, patterns}).getStyles();
    
    expect(result).toBe('@keyframe animation{0%{opacity: 0}100%{opacity: 0}50%{opacity: 1}}');
  });
  
  
  test('Check Media Query', () => {
    const patterns = {
      '.test': {
        '@media (max-width: 360px)': 'text-80',
      },
    };
    
    let result = new PatternBuilder({...args, patterns}).getStyles();
    
    expect(result).toBe('@media (max-width: 360px){.test{font-size: 0.8rem}}');
  });
  
  
  test('Check Style', () => {
    const patterns = {
      '.test': 'background: #121212;color: #eee',
      '.test2': {
        'style': {
          "background": "#121212",
          "color": "#eee",
          "padding": "1rem",
        },
      },
    };
    
    let result = new PatternBuilder({...args, patterns}).getStyles();
    
    expect(result).toBe('.test{background: #121212;color: #eee}.test2{background: #121212;color: #eee;padding: 1rem;}');
  });
  
});