import {
	html, css, replaceStyles, getUniqueSelector, createComponent, closeRegistration,
	data, attr, createTrustedHTMLTemplate, createStyleScope,
} from '@aegisjsproject/core';

import { sanitizer as defaultSanitizer } from '@aegisjsproject/sanitizer/config/html.js';
import { FUNCS, observeEvents, on, registerEventAttribute } from '@aegisjsproject/callback-registry';
import { onChange, onClick, onToggle, onClose, onContextmenu, onWheel, signal, controller as controllerAttr } from '@aegisjsproject/callback-registry/events.js';
import { reset } from '@aegisjsproject/styles/reset.js';
import { baseTheme, lightTheme, darkTheme } from '@aegisjsproject/styles/theme.js';
import { btn, btnPrimary, btnDanger, btnWarning, btnInfo, btnLink, btnSystemAccent, btnSuccess, btnSecondary } from '@aegisjsproject/styles/button.js';
import { manageState, stateStyle, stateKey, observeDOMState } from '@aegisjsproject/state';
import * as bootstrap from '@aegisjsproject/styles/palette/bootstrap.js';
import './dad-joke.js';

const policy = trustedTypes.createPolicy('default', {
	createHTML(input, sanitizer) {
		const el = document.createElement('div');

		if (typeof sanitizer === 'object') {
			el.setHTML(input, { sanitizer });
		} else {
			el.setHTML(input, { sanitizer: defaultSanitizer });
		}

		return el.innerHTML;
	}
});

const trustedHTML = createTrustedHTMLTemplate(policy);

const controller = new AbortController();
const imgController = new AbortController();
const [bg, setBg] = manageState('bg', '#232323');
const fooEvent = registerEventAttribute('foo', { addListeners: true });
const scope = getUniqueSelector();
const blob = new Blob([`<svg height="300" width="300" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
	<rect x="0" y="0" rx="1" ry="1" height="10" width="10" fill="#${crypto.getRandomValues(new Uint8Array(3)).toHex()}"></rect>
</svg>`], { type: 'image/svg+xml' });

document.body.setAttribute(fooEvent, FUNCS.debug.log);
document.body.dataset[stateKey] = 'bg';
document.body.dataset[stateStyle] = 'background-color';

replaceStyles(document, ...document.adoptedStyleSheets, reset, baseTheme, lightTheme, darkTheme, btn, btnPrimary, btnDanger, btnWarning,
	btnInfo, btnSystemAccent, btnSuccess, btnLink, btnSecondary,
	css`.${scope} {
		color: red;
	}

	.btn-container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-block: 1.2rem;
	}
`);

const style = createStyleScope(document.body, { media: matchMedia('(min-width: 800px)')});

const DadJoke = await customElements.whenDefined('dad-joke');
const frag = document.createDocumentFragment();
const h1 = document.createElement('h1');

h1.classList.add(scope);
h1.textContent = 'Hello, World!';
frag.append(h1);

