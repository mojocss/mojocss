import Defaults from "./defaults.js";

let filter = Defaults[0].replace("filter: ", "");
let b_filter = Defaults[1].replace("-webkit-backdrop-filter: ", "");
let transform = Defaults[2].replace("transform: ", "");

export default {
  "--m-f-": {
    filter: filter,
  },
  "--m-bf-": {
    "-webkit-backdrop-filter:": b_filter,
  },
  "--m-t-": {
    transform: transform,
  },
};
