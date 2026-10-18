import { Logger } from "library/lib/services/logger";
import mainStyles from '../../styles/style.css?inline';
import componentStyles from './styles.css?inline';
import templateHtml from './doc.html?raw';

const template: HTMLTemplateElement = document.createElement('template');
const componentName: string = "si-menu-item";

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

  private a: HTMLAnchorElement | null = null;
  private img: HTMLImageElement | null = null;
  private text: HTMLSpanElement | null = null;

  constructor() {
    super();

    this.#shadow = this.attachShadow({ mode: 'open' });

    template.shadowRootDelegatesFocus = true;
    this.#shadow.appendChild(template.content.cloneNode(true));

    this.l = Logger.getInstance();
  }

  static get observedAttributes() { return ['label', 'icon', 'depth', 'link']; }

  get depth() {
    const d: string | null = this.getAttribute('depth');
    return d ? parseInt(d) : 0;
  }
  get icon() { return this.getAttribute('icon') ?? ""; }
  get label() { return this.getAttribute('label') ?? ""; }
  get link() { return this.getAttribute('link') ?? "/"; }

  set depth(value: number) { this.setAttribute('depth', value.toString()); }
  set icon(value: string) { this.setAttribute('icon', value); }
  set label(value: string) { this.setAttribute('label', value); }
  set link(value: string) { this.setAttribute('link', value); }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    this.l.debug(`---> ${componentName.toUpperCase()}.attributeChangedCallback(${name}, ${oldVal}, ${newVal})`, componentName);
    if (oldVal == newVal) return;
    switch (name) {
      case 'icon':
        this.setImg();
        break;
      case 'label':
        this.setLabel();
        break;
      case 'link':
        this.setLink();
        break;
      case 'depth':
        this.setDepth();
        break;
      default:
        break;
    }
  }
  connectedCallback() {
    this.l.debug(`${componentName.toUpperCase()}.connectedCallback()`);
    if (this.initialised) return;

    this.a = this.#shadow.querySelector("a");
    this.setLink();
    this.setDepth();
    this.img = this.#shadow.querySelector("img");
    this.setImg();
    this.text = this.#shadow.querySelector("span");
    this.setLabel();

    this.initialised = true;
  }
  disconnectedCallback() {
  }
  adoptedCallback() {
  }

  setDepth() {
    if (this.a) this.a.style.paddingLeft = `${this.depth * 20}px`;
  }

  setImg() {
    this.img?.setAttribute("src", `/icons/menu/${this.icon}.png`);
    this.img?.setAttribute("alt", this.label ?? "Menu Icon");
    this.img?.setAttribute("title", this.label ?? "Menu Icon");
  }
  setLabel() {
    if (this.text) this.text.innerText = this.label ?? "";
  }
  setLink() {
    this.a?.setAttribute("href", this.link ?? "/");
    // TODO: set as navigator link instead
  }
}

window.customElements.define(componentName, Component);