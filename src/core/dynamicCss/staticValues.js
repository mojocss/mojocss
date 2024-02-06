export default class StaticValues {
  constructor(args) {
    this.args = args;
  }

  get() {
    return {
      _: {
        full: "100%",
        half: "50%",
        fullvw: "100vw",
        fullvh: "100vh",
      },
      "text-w": {
        ...this.args.config.base.definedValues.fontWeight,
      },
      "text-ls": {
        ...this.args.config.base.definedValues.letterSpacing,
      },
      "text-lh": {
        ...this.args.config.base.definedValues.lineHeight,
      },
      shadow: {
        ...this.args.config.base.definedValues.boxShadow,
      },
      order: {
        first: "-1",
        last: "99999",
        none: "0",
      },
      _i_rounded: {
        full: "999rem",
        none: "0",
        ...this.args.config.base.definedValues.borderRadius,
      },
    };
  }
}
