import { Logger } from "library/lib/services/logger";
import { State } from "library/lib-fe/services/state";
import { Translations, Translator } from "library/lib-fe/services/translator";
import { request, requestPost } from "library/lib-fe/util/Requests";
import { userLogin } from "library/shared/data/endpoints";
import { createDpopProof } from "../../../library/lib-fe/security/dpop";
import { getDeviceLabel } from "../../../library/lib-fe/util/device";
import { LoginRequest, LoginResponse, User } from "library/shared/model/User";
import mainStyles from '../../styles/style.css?inline';
import componentStyles from './styles.css?inline';
import templateHtml from './doc.html?raw';
import { OBSERVABLE_ACCESS_TOKEN, OBSERVABLE_USER } from "../../util/constants";
import { serverRequestUrl } from "../../util/requests";

const template: HTMLTemplateElement = document.createElement('template');
const componentName: string = "si-dashboard";

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
  private t: Translator;
  private s: State;

  private textElements: Record<string, HTMLElement> = {};
  private translations: Record<string, Translations> = {};

  private loginForm: HTMLFormElement | null = null;
  private loginUsername: HTMLInputElement | null = null;
  private loginPassword: HTMLInputElement | null = null;
  private userDataContainer: HTMLElement | null = null;

  constructor() {
    // Note that the DOM cannot be affected within the constructor and instead such manipulations must be deferred to the lifecycle methods.
    super();

    this.#shadow = this.attachShadow({ mode: 'open' });
    // The mode can be set to 'open' if we need the document to be able to access the shadow-dom internals.
    // Access happens through ths `shadowroot` property in the host.

    template.shadowRootDelegatesFocus = true; // focused can be delegated within the component from the outside
    this.#shadow.appendChild(template.content.cloneNode(true));

    this.l = Logger.getInstance();
    this.t = Translator.getInstance();
    this.s = State.getInstance("...");
  }

  static get observedAttributes() { return []; }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
  }
  connectedCallback() {
    if (this.initialised) return;

    Object.keys(this.translations).forEach((t: string) => {
      const el: HTMLElement | null = this.#shadow.getElementById(t);
      if (!el) return;

      this.textElements[t] = el;
    });

    this.loginForm = this.#shadow.querySelector("form#login-form");
    this.loginUsername = this.#shadow.querySelector("input#username");
    this.loginPassword = this.#shadow.querySelector("input#password");
    this.loginForm?.addEventListener("submit", this.signIn.bind(this));

    this.userDataContainer = this.#shadow.querySelector("article#user-data");

    // TODO: watch for changes in the user/accessToken and react accordingly

    this.initialised = true;
  }
  disconnectedCallback() {
  }
  adoptedCallback() {
  }

  async signIn(e: Event) {
    this.l.debug(`---> ${componentName.toUpperCase()}.signIn()`);
    e.preventDefault();
    e.stopImmediatePropagation();

    const username = this.loginUsername?.value;
    const password = this.loginPassword?.value;
    if (!username || !password) return;

    const body: LoginRequest = {
      username,
      password,
      client: 'web',
      deviceLabel: await getDeviceLabel(),
    };

    const url = serverRequestUrl(userLogin);
    const res = await requestPost<LoginResponse>(url, JSON.stringify(body), true);

    this.s.updateObservable(OBSERVABLE_USER, res.user);
    this.s.updateObservable(OBSERVABLE_ACCESS_TOKEN, res.token);
    this.swapContainers(true);
  }

  swapContainers(loggedIn: boolean) {
    if (this.loginForm) this.loginForm.style.display = loggedIn ? "none" : "flex";
    if (this.userDataContainer) this.userDataContainer.style.display = loggedIn ? "flex" : "none";
  }
}

window.customElements.define(componentName, Component);