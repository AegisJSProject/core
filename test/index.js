import { html, css, addStyles, getUniqueSelector } from '@shgysk8zer0/aegis';

const scope = getUniqueSelector();

addStyles(document, css`.${scope} {
	color: red;
}`);

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
		addStyles(this, styles);
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

document.body.append(html`<h1 class="${scope}">Hello, World!</h1>`, document.createElement('dad-joke'));
