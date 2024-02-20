import { html, css, replace, addStyles } from '@shgysk8zer0/aegis';
import { gray } from '@shgysk8zer0/aegis-styles/palette/bootstrap.js';
import { AegisComponent, registerComponent } from '@shgysk8zer0/aegis-component';
import { updateIcon } from './icons.js';

registerComponent('dad-joke', class HTMLDataJokeElement extends AegisComponent {
	constructor() {
		super();

		matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({ isTrusted, target }) => {
			if (isTrusted) {
				this.triggerUpdate('color-scheme', {
					mediaQuery: target,
					matches: target.matches,
					media: target.media,
				});
			}
		});
	}

	async [Symbol.for('aegis:render')](type, { shadow, ...data }) {
		switch(type) {
			case 'connected':
				if (shadow.adoptedStyleSheets.length < 6) {
					addStyles(shadow, css`:host {
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
					}`);
				}

				shadow.replaceChildren(html`<div part="container">
					<div part="joke">
						<slot name="joke">Loading...</slot>
					</div>
					<button type="button" id="update-btn" class="btn btn-primary" part="btn">
						<span>Get new Dad Joke</span>
					</button>
				</div>`);

				// Cannot add listeners or `on*` attributes using `html`
				shadow.getElementById('update-btn').addEventListener('click', () => this.triggerUpdate('click'));

				// Also, for now, elements of a different namespace, such as `<svg>` are not supported
				shadow.getElementById('update-btn').append(updateIcon.cloneNode(true));
				replace(this, html`<p slot="joke">${await HTMLDataJokeElement.getJoke()}</p>`);
				break;

			case 'click':
				replace(this, html`<p slot="joke">${await HTMLDataJokeElement.getJoke()}</p>`);
				break;

			case 'color-scheme':
			case 'attribute':
				console.log({ type, ...data });
				break;

			default:
				throw new DOMException(`Unhandled render trigger: "${type}".`);

		}
	}

	static async getJoke({ signal } = {}) {
		const resp = await fetch('https://icanhazdadjoke.com', {
			headers: { Accept: 'text/plain' },
			referrerPolicy: 'no-referrer',
			crossOrigin: 'anonymous',
			signal,
		});

		return await resp.text();
	}
});
