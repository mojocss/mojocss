import mojoDOM from "./src/interop/dom.js";

const m = (config) => mojoDOM.render(config);
try {
    if(window) window.mojo = m;
} catch (e) {
    // eslint-disable-next-line no-empty
}

export default m;
