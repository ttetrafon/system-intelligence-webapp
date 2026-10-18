import { Logger } from 'library/lib/services/logger';
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
  private initialised: boolean = false;
  private l: Logger;

  private nav: HTMLElement | null = null;
  private openMenuBtn: HTMLButtonElement | null = null;
  private closeMenuBtn: HTMLButtonElement | null = null;

  private openBound: (() => Promise<void>) | null = null;
  private closeBound: (() => Promise<void>) | null = null;

  constructor() {
    super();

    this.#shadow = this.attachShadow({ mode: 'open' });

    template.shadowRootDelegatesFocus = true;
    this.#shadow.appendChild(template.content.cloneNode(true));

    this.l = Logger.getInstance();
  }

  static get observedAttributes() { return []; }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
  }
  connectedCallback() {
    if (this.initialised) return;

    this.nav = this.#shadow.querySelector("nav");
    this.openBound = this.toggleMenu.bind(this, true);
    this.closeBound = this.toggleMenu.bind(this, false);

    this.openMenuBtn = this.#shadow.getElementById("open") as HTMLButtonElement;
    this.openMenuBtn.addEventListener("click", this.openBound);
    this.closeMenuBtn = this.#shadow.getElementById("close") as HTMLButtonElement;
    this.closeMenuBtn.addEventListener("click", this.closeBound);

    this.initialised = true;
  }
  disconnectedCallback() {
    if (this.openBound) this.openMenuBtn?.removeEventListener("click", this.openBound);
    if (this.closeBound) this.closeMenuBtn?.removeEventListener("click", this.closeBound);
  }
  adoptedCallback() {
  }

  async toggleMenu(open: boolean) {
    if (this.nav) this.nav.style.display = open ? 'flex' : 'none';
    if (this.closeMenuBtn) this.closeMenuBtn.style.display = open ? 'block' : 'none';
  }
}

window.customElements.define(componentName, Component);