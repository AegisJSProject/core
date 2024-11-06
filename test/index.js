import {
	html, css, replaceStyles, getUniqueSelector, createComponent, closeRegistration,
	EVENTS, FUNCS, attr, data, observeEvents, policy, registerEventAttribute,
} from '@aegisjsproject/core';

import { reset } from '@aegisjsproject/styles/reset.js';
import { baseTheme, lightTheme, darkTheme } from '@aegisjsproject/styles/theme.js';
import { btn, btnPrimary, btnDanger, btnWarning, btnInfo, btnLink, btnSystemAccent, btnSuccess, btnSecondary } from '@aegisjsproject/styles/button.js';
import * as bootstrap from '@aegisjsproject/styles/palette/bootstrap.js';
import './dad-joke.js';


observeEvents();
const fooEvent = registerEventAttribute('foo', { addListeners: true });
const scope = getUniqueSelector();
document.body.setAttribute(fooEvent, FUNCS.debug.log);

replaceStyles(document, reset, baseTheme, lightTheme, darkTheme, btn, btnPrimary, btnDanger, btnWarning,
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

const DadJoke = await customElements.whenDefined('dad-joke');
const frag = document.createDocumentFragment();
const h1 = document.createElement('h1');

h1.classList.add(scope);
h1.textContent = 'Hello, World!';
frag.append(h1);

try {
	document.body.append(html`<header onclick="alert(location)" foo="bar">
		${frag}
		<hello-world>H1</hello-world><h1 foo="abr">Click Me!</h1>
		<svg viewBox="0 0 10 10" height="24" width="24">
			<rect x="0" y="0" height="10" width="10" rx="1" ry="1" fill="${bootstrap.info}" />
		</svg>
	</header>
	${policy.createHTML('<hr />')}
	${new DadJoke()}
	<div class="flex row wrap btn-container">
		<a href="./#invalid" class="btn btn-link disabled" ${EVENTS.onClick}="${FUNCS.ui.prevent}">Disabled Link</a>
		<button data-url="./#foo" ${EVENTS.onClick}="${FUNCS.navigate.link}" class="btn btn-link">Link</button>
		<button data-url="https://github.com/AegisJSProject/core/" ${EVENTS.onClick}="${FUNCS.navigate.popup}" class="btn btn-primary">Repo</button>
		<button type="button" ${EVENTS.onClick}="${() => alert('Testing!')}" class="btn btn-info">TEST</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.debug.log}" ${data({ foo: 'bar', title: document.title, url: location.href, yes: true, no: false, date: new Date(), el: document.createElement('div') })} class="btn btn-info" ${attr({ disabled: ! navigator.onLine, lang: navigator.language })}>Log</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.navigate.back}" class="btn btn-system-accent" accesskey="&lt;">Back</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.navigate.reload}" class="btn btn-system-accent" accesskey="r">Reload</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.navigate.forward}" class="btn btn-system-accent" accesskey="&gt;">Forward</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.ui.print}" class="btn btn-info">Print</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.ui.remove}" data-remove-selector="header" id="remove-btn" class="btn btn-danger">Remove Header</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.ui.disable}" data-disable-selector="#remove-btn" class="btn btn-warning">Disable Remove Btn</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.ui.enable}" data-enable-selector="#remove-btn" class="btn btn-success">Enable Remove Btn</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.ui.hide}" data-hide-selector="header" class="btn btn-warning">Hide Header</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.ui.unhide}" data-unhide-selector="header" class="btn btn-success">Show Header</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.ui.showModal}" data-show-modal-selector="#test-dialog" class="btn btn-info">Show Modal</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.ui.showPopover}" data-show-popover-selector="#popover" class="btn btn-info">Show Popover</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.ui.hidePopover}" data-hide-popover-selector="#popover" class="btn btn-secondary">Hide Popover</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.ui.togglePopover}" data-toggle-popover-selector="#popover" class="btn btn-primary">Toggle Popover</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.ui.scrollTo}" data-scroll-to-selector="#footer" class="btn btn-primary">Scroll To Footer</button>
		<button type="button" class="btn btn-primary btn-multi" ${EVENTS.onClick}="${FUNCS.ui.disable}" data-disable-selector=".btn:not(.btn-multi)" ${EVENTS.onContextmenu}="${FUNCS.ui.enable}" data-enable-selector=".btn" ${EVENTS.onWheel}="${FUNCS.ui.showPopover}" data-show-popover-selector="#help">Click to disable, right click to enable</button>
		<button type="button" class="btn btn-primary" ${EVENTS.onClick}="${({ target }) => target.remove()}">Final</button>
	</div>
	<main id="main">${document.getElementById('tmp')}</main>
	<dialog id="test-dialog" ${EVENTS.onToggle}="${FUNCS.debug.log}" ${EVENTS.onClose}="${FUNCS.debug.log}">
		<p>A Test Dialog</p>
		<button type="button" ${EVENTS.onClick}="${FUNCS.ui.closeModal}" data-close-modal-selector="#test-dialog">Close</button>
	</dialog>
	<div id="popover" popover="manual" ${EVENTS.onToggle}="${FUNCS.debug.log}">
		<p>A popover</a>
		<button type="button" ${EVENTS.onClick}="${FUNCS.ui.hidePopover}" data-hide-popover-selector="#popover">Close</button>
	</div>
	<div id="help" popover="auto">Should be shown on button scroll</div>
	<footer id="footer">This is the footer</footer>`);
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

// comp.showPopover();

setTimeout(() => document.body.dispatchEvent(new Event('foo')), 500);

closeRegistration();
