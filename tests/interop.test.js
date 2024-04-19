import SSR from "../src/interop/scg.js";
import config from "../src/interop/mojo.config";


describe('Interop:: MojoSSR Check', () => {
  beforeAll(() => {
    config.options.minify = false;
    config.patterns = {
      ".test": "text-110"
    };
    config.utilities = [{
      name: "s",
      props: ["width", "height"],
    }
    ];
    config.capsules = [
      function capsule() {
        this.addPatterns({
          ".test2": "text-110"
        });
  
        this.appendCSS("h1{font-size: 2rem}");
        
        this.setConfig({
          base: {
            themes: {
              dark: {
                body: "#111",
                invert: "#eee",
              },
            },
          },
        });
  
        this.addUtility({
          name: "s2",
          props: ["width", "height"],
        });
      }
    ]
  });
  
  let html = `<html>
<head>
<title>Hello World</title>
<script src="./mojo.js"></script>
</head>
<body>
<div class="h-fullvh bg-c-body:-3 d-flex flex-col a-items-center j-content-center" i-md="px-10">
  <div class="w-full max-w-sm bg-c-body:+2 pa-10 rounded-md">
    <div class="border-bottom-1 border-c-invert[5] pb-6 mb-6">
      <div class="d-flex a-items-center flex-col gap-3 mb-6" sm="flex-row">
        <img class="max-h-12" src="https://raw.githubusercontent.com/mojocss/mojocss/HEAD/.github/logo-light.png" alt="Mojo CSS">
        <span class="text-xl text-c-primary text-w-semibold">Play</span>
      </div>
      <p class="text-lg text-c-invert[80]">
        A Playground excellent for getting the hang of the framework, testing
        out a new idea, or making a quick demo to share online.
      </p>
    </div>
    <div>
      <h3>Quick links</h3>
      <ul class="d-flex a-items-center gap-6 list-style-none" _="(li a) text-w-semibold text-c-primary (li a:hover) text-c-primary:-14" m-id="1">
        <li><a href="https://mojocss.com/docs">Documentation</a></li>
        <li><a href="https://twitter.com/mojocss">Twitter</a></li>
        <li><a href="https://github.com/mojocss/mojocss">GitHub</a></li>
      </ul>
    </div>
  </div>
</div>
</body>
</html>`
  
  test('Check constructor', () => {
    expect(new SSR(html, config)).toBeTruthy();
  });
  
  const mojoSSR = new SSR(html, config);
  test('Check render', () => {
    expect(mojoSSR.render()).toBeTruthy();
  });
});
