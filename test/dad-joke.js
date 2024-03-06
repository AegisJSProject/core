import { html, css, replace, registerCallback, getHost, EVENTS } from '@aegisjsproject/core';
import { gray } from '@aegisjsproject/styles/palette/bootstrap.js';
import { AegisComponent, SYMBOLS, TRIGGERS } from '@aegisjsproject/component';
import { updateIcon } from './icons.js';

const styles = css`
:host {
	padding: 1.2rem;
	width: clamp(400px, 100%, 600px);
	border-radius: 14px;
	border: 1px solid ${gray[3]};
}

[part="joke"] {
	height: 4rem;
	overflow-y: auto;
}

::slotted(p) {
	margin: 0;
}

.icon {
	vertical-align: bottom;
	height: 1em;
	height: 1lh;
	width: auto;
}

.joke {
	font-family: system-ui;
	padding: 1.3rem;
	border-radius: 8px;
	border: 1px solid #cacaca;
}`;

const template = html`
<div part="container">
	<div part="joke">
		<slot name="joke">Loading...</slot>
	</div>
	<button ${EVENTS.onClick}="${registerCallback('aegis:dad-joke:update', event => {
	try {
		getHost(event.target).triggerUpdate('click');
	} catch(err) {
		console.error(err);
	}
})}" type="button" id="update-btn" class="btn btn-primary" part="btn">
		<span>Get new Dad Joke</span>
	</button>
`;

class HTMLDataJokeElement extends AegisComponent {
	constructor() {
		super({ styles, template });
	}

	async [SYMBOLS.render](type, { shadow, ...data }) {
		switch(type) {
			case TRIGGERS.constructed:
				shadow.getElementById('update-btn').append(updateIcon.cloneNode(true));
				await this.update();
				break;

			case 'click':
				await this.update();
				break;

			default:
				console.log({ type, ...data });
				break;
		}
	}

	async update({ signal } = {}) {
		replace(this, html`<p slot="joke">${await HTMLDataJokeElement.getJoke({ signal })}</p>`);
	}

	static get endpoint() {
		return new URL('https://icanhazdadjoke.com');
	}

	static async getJoke({ signal } = {}) {
		const resp = await fetch(HTMLDataJokeElement.endpoint, {
			headers: { Accept: 'text/plain' },
			referrerPolicy: 'no-referrer',
			crossOrigin: 'anonymous',
			signal,
		});

		return await resp.text();
	}
}

HTMLDataJokeElement.register('dad-joke');
