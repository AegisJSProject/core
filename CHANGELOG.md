# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
