import mojoDOM from "./src/interop/dom.js";

window.mojo = function (c) {
  mojoDOM.render(c)
};