# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2024-04-19

### Added

- **SCG(Static CSS Generation):** Generates CSS from HTML. Useful for Progressive Rendering.
- **New color utilities:** now you can change color's tinting or hading amount without specifying the color name. (e.g. `bg-c:+5`)
- **Using variants inside arbitrary selectors**: `_="(@dark:hover .testclass) bg-c-red"` is now possible.
- **Logical margin and padding utilities:** Added `ms-*` `me-*` `ps-*` `pe-*`

### Changed

- **Color System:** Optimized the color engine to use HSLA instead of RGBA.
- **Compile Algorithm**: Improved compile speed and reduced memory usage.
- **Utilities**: Created mappings for specific utilities.
- **Optimization**: ~10% reduction in Mojo's overall size.
- **Shorter `border` and `rounded` namings**: Changed `top`, `right`, `bottom`, `left` to `t`, `r`, `b`, `l`. (e.g. `border-top-1` => `border-t-1`)

### Fixed

- **Patten bugs**: Fixed some bugs in patterns.
- **CSS String Bugs**: Fixed some bugs in CSS string generation.
- **Calc Regex Bug**: According to ([#13](https://github.com/mojocss/mojocss/issues/13))
- **Media Query Bugs**: Fixed bugs in generating media queries for variants like `print`.

## [0.1.1] - 2024-02-12

### Fixed

- **Patten Bug:** Media query ordering ([#5](https://github.com/mojocss/mojocss/issues/5))
