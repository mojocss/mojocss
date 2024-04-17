export default {
  options: {
    initialStyles: true,
    rtl: false,
    minify: true,
    darkMode: {
      enabled: false,
      theme: "dark",
    },
  },
  base: {
    themes: {
      default: {
        body: "#fff",
        invert: "#202129",
        primary: "#ff6145",
        white: "#fff",
        black: "#000",
        gray: "#666666",
        grayblue: "#455370",
        red: "#e84c3d",
        pink: "#ff004e",
        orange: "#f39b13",
        yellow: "#f1c40f",
        tealblue: "#01caff",
        blue: "#0078ff",
        green: "#2ccd70",
        purple: "#5a51de",
        bronze: "#c67c3b",
        orchid: "#9a59b5",
        charocoal: "#31394c",
      },
    },
    fonts: {
      default: {
        "system-ui": "",
        "-apple-system": "",
        BlinkMacSystemFont: "",
        "'Segoe UI'": "",
        Roboto: "",
        Oxygen: "",
        Ubuntu: "",
        Cantarell: "",
        "'Open Sans'": "",
        "'Helvetica Neue'": "",
        "sans-serif": "",
      },
    },
    breakpoints: {
      default: {
        fontSize: "14px",
        container: {
          padding: "0 1rem",
        },
      },
      sm: {
        min: "576px",
        container: {
          maxWidth: "576px",
        },
      },
      md: {
        min: "768px",
        container: {
          maxWidth: "768px",
        },
      },
      lg: {
        min: "992px",
        container: {
          maxWidth: "992px",
        },
      },
      xl: {
        min: "1200px",
        fontSize: "16px",
        container: {
          maxWidth: "1200px",
        },
      },
      xxl: {
        min: "1600px",
        fontSize: "20px",
        container: {
          maxWidth: "1500px",
        },
      },
    },
    textDesign: {
      sm: {
        fontSize: "0.875rem",
        lineHeight: "1.5",
      },
      md: {
        fontSize: "1rem",
        lineHeight: "1.5",
      },
      lg: {
        fontSize: "1.125rem",
        lineHeight: "1.5",
      },
      xl: {
        fontSize: "1.5rem",
        lineHeight: "1.5",
      },
      xxl: {
        fontSize: "2rem",
        lineHeight: "1.5",
      },
    },
    definedValues: {
      letterSpacing: {
        tighter: "-0.05em",
        tight: "-0.03em",
        loose: "0.05em",
        looser: "0.1em",
        open: "0.2em",
      },
      lineHeight: {
        tighter: "0.7",
        tight: "0.9",
        loose: "1.2",
        looser: "1.5",
        open: "2",
        resp: "1.3em",
      },
      fontWeight: {
        black: 900,
        extrabold: 800,
        bold: 700,
        semibold: 600,
        medium: 500,
        normal: 400,
        light: 300,
        thin: 200,
        hair: 100,
      },
      borderRadius: {
        xs: "0.2rem",
        sm: "0.4rem",
        md: "0.8rem",
        lg: "1.2rem",
        xl: "1.6rem",
        xxl: "2rem",
      },
      boxShadow: {
        xs: "0 1px 2px var(--m-shadow-color, #0000001a)",
        sm: "0 1px 3px var(--m-shadow-color, #0000001a), 0 1px 2px var(--m-shadow-color, #0000001a)",
        md: "0 4px 6px var(--m-shadow-color, #0000001a), 0 2px 4px var(--m-shadow-color, #0000001a)",
        lg: "0 10px 15px var(--m-shadow-color, #0000001a), 0 4px 6px var(--m-shadow-color, #0000001a)",
        xl: "0 20px 25px var(--m-shadow-color, #0000001a), 0 10px 10px var(--m-shadow-color, #0000001a)",
      },
      animation: {
        spin: {
          dur: "1.5s linear infinite",
          keyframes: {
            "100%": {
              idle: "transform:rotate(1turn)",
            },
          },
        },
        flare: {
          dur: "1s cubic-bezier(0, 0, 0.2, 1) infinite",
          keyframes: {
            "75%, 100%": {
              idle: "transform:scale(2) opacity-0",
            },
          },
        },
        pulse: {
          dur: "2s cubic-bezier(0.4, 0, 0.8, 1) infinite",
          keyframes: {
            "0%, 100%": {
              idle: "opacity-100",
            },
            "50%": {
              idle: "opacity-30",
            },
          },
        },
      },
    },
    units: {
      fontSize: "0.01rem",
      scale: "0.01",
      sizing: "0.25rem",
      transition: "1ms",
      rounded: "0.125rem",
      lighten: "2.0",
      darken: "1.2",
    },
    lightenFn: null,
    darkenFn: null,
  },
  capsules: [],
  patterns: {},
};
