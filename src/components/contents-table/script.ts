import mainStyles from '../../styles/style.css?inline';
import componentStyles from './styles.css?inline';
import templateHtml from './doc.html?raw';

const template: HTMLTemplateElement = document.createElement('template');
const componentName: string = "si-contents";

template.innerHTML = /*html*/`
<style>
  ${mainStyles}
  ${componentStyles}
</style>

${templateHtml}
`;

class Component extends HTMLElement {
  #shadow: ShadowRoot;

  constructor() {
    super();

    this.#shadow = this.attachShadow({ mode: 'open' });

    template.shadowRootDelegatesFocus = true;
    this.#shadow.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() { return []; }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
  }
  connectedCallback() {
  }
  disconnectedCallback() {
  }
  adoptedCallback() {
  }
}

window.customElements.define(componentName, Component);