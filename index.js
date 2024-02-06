import mojo from "./src/interop/dom.js";

export default function m(config) {
    mojo(config);
}

if(window)
    window.mojo = m;
