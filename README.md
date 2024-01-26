# `@shgysk8zer0/aegis`

A fast, secure, modern, light-weight, and simple JS library for creating web components and more! 

[![CodeQL](https://github.com/shgysk8zer0/aegis/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/shgysk8zer0/npm-template/actions/workflows/codeql-analysis.yml)
![Node CI](https://github.com/shgysk8zer0/aegis/workflows/Node%20CI/badge.svg)
![Lint Code Base](https://github.com/shgysk8zer0/aegis/workflows/Lint%20Code%20Base/badge.svg)

[![GitHub license](https://img.shields.io/github/license/shgysk8zer0/aegis.svg)](https://github.com/shgysk8zer0/aegis/blob/master/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/shgysk8zer0/aegis.svg)](https://github.com/shgysk8zer0/aegis/commits/master)
[![GitHub release](https://img.shields.io/github/release/shgysk8zer0/aegis?logo=github)](https://github.com/shgysk8zer0/aegis/releases)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/shgysk8zer0?logo=github)](https://github.com/sponsors/shgysk8zer0)

[![npm](https://img.shields.io/npm/v/@shgysk8zer0/npm-template)](https://www.npmjs.com/package/@shgysk8zer0/npm-template)
![node-current](https://img.shields.io/node/v/@shgysk8zer0/npm-template)
![npm bundle size gzipped](https://img.shields.io/bundlephobia/minzip/@shgysk8zer0/npm-template)
[![npm](https://img.shields.io/npm/dw/@shgysk8zer0/npm-template?logo=npm)](https://www.npmjs.com/package/@shgysk8zer0/npm-template)

[![GitHub followers](https://img.shields.io/github/followers/shgysk8zer0.svg?style=social)](https://github.com/shgysk8zer0)
![GitHub forks](https://img.shields.io/github/forks/shgysk8zer0/aegis.svg?style=social)
![GitHub stars](https://img.shields.io/github/stars/shgysk8zer0/aegis.svg?style=social)
[![Twitter Follow](https://img.shields.io/twitter/follow/shgysk8zer0.svg?style=social)](https://twitter.com/shgysk8zer0)

[![Donate using Liberapay](https://img.shields.io/liberapay/receives/shgysk8zer0.svg?logo=liberapay)](https://liberapay.com/shgysk8zer0/donate "Donate using Liberapay")
- - -

- [Code of Conduct](./.github/CODE_OF_CONDUCT.md)
- [Contributing](./.github/CONTRIBUTING.md)
<!-- - [Security Policy](./.github/SECURITY.md) -->

## Installation

### CDN / `unpkg.com`

The preferred method of using Aegis is via `import` from `https://unpkg.com/@shgysk8zer0/aegis[@:version]`.
You may use [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity),
but this is only recommended *if* you include a version in the script URL. For
convenience, you maybe desire using [`<script type="importmap">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) in your development setup and a plug-in such as
[`@shgysk8zer0/rollup-import`](https://www.npmjs.com/package/@shgysk8zer0/rollup-import)
when bundling for production.

### NPM/Node

Of course, you could always stick with the the more familiar package installation:

```bash
npm install @shgysk8zer0/aegis
```

That works just fine, should you prefer.

### Git Submodule

A final option is installing via a [git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules).

```bash
git submodule add https://github.com/shgysk8zer0/aegis.git [:destination_path]
```

Submodules ultimately make little difference compared to the CDN or installing the
package, should you prefer that option. There are no dependencies, and you probably
just end up using a different source/URL for your `<script>` or `import`. The one
and only difference to consider is that this will not include the generated CommonJS
(use for `require()`) version.

## Security

This library is designed with security, and specifically strict [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) and [`TrustedTypes`](https://developer.mozilla.org/en-US/docs/Web/API/trustedTypes), in mind.

However, since the [Sanitizer API](https://github.com/WICG/sanitizer-api) is an
in-development API and [`new CSStyleSheet()`](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/CSSStyleSheet)
is not universally supported, the polyfills require some minimal adjustments to
any Content-Security-Policy:

### CSP - `script-src`

For the recommended polyfills, allowing script from `https://unpkg.com/@shgysk8zer0/`
(you can be more restrictive/specific to `https://unkg.com/@shgysk8zer0/polyfills@:version`) will
be necessary.

### CSP - `style-src`

The recommended polyfill for `new CSSStyleSheet()` and `adoptedStyleSheets` requires
use of `URL.createObejctURL()`. As such, `style-src` is suggested to allow `blob:` URIs.

### CSP - `trusted-types`

For the sake of the Sanitizer API polyfill, if you have `trusted-types` as part
of your CSP, you must allow `empty#html` and `empty#script` (for `trustedTypes.emptyHTML`
and `trustedTypes.emptyScript`).

### Additional Security Considerations

- All commits are PGP/GPG signed, ensuring the authenticity of the author
- All releases use [Package Provenance](https://github.blog/2023-04-19-introducing-npm-package-provenance/),
proving that the generated & published package was created by a specific (and signed)
commit

## Compatibility

This library relies on the [Sanitizer API proposal](https://github.com/WICG/sanitizer-api)
and [Constructable Stylesheets](https://web.dev/articles/constructable-stylesheets).
At minimum, there **MUST** be a polyfill for [`Element.prototype.setHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/setHTML).

## Performance/Optimization Tips

### HTML Templates / Fragments
The `html` function returns a `DocumentFragment` which cannot be directly reused
in multiple places. Should you wish to reuse the fragment and only generate it once,
please use [`cloneNode(true)`](https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode):

```js
import { html } from '@shgysk8zer0/aegis';

const tmp = html`<!-- Your HTML here -->`

document.querySelector('.my-component').append(tmp.cloneNode(true));
```

### StyleSheets / CSS

On the other hand, `css` relies on `adoptedStyleSheets` for `Document`/`ShadowRoot`,
which *does* allow for easy reuse without cloning. You may (and probably should)
reuse where possible. You may use either `rootOrShadow.adoptedStyleSheets = [sheet]`
or the provided `addStyles(target, ...sheets)` or `replaceStyles(target, ...sheets)`
functions.

### Use as ES Modules

Since [`import attributes` / `import attributes` / CSS and HTML Modules](https://github.com/tc39/proposal-import-attributes)
are not yet standardized or implemented anywhere, this library allows for easy
HTML templates and styles via plain old ES/JS Modules:

```js
import { html, css } from '@shgysk8zer0/aegis';

export const template = html`<!-- Your Markup Here -->`;

export const sheet = css`/* Your Styles Here */`;
```

## Path to a Stable Release (v1.0.0)

Since this relies on [`Element.prototype.setHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/setHTML),
which is a developing proposal, Aegis will remain in pre-1.0.0/stable release until
that proposal is stable. Until then, you may use [`@shgysk8zer0/polyfills`](https://www.npmjs.com/package/@shgysk8zer0/polyfills) or any compatible polyfill of your choosing.

## Basic Usage Notes

Outside of usage in web components/custom elements, it is important to understand
how Constructable Stylesheets and [`adoptedStyleSheets`](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/adoptedStyleSheets)
work. When using `css`, stylesheets will be adopted by the `Document` and apply
the same as any other stylesheet (not scoped). Should you want to scope your styles
outside of the context of web components (using `ShadowRoot`), you should create
a unique selector and utilize that when composing your stylesheets:

```js
import { css, html, getUniqueSelector, addStyles } from '@shgysk8zer0/aegis';

const scope = getUniqueSelector();

document.body.append(html`
  <div id="${scope}">
    <span class="my-class">Hello, World!</span>
  </div>
`);

addStyles(document, css`#${scope} .my-class {color: red;}`);
```

## Basic Web Component Example - `<dad-joke>`

```js
import { html, css, replaceStyles } from '@shgysk8zer0/aegis';

const styles = css`:host {
	display: block;
}

blockquote {
	font-family: system-ui;
	padding: 1.3rem;
	border-radius: 8px;
	border: 1px solid #cacaca;
}

button {
	cursor: pointer;
}`;

customElements.define('dad-joke', class HTMLDataJokeElement extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	connectedCallback() {
		this.render();
	}

	async render({ signal } = {}) {
		this.shadowRoot.replaceChildren(html`
			<blockquote>${await HTMLDataJokeElement.getJoke({ signal })}</blockquote>
			<button type="button">Get new Dad Joke</button>
		`);

		this.shadowRoot.querySelector('button').addEventListener('click', () => this.render());

		replaceStyles(this, styles);
	}

	static async getJoke({ signal } = {}) {
		const resp = await fetch('https://icanhazdadjoke.com', {
			headers: { Accept: 'text/plain' },
			referrerPolicy: 'no-referrer',
			signal,
		});

		return await resp.text();
	}
});
```

## Advanced Usage

The provided `html` uses the default white-list for elements and attributes,
which does not allow for `<svg>`, `<math>` (MathML), or custom elements by default.
Should you have need of such features, you may use `createHTMLParser()` with the
desired config/options.

**Note**: Directions and documentation for config options are not provided in these
early release, as the Sanitizer API is not stable and is subject to change.

There is also an additional `createCSSParser({ media, disabled, baseURI })` function
which returns a custom `css` parsing function.

### Advanced Exampled

```js
import { createHTMLParser, createCSSParser } from '@shgysk8zer0/aegis';

const html = createHTMLParser({
  allowElements: ['h1', 'h2', 'span', 'a', 'img', 'blockquote'],
  allowAttributes: ['href', 'class', 'id', 'src'],
});

const css = createCSSParser({ media: '(prefers-color-scheme: dark)', bnaseURI: 'https://cdn.example.com' });

// `html` & `css` then function as the regular / exported function, but with their
custom white/black lists / config options.
```

## SVG Generation

There is a provided `svg` function, but it should be noted that all SVGs **MUST**
include `<svg xmlns="http://www.w3.org/2000/svg">`. This is due to the requirements
of `new DOMParser().parseFromString(svgContent, 'image/svg+xml')`. You may also
want to set `viewBox` as necessary.