try {
	document.body.append(html`<header class="${style`
			background-color: rgb(0, 0, 0, 0.6);
			backdrop-filter: blur(4px);
		`}" onclick="alert(location)" foo="bar">
		${frag}
		<hello-world></hello-world><h1 foo="bar">Click Me!</h1>
		<svg viewBox="0 0 10 10" height="24" width="24">
			<rect x="0" y="0" height="10" width="10" rx="1" ry="1" fill="${bootstrap.info}" />
		</svg>
	</header>
	<nav class="flex row wrap btn-container">
		<a href="./#invalid" class="btn btn-link disabled" ${onClick}="${FUNCS.ui.prevent}">Disabled Link</a>
		<button data-url="./#foo" ${onClick}="${FUNCS.navigate.link}" ${signal}="${controller.signal}" class="btn btn-link">Link</button>
		<button data-url="https://github.com/AegisJSProject/core/" ${onClick}="${FUNCS.navigate.popup}" ${signal}="${controller.signal}" class="btn btn-primary">Repo</button>
		<button type="button" ${onClick}="${() => alert('Testing!')}" ${signal}="${controller.signal}" class="btn btn-info">TEST</button>
		<button type="button" ${onClick}="${FUNCS.debug.log}" ${signal}="${controller.signal}" ${data({ foo: 'bar', title: document.title, url: location.href, yes: true, no: false, date: new Date(), el: document.createElement('div') })} class="btn btn-info" ${attr({ disabled: ! navigator.onLine, lang: navigator.language })}>Log</button>
		<button type="button" ${onClick}="${FUNCS.navigate.back}" ${signal}="${controller.signal}" class="btn btn-system-accent" accesskey="&lt;">Back</button>
		<button type="button" ${onClick}="${FUNCS.navigate.reload}" ${signal}="${controller.signal}" class="btn btn-system-accent" accesskey="r">Reload</button>
		<button type="button" ${onClick}="${FUNCS.navigate.forward}" ${signal}="${controller.signal}" class="btn btn-system-accent" accesskey="&gt;">Forward</button>
		<button type="button" ${onClick}="${FUNCS.ui.print}" ${signal}="${controller.signal}" class="btn btn-info">Print</button>
		<button type="button" ${onClick}="${FUNCS.ui.remove}" ${signal}="${controller.signal}" data-remove-selector="header" id="remove-btn" class="btn btn-danger">Remove Header</button>
		<button type="button" ${onClick}="${FUNCS.ui.disable}" ${signal}="${controller.signal}" data-disable-selector="#remove-btn" class="btn btn-warning">Disable Remove Btn</button>
		<button type="button" ${onClick}="${FUNCS.ui.enable}" ${signal}="${controller.signal}" data-enable-selector="#remove-btn" class="btn btn-success">Enable Remove Btn</button>
		<button type="button" ${onClick}="${FUNCS.ui.hide}" ${signal}="${controller.signal}" data-hide-selector="header" class="btn btn-warning">Hide Header</button>
		<button type="button" ${onClick}="${FUNCS.ui.unhide}" ${signal}="${controller.signal}" data-unhide-selector="header" class="btn btn-success">Show Header</button>
		<button type="button" ${onClick}="${FUNCS.ui.showModal}" ${signal}="${controller.signal}" data-show-modal-selector="#test-dialog" class="btn btn-info">Show Modal</button>
		<button type="button" ${onClick}="${FUNCS.ui.showPopover}" ${signal}="${controller.signal}" data-show-popover-selector="#popover" class="btn btn-info">Show Popover</button>
		<button type="button" ${onClick}="${FUNCS.ui.hidePopover}" ${signal}="${controller.signal}" data-hide-popover-selector="#popover" class="btn btn-secondary">Hide Popover</button>
		<button type="button" ${onClick}="${FUNCS.ui.togglePopover}" ${signal}="${controller.signal}" data-toggle-popover-selector="#popover" class="btn btn-primary">Toggle Popover</button>
		<button type="button" ${onClick}="${FUNCS.ui.scrollTo}" ${signal}="${controller.signal}" data-scroll-to-selector="#footer" class="btn btn-primary">Scroll To Footer</button>
		<button type="button" class="btn btn-primary btn-multi" ${onClick}="${FUNCS.ui.disable}" ${signal}="${controller.signal}" data-disable-selector=".btn:not(.btn-multi)" ${onContextmenu}="${FUNCS.ui.enable}" data-enable-selector=".btn" ${onWheel}="${FUNCS.ui.showPopover}" data-show-popover-selector="#help">Click to disable, right click to enable</button>
		<button type="button" class="btn btn-warning" ${onClick}="${FUNCS.ui.abortController}" ${controllerAttr}="${controller}" ${signal}="${controller.signal}">Abort</button>
		<button type="button" class="btn btn-danger" ${on('click', ({ target }) => target.remove(), { once: true, signal: controller.signal })}>Remove Btn</button>
	</nav>
	<main id="main">
		${policy.createHTML('<hr />')}
		${new DadJoke()}
		${document.getElementById('tmp')}
		<input type="color" ${onChange}="${({ target }) => setBg(target.value)}" value="${bg}" ${signal}="${controller.signal}" />
	</main>
	<dialog id="test-dialog" ${onToggle}="${FUNCS.debug.log}" ${onClose}="${FUNCS.debug.log}" ${signal}="${controller.signal}">
		<p>A Test Dialog</p>
		<button type="button" ${onClick}="${FUNCS.ui.closeModal}" data-close-modal-selector="#test-dialog">Close</button>
	</dialog>
	<div id="popover" popover="manual" ${onToggle}="${FUNCS.debug.log}" ${signal}="${controller.signal}">
		<p>A popover</a>
		<button type="button" ${onClick}="${FUNCS.ui.hidePopover}" ${signal}="${controller.signal}" data-hide-popover-selector="#popover">Close</button>
		<img src="${blob}"
		${on('load', ({ target }) => {
		imgController.abort();
		URL.revokeObjectURL(target.src);
	}, { once: true, signal: imgController.signal })}

		${on('error', ({ target }) => {
		imgController.abort();
		URL.revokeObjectURL(target.src);
		console.error(`Error loading <img src="${target.src}">`);
	}, { once: true, signal: imgController.signal })} />
	</div>
	<div id="help" popover="auto">Should be shown on button scroll</div>
	`);

	document.body.insertAdjacentHTML('beforeend', trustedHTML`<footer id="footer">
		<div>
			<template shadowrootmode="closed">
				<p part="content"><slot name="content">No Content</p>
			</template>
			<span slot="content">Hello, World!</span>
		</div>
	</footer>`);
} catch(err) {
	console.error(err);
}

const comp = createComponent({
	tag: 'div',
	mode: 'closed',
	template: `<div part="container" id="container">
		<p part="text" class="text">
			<span>Hello, <slot slot="name">World</slot></span>
		</p>
	</div>`,
	styles: `:host {
		color-scheme: light dark;
		font-family: system-ui;
		color: red;
		border: 1px solid #dadada;
		padding: 0.4rem 1.8rem;
		border-radius: 8px;
		margin: unset;
		inset: auto 0.8rem 0.6rem auto;
	}`,
	exportParts: ['text'],
	sanitizer: {
		elements: ['div', 'p', 'span', 'slot'],
		attributes: ['part', 'id', 'class', 'name'],
		datAttributes: false,
	},
	// children: ['<span slot="name">Chris</span>'],
	popover: 'auto',
});

document.body.append(comp);

setTimeout(() => document.body.dispatchEvent(new Event('foo')), 500);
observeDOMState(document.documentElement, { signal: controller.signal });
closeRegistration();
observeEvents();
