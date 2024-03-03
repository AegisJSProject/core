# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v0.1.2] - 2024-03-02

### Changed
- Update README badges

##[v0.1.1] - 2024-03-02

### Added
- Add component and callback registry
- Add support for registering event handlers via attributes

### Changed
- Split into more modules
- Use `npm link` to use local `@aegisjsproejct/styles` & `@aegisjsproject/component`
- Provide individual parsers via own modules

### Fixed
- Allow `shadowrootmode` instead of `shadowroot`

## [v0.1.0] - 2024-02-27

### Changed
- Renamed to `@aegisjsproject/core`

## [v0.0.8] - 2024-02-23

### Changed
- Update stringifying, preferring direct use of `String.raw()`

## [v0.0.7] - 2024-02-20

### Added
- Add utility functions for [`trustedTypes`](https://developer.mozilla.org/en-US/docs/Web/API/trustedTypes)

## [v0.0.6] - 2024-02-08

### Added
- Add `sanitizeString()` function for independent use

## [v0.0.5] - 2024-02-07

### Changed
- Use `String.raw` instead of own implementation
- No longer force `Date`s to become `<time>`s

## [v0.0.4] - 2024-02-04

### Changed
- Update tests to use `@shgysk8zer0/aegis-styles` & `@shgysk8zer0/aegis-component`

### Fixed
- Fix bad info/badges/links in README

## [v0.0.3] - 2024-02-01

### Added
- Customized & `export`ed copy of sanitizer config
- Add functions to append or prepend or replace (`DocumentFragment`, `Node`, `CSSStyleSheet`, etc)
- Add `darkCSS` & `lightCSS`

### Changed
- Update various formatting methods
- Add handling for `<svg>` missing `xmlns`

## [v0.0.2] - 2024-01-26

### Added
- Add handling of formatting `values` containing `Element`s, `Array`s, `Date`s, & `Number`s

### Fixed
- Fix handling non-Node types in `addStyles()` & `replaceStyles()`

### Changed
- Directly install eslint & rollup as dev dependencies

## [v0.0.1] - 2024-01-25

Initial Release
