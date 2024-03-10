import {
	html, css, replaceStyles, getUniqueSelector, createPolicy, appendTo,
	EVENTS, FUNCS, attr,
} from '@aegisjsproject/core';
import { reset } from '@aegisjsproject/styles/reset.js';
import { baseTheme, lightTheme, darkTheme } from '@aegisjsproject/styles/theme.js';
import { btn } from '@aegisjsproject/styles/button.js';
import './dad-joke.js';

createPolicy('default', {
	createHTML: (input) => {
		const el = document.createElement('div');
		el.setHTML(input);
		return el.innerHTML;
	},
	createScript: () => trustedTypes.emptyScript,
});

const scope = getUniqueSelector();

replaceStyles(document, reset, baseTheme, lightTheme, darkTheme, btn, css`.${scope} {
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

appendTo(document.body, html`
	<header>
		${frag}
	</header>
	${trustedTypes.defaultPolicy.createHTML('<hr />')}
	${new DadJoke()}
	<div class="flex row wrap btn-container">
		<button data-url="./#foo" ${EVENTS.onClick}="${FUNCS.navigate.link}" class="btn btn-primary">Link</button>
		<button data-url="https://github.com/AegisJSProject/core/" ${EVENTS.onClick}="${FUNCS.navigate.popup}" class="btn btn-primary">Repo</button>
		<button type="button" ${EVENTS.onClick}="${() => alert('Testing!')}" class="btn btn-primary">TEST</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.debug.log}" data-foo="bar" class="btn btn-primary" ${attr({ disabled: ! navigator.onLine, lang: navigator.language })}>Log</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.navigate.back}" class="btn btn-primary">Back</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.navigate.forward}" class="btn btn-primary">Forward</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.navigate.reload}" class="btn btn-primary">Reload</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.ui.print}" class="btn btn-primary">Print</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.ui.remove}" data-selector="header" id="remove-btn" class="btn btn-primary">Remove Header</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.ui.disable}" data-selector="#remove-btn" class="btn btn-primary">Disable Remove Btn</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.ui.enable}" data-selector="#remove-btn" class="btn btn-primary">Enable Remove Btn</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.ui.hide}" data-selector="header" class="btn btn-primary">Hide Header</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.ui.unhide}" data-selector="header" class="btn btn-primary">Show Header</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.ui.showModal}" data-selector="#test-dialog" class="btn btn-primary">Show Modal</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.ui.showPopover}" data-selector="#popover" class="btn btn-primary">Show Popover</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.ui.hidePopover}" data-selector="#popover" class="btn btn-primary">Hide Popover</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.ui.togglePopover}" data-selector="#popover" class="btn btn-primary">Toggle Popover</button>
		<button type="button" ${EVENTS.onClick}="${FUNCS.ui.scrollTo}" data-selector="#footer" class="btn btn-primary">Scroll To Footer</button>
	</div>
	<main id="main">${document.getElementById('tmp')}</main>
	${css`.btn {font-size: 1.2em;} #main {min-height: 80vh}`}
	<dialog id="test-dialog">
		<p>A Test Dialog</p>
		<button type="button" ${EVENTS.onClick}="${FUNCS.ui.closeModal}" data-selector="#test-dialog">Close</button>
	</dialog>
	<div id="popover" popover="manual">
		<p>A popover</a>
		<button type="button" ${EVENTS.onClick}="${FUNCS.ui.hidePopover}" data-selector="#popover">Close</button>
	</div>
	<footer id="footer">This is the footer</footer>
`);
