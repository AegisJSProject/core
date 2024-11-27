<!-- markdownlint-disable -->
# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v0.2.21] - 2024-11-26

### Changed
- Misc dependency updates

## [v0.2.20] - 2024-11-25

### Added
- Add support for stringifying of `AbortSignal` and `AbortController` using `@aegisjsproject/callback-registry`

### Updated
- Various lib updates

### Fixed
- Remove duplication of Trusted Types Policy for sanitizer (removed polyfills)

## [v0.2.19] - 2024-11-17

### Changed
- Use `@aegisjsproject/callback-registry` instead of own registry

### Removed
- Do not include `attributeObserver.js` in default export/bundles

## [v0.2.18] - 2024-11-14

### Fixed
- Fixed stringifying elements

## [v0.2.17] - 2024-11-09

### Added
- Add unsafe versions of `html` and `doc` via `setHTMLUnsafe` and `parseHTMLUnsafe`

### Changed
- Upadte `@aegisjsproject/parsers`

## [v0.2.16] - 2024-11-06

### Changed
- Various updates for compatibility with new/updated dependencies

## [v0.2.15] - 2024-09-25

### Added
- Add `url` parser via `@aegisjsproject/parsers`

### Changed
- Update dependencies and config

## [v0.2.14]

### Changed
- Update dependencies and config

## [v0.2.13] - 2024-04-10

### Changed
- More updates to `@aegisjsproject/parsers`

## [v0.2.12] - 2024-04-09

### Fixed
- Fix default policy to use updated `setHTML` config

## [v0.2.11] - 2024-04-09

### Changed
- Update how `createComponent()` handles string templates

### Fixed
- Fix typo in setting `exportparts`

## [v0.2.10] - 2024-04-09

### Changed
- Update `@aegisjsproject/sanitizer`
- Update Linter versions & config

## [v0.2.9] - 2024-04-05

### Added
- Default Trusted Types Policy now provides a `createScriptURL` method

## [v0.2.8] - 2024-04-05

### Changed
 Improve default policy compatibility (check Sanitizer API support)

## [v0.2.7] - 2024-04-05

### Added
- Add default Trusted Types Policy using Sanitizer (with optional config)
- Add various bundle options including default policy

## [v0.2.6] - 2024-04-03

### Changed
- Update Sanitizer Config

## [v0.2.5] - 2024-04-02

### Added
- Add minified version of polyfill script

### Fixed
- Update `@aegisjsproject/sanitizer` with fix for `Object.groupBy`

## [v0.2.4] - 2024-04-01

### Fixed
- Update `@aegisjsproject/sanitizer` to fix potential exploit

## [v0.2.3] - 2024-03-30

### Added
- Add minified bundle
- Add `createComponent()` for creating elements with Shadow DOM (not full Web Components/Custom Elements)

### Changed
- Switch to using `@aegisjsproject/parsers` as base for own parsers

## [v0.2.2] - 2024-03-27

#### Fixed
- Update `@aegisjsproject/sanitizer` to fix parsers

## [v0.2.1] - 2024-03-27

### Fixed
- Update `@aegisjsproject/sanitizer`to fix `setHTML` appending

## [v0.2.0] - 2024-03-26

### Added
- Add & use `@aegisjsproject/sanitizer`
- Add observer for attributes via `attributeObserver.js` module
- Add `setGlobalErrorHandler()`

## [v0.1.7] - 2024-03-19

### Changed
- Update allowed tags and attributes for sanitizer

## [v0.1.6] - 2024-03-18

### Added
- Add `FUNCS.ui.prevent` (`event => event.preventDefault()`)

### Changed
- Registered callbacks with selectors now have prefixes for their `data-*-selector`s
- Improve logic of sanitizing/escaping attributes
- Move attribute related functions to `dom.js`

### Fixed
- Fix typo in `FUNCS.ui.scrollTo`

## [v0.1.5] - 2024-03-11

### Added
- Added `MutationObserver` to add/remove event listeners on DOM modifications

### Changed
- Do not remove `data-aegis-event-on-*` attributes when adding listeners

## [v0.1.4] - 2024-03-09

### Added
- Handle wider variety of objects (such as `HTMLTemplateElement` and `NodeList`, and even functions) in `stringify()`
- Allow attributes for the [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)
- Add more built-in callbacks to the callback registry
- Add function to get registered component observed attributes by tag name

### Changed
- Refactor event handling
- Do not remove other attributes when adding event listeners from callback registry
- Update Polyfills version (allowing `data-*` attributes)

### Removed
- Remove `AEGIS_EVENT_HANDLER_CLASS`

## [v0.1.3] - 2024-03-05

### Added
- Components registered via `registerComponent()` are now automatically allowed in sanitizer `allowElements`

### Changed
- Update `README.md` to be more accurate/current
- Query by calculated selector of attributes in `attachListeners()`

### Fixed
- Remove `nonce` and update `integrity` in CSP & `<script type="importmap">`

### Deprecated
- `AEGIS_EVENT_HANDLER_CLASS` is no longer needed and is deprecated

### Removed
- Remove references to unused `<aegis-modal>`

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
