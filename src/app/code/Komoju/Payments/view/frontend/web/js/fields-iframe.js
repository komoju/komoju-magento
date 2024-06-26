var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/shared/spinner.html
var spinner_default = "<style>\n.komoju-spinner {\n  width: 20px;\n  height: 20px;\n  margin: 0;\n  padding: 15px;\n  list-style: none;\n}\n\n.komoju-spinner li {\n  width: 0.2em;\n  height: 0.2em;\n  border-radius: 50%;\n}\n\n.komoju-spinner li:nth-child(1) {\n  transform-origin: 50% 125%;\n  animation: komoju-spin 1.4s linear infinite;\n\n  width: 5px;\n  height: 5px;\n  background: lightgrey;\n  margin-left: -0.1em; /* Width/2 */\n}\n.komoju-spinner li:nth-child(2) {\n  transform-origin: -25% 50%;\n  animation: komoju-spin 1s linear infinite;\n\n  width: 7.5px;\n  height: 7.5px;\n  background: lightgrey;\n  margin-top: -0.1em; /* Height/2 */\n}\n.komoju-spinner li:nth-child(3) {\n  transform-origin: 50% -25%;\n  animation: komoju-spin 1.2s linear infinite;\n\n  width: 10px;\n  height: 10px;\n  background: lightgrey;\n  margin-left: -0.1em; /* Width/2 */\n}\n\n@keyframes komoju-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n</style>\n\n<ul class='komoju-spinner'>\n  <li></li>\n  <li></li>\n  <li></li>\n</ul>\n";

// src/shared/validation.ts
function runValidation(input) {
  input.dispatchEvent(new CustomEvent("validate"));
  const errorMessage = input.parentElement?.querySelector("komoju-error:not(.removing)")?.textContent;
  return errorMessage ?? null;
}

// src/shared/komoju-i18n-element.ts
var defaultLanguage = "en";
function broadcastLocaleChange(root, locale) {
  root.querySelectorAll("komoju-i18n").forEach((element) => {
    const i18n = element;
    i18n.render(locale);
  });
}
var KomojuI18nElement = class extends HTMLElement {
  static get observedAttributes() {
    return ["key"];
  }
  get key() {
    return this.getAttribute("key");
  }
  set key(value) {
    this.setAttribute("key", value ?? "");
  }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback(name, _oldValue, _newValue) {
    if (name === "key")
      this.render();
  }
  findLocale() {
    let parent = this.parentElement;
    while (parent && !parent.getAttribute("locale")) {
      parent = parent.parentElement;
    }
    return parent?.getAttribute("locale") ?? defaultLanguage;
  }
  render(locale) {
    if (!this.key)
      return;
    if (!locale)
      locale = this.findLocale();
    if (!Object.keys(window.komojuTranslations).includes(locale))
      locale = defaultLanguage;
    const lang = locale.substring(0, 2);
    const message = window.komojuTranslations[lang][this.key];
    if (!message) {
      console.error(`KOMOJU bug: missing translation for key: ${this.key}`);
      return;
    }
    const matches = message.match(/%\{[\w-]+\}/g);
    if (matches) {
      let result = message;
      matches.forEach((match) => {
        const key = match.replace(/%{|}/g, "");
        const value = this.dataset[key];
        if (value)
          result = result.replace(match, value);
      });
      this.textContent = result;
      return;
    }
    this.textContent = message;
  }
};

// src/shared/money.ts
var noDecimalCurrencies = [
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "JPY",
  "KMF",
  "KRW",
  "MGA",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF"
];
var nonISOCurrencies = [
  "USDC"
];
var displayCurrencyCodeInsteadOfSymbol = [
  "CNY"
];
function formatMoney(amountCents, currency, locale = "en") {
  function nonISOFormat(currency2, amountCents2) {
    if (!amountCents2) {
      return "";
    } else if (nonISOCurrencies.includes(currency2) || !currency2) {
      return `${amountCents2.toLocaleString()} ${currency2}`;
    } else {
      throw "invalid currency format";
    }
  }
  const amountDecimal = decentify(amountCents, currency);
  if (nonISOCurrencies.includes(currency) || !currency) {
    return nonISOFormat(currency, amountDecimal);
  } else {
    const numberFormat = new Intl.NumberFormat(`${locale}-JP`, {
      style: "currency",
      currency,
      currencyDisplay: displayCurrencyCodeInsteadOfSymbol.includes(currency) ? "code" : "symbol"
    });
    return numberFormat.format(amountDecimal);
  }
}
function decentify(amountCents, currency) {
  return noDecimalCurrencies.includes(currency) ? amountCents : amountCents / 100;
}

// src/shared/komoju-api.ts
function komojuFetch(config, method, path, body) {
  if (!config.komojuApi)
    throw new Error("KOMOJU API URL is null");
  if (!config.publishableKey)
    throw new Error("KOMOJU publishable-key not set");
  return fetch(`${config.komojuApi}${path}`, {
    method,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Basic ${btoa(`${config.publishableKey}:`)}`,
      "komoju-via": "fields"
    },
    body: body ? JSON.stringify(body) : void 0
  });
}

// src/shared/themable.ts
var Themable = class extends HTMLElement {
  get theme() {
    return this.getAttribute("theme");
  }
  set theme(value) {
    this.setAttribute("theme", value ?? "");
  }
  applyTheme() {
    const root = this.shadowRoot ?? document;
    if (this.theme === null) {
      root.querySelectorAll("#theme,#inline-theme").forEach((el) => el.remove());
    } else if (this.theme.startsWith("http") || this.theme.startsWith("/") || this.theme.startsWith("data:")) {
      this.applyExternalTheme(root, this.theme);
    } else {
      this.applyInlineTheme(root, this.theme);
    }
  }
  applyInlineTheme(root, theme) {
    root.querySelectorAll("#theme,#inline-theme").forEach((el) => el.remove());
    const style = document.createElement("style");
    style.id = "inline-theme";
    style.textContent = theme;
    this.appendStyleTag(style);
  }
  applyExternalTheme(root, theme) {
    root.querySelectorAll("#inline-theme").forEach((el) => el.remove());
    let link = root.querySelector("#theme");
    if (link) {
      if (link.href !== this.theme)
        link.href = theme;
    } else {
      link = document.createElement("link");
      link.id = "theme";
      link.rel = "stylesheet";
      link.href = theme;
      this.appendStyleTag(link);
    }
  }
  appendStyleTag(style) {
    if (this.shadowRoot) {
      this.shadowRoot.append(style);
    } else {
      document.head.append(style);
    }
  }
};

// src/generated/env.ts
var env_default = {
  "CDN": "https://multipay.komoju.com",
  "ENV": "development",
  "HONEYBADGER_API_KEY": "",
  "GIT_REV": "99ad2eb29ce6530dedfe3a0ec34aea970dbaa78a"
};

// src/generated/supported-payment-types.ts
var supported = /* @__PURE__ */ new Set();
supported.add("bank_transfer");
supported.add("credit_card");
supported.add("konbini");
supported.add("offsite");
var supported_payment_types_default = supported;

// src/shared/translations.ts
function registerMessages(messages) {
  if (!window.komojuTranslations) {
    window.komojuTranslations = { "en": {}, "ja": {} };
  }
  for (const lang of Object.keys(window.komojuTranslations)) {
    window.komojuTranslations[lang] = {
      ...window.komojuTranslations[lang],
      ...messages[lang]
    };
  }
}

// src/i18n.ts
var i18n_exports = {};
__export(i18n_exports, {
  en: () => en,
  ja: () => ja
});
var en = {
  "customer-fee-will-be-charged": "A fee of %{fee} will be included.",
  "dynamic-currency-notice": "Payment will be made in %{currency}: %{original} \u2192 %{converted}.",
  "dynamic-currency-notice-with-fee": "Payment will be made in %{currency}: %{original} \u2192 %{converted}. (total: %{total})",
  "payment-method-unavailable": "This payment method is currently unavailable.",
  "verification-failed": "Verification failed.",
  "close": "Close"
};
var ja = {
  "customer-fee-will-be-charged": "%{fee}\u306E\u624B\u6570\u6599\u304C\u8FFD\u52A0\u3055\u308C\u307E\u3059\u3002",
  "dynamic-currency-notice": "\u652F\u6255\u3044\u306F%{currency}\u3067\u6C7A\u6E08\u3055\u308C\u307E\u3059: %{original} \u2192 %{converted}\u3002",
  "dynamic-currency-notice-with-fee": "\u652F\u6255\u3044\u306F%{currency}\u3067\u6C7A\u6E08\u3055\u308C\u307E\u3059: %{original} \u2192 %{converted}\u3002(\u5408\u8A08%{total})",
  "payment-method-unavailable": "\u3053\u306E\u652F\u6255\u3044\u65B9\u6CD5\u306F\u73FE\u5728\u3054\u5229\u7528\u3044\u305F\u3060\u3051\u307E\u305B\u3093\u3002",
  "verification-failed": "\u8A8D\u8A3C\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002",
  "close": "\u9589\u3058\u308B"
};

// src/shared/message-broker.ts
var MessageBroker = class {
  constructor(id) {
    this._sendWindow = new Promise((resolve) => this._setSendWindow = resolve);
    this._receiveWindow = new Promise((resolve) => this._setReceiveWindow = resolve);
    this.messageHandler = (event) => {
      if (this.origin !== "*" && event.origin !== this.origin)
        return;
      this.handleMessage(event);
    };
    this.id = id ?? crypto.randomUUID();
    this.origin = "*";
    this.promises = /* @__PURE__ */ new Map();
    this.listeners = /* @__PURE__ */ new Map();
  }
  setup(arg) {
    if (this._setSendWindow) {
      this._setSendWindow(arg.send);
      this._setSendWindow = void 0;
    } else {
      this._sendWindow = Promise.resolve(arg.send);
    }
    if (this._setReceiveWindow) {
      this._setReceiveWindow(arg.receive);
      this._setReceiveWindow = void 0;
    } else {
      this._receiveWindow = Promise.resolve(arg.receive);
    }
    arg.receive.addEventListener("message", this.messageHandler);
  }
  send(message) {
    const fullMessage = {
      ...message,
      brokerId: this.id,
      id: crypto.randomUUID()
    };
    let resolve = null;
    const promise = new Promise((resolvePromise, _reject) => {
      resolve = resolvePromise;
    });
    if (!resolve)
      throw new Error("Broker is busted");
    this.promises.set(fullMessage.id, { promise, resolve });
    return this._sendWindow.then((w) => w.postMessage(fullMessage, this.origin)).then(() => promise);
  }
  receive(type, listener) {
    this.listeners.set(type, listener);
  }
  async handleMessage(event) {
    const message = event.data;
    if (message.brokerId !== this.id)
      return;
    if (message.type === "ack") {
      const ack = message;
      const promise = this.promises.get(ack.id);
      if (!promise)
        return;
      promise.resolve(ack.response);
      this.promises.delete(ack.id);
    } else {
      const listener = this.listeners.get(message.type);
      const ack = { type: "ack", brokerId: this.id, id: message.id };
      if (listener)
        ack.response = await listener(message) ?? void 0;
      await this._sendWindow.then((w) => w.postMessage(ack, this.origin));
    }
  }
  destroy() {
    return this._receiveWindow.then((w) => w.removeEventListener("message", this.messageHandler));
  }
};

// src/komoju-host-element.ts
registerMessages(i18n_exports);
var _baseKomojuAPI;
function baseKomojuAPI() {
  if (_baseKomojuAPI)
    return _baseKomojuAPI;
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.hash.slice(1));
  _baseKomojuAPI = params.get("api") ?? "https://komoju.com";
  return _baseKomojuAPI;
}
function brokerId() {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.hash.slice(1));
  return params.get("broker") ?? void 0;
}
function i18nMessage(locale, key) {
  if (locale === "ja")
    return ja[key];
  return en[key];
}
var KomojuHostElement = class extends Themable {
  constructor() {
    super(...arguments);
    this._session = null;
    this.module = null;
    this.broker = new MessageBroker(brokerId());
    this._renderCount = 0;
    this.komojuFetch = komojuFetch.bind(this, this);
  }
  static get observedAttributes() {
    console.log("KomojuHostElement::listenToMessagesFromMainWindow");
    return [
      "komoju-api",
      "session",
      "session-id",
      "publishable-key",
      "payment-type",
      "locale",
      "theme",
      "token",
      "name"
    ];
  }
  get session() {
    return this._session;
  }
  set session(value) {
    console.log("KomojuHostElement set session", value);
    this._session = value;
    this.broker.send({
      type: "dispatch-event",
      name: "komoju-session-change",
      detail: { session: this._session }
    });
  }
  get komojuApi() {
    const attribute = this.getAttribute("komoju-api");
    if (!attribute || attribute === "")
      return baseKomojuAPI();
    else
      return attribute;
  }
  set komojuApi(value) {
    this.setAttribute("komoju-api", value ?? "");
  }
  get sessionId() {
    return this.getAttribute("session-id");
  }
  set sessionId(value) {
    this.setAttribute("session-id", value ?? "");
  }
  get publishableKey() {
    return this.getAttribute("publishable-key");
  }
  set publishableKey(value) {
    this.setAttribute("publishable-key", value ?? "");
  }
  get paymentType() {
    return this.getAttribute("payment-type");
  }
  set paymentType(value) {
    this.setAttribute("payment-type", value ?? "");
  }
  get locale() {
    return this.getAttribute("locale");
  }
  set locale(value) {
    this.setAttribute("locale", value ?? "");
    this.broker.send({
      type: "dispatch-event",
      name: "komoju-locale-change",
      detail: { locale: value }
    });
  }
  get token() {
    return this.hasAttribute("token");
  }
  set token(value) {
    if (value)
      this.setAttribute("token", "");
    else
      this.removeAttribute("token");
  }
  get name() {
    return this.getAttribute("name");
  }
  set name(value) {
    if (value)
      this.setAttribute("name", value);
    else
      this.removeAttribute("name");
  }
  get komojuCdn() {
    return env_default["CDN"];
  }
  get paymentMethod() {
    return this.session?.payment_methods.find((method) => method.type === this.paymentType);
  }
  async attributeChangedCallback(name, oldValue, newValue) {
    console.log("??? KomojuHostElement attributeChangedCallback", name, oldValue);
    console.log("###");
    console.log("NEW VALUE::KomojuHostElement attributeChangedCallback", name, newValue);
    if (name === "session") {
      if (!newValue || newValue == "")
        return;
      this.session = JSON.parse(newValue);
      if (!this.locale)
        this.locale = this.session.default_locale.substring(0, 2);
      if (!this.paymentType)
        this.paymentType = this.session.payment_methods[0].type;
      this.render();
    } else if (name === "session-id" || name === "publishable-key") {
      if (!newValue || newValue == "")
        return;
      if (!this.publishableKey)
        return;
      if (!this.sessionId)
        return;
      const response = await this.komojuFetch("GET", `/api/v1/sessions/${this.sessionId}`);
      if (response.status === 404) {
        console.error("Invalid KOMOJU session ID", this.sessionId);
        return;
      }
      if (response.status !== 200) {
        console.error("Failed to retrieve KOMOJU session", response);
        return;
      }
      this.session = await response.json();
      if (!this.session)
        throw new Error("KOMOJU returned a null session");
      if (!this.paymentType)
        this.paymentType = this.session.payment_methods[0].type;
      if (!this.locale)
        this.locale = this.session.default_locale.substring(0, 2);
      this.render();
    } else if (name === "payment-type") {
      if (!newValue || newValue == "")
        return;
      if (!this.session)
        return;
      if (!this.publishableKey)
        return;
      this.startFade();
      await this.render();
    } else if (name === "locale") {
      if (!newValue || newValue == "" || oldValue === newValue)
        return;
      broadcastLocaleChange(this, newValue);
    } else if (name === "theme") {
      this.applyTheme();
    }
  }
  connectedCallback() {
    console.log("KomojuHostElement connectedCallback");
    this.innerHTML = spinner_default;
    console.log(`${JSON.stringify(this.broker)}, broker`);
    this.listenToMessagesFromMainWindow(this.broker);
    this.broker.setup({
      send: window.parent,
      receive: window
    });
    const body = this.ownerDocument?.body;
    this.resizeObserver = new ResizeObserver(() => {
      const height = body.parentElement.offsetHeight;
      if (height === 0)
        return;
      this.broker.send({ type: "resize", height: height.toString() });
    });
    if (body)
      this.resizeObserver.observe(body, { box: "border-box" });
  }
  disconnectedCallback() {
    this.broker.destroy();
    this.resizeObserver?.disconnect();
    this.resizeObserver = void 0;
  }
  listenToMessagesFromMainWindow(broker) {
    console.log("KomojuHostElement listenToMessagesFromMainWindow");
    broker.receive("attr", (message) => {
      if (!KomojuHostElement.observedAttributes.includes(message.attr))
        return;
      console.log("KomojuHostElement listenToMessagesFromMainWindow attr", message);
      if (message.value === null || message.value === void 0)
        this.removeAttribute(message.attr);
      else
        this.setAttribute(message.attr, message.value);
    });
    broker.receive("submit", () => {
      return this.submit();
    });
    broker.receive("end-fade", () => {
      this.endFade();
    });
  }
  async submit() {
    if (!this.module || !this.session) {
      return { type: "submit-result", errors: ["Attempted to submit before selecting KOMOJU Payment method"] };
    }
    const paymentMethod = this.paymentMethod;
    if (!paymentMethod)
      throw new Error(`KOMOJU Payment method not found: ${this.paymentType}`);
    this.querySelectorAll("komoju-error").forEach((error) => error.remove());
    const validatedFields = this.querySelectorAll(".has-validation");
    const errors = Array.prototype.map.call(
      validatedFields,
      (field) => field instanceof HTMLInputElement ? runValidation(field) : null
    );
    if (errors.some((error) => error != null)) {
      return { type: "submit-result", errors: errors.filter((error) => error != null) };
    }
    this.startFade();
    const paymentDetails = this.module.paymentDetails(this, paymentMethod);
    if (this.token) {
      return await this.submitToken(paymentDetails);
    } else {
      return await this.submitPayment(paymentDetails);
    }
  }
  async submitPayment(paymentDetails) {
    const paymentMethod = this.paymentMethod;
    if (!paymentMethod) {
      throw new Error("Attempted to submit before selecting KOMOJU Payment method");
    }
    const session = this.session;
    let moduleName = paymentMethod.offsite ? "offsite" : paymentMethod.type;
    if (!supported_payment_types_default.has(moduleName)) {
      const result2 = {
        type: "submit-result",
        pay: {
          status: "pending",
          redirect_url: `${session.session_url}#${paymentMethod.type}`
        }
      };
      return result2;
    }
    let secureTokenId = null;
    if (paymentMethod.type === "credit_card" && session.mode !== "customer")
      try {
        const { secureToken, error, skip } = await this.do3DS(paymentDetails);
        if (secureToken) {
          secureTokenId = secureToken.id;
        } else if (error && !skip) {
          return {
            type: "submit-result",
            errors: [error]
          };
        }
      } catch (e) {
        console.error("Error during secure token flow. Continuing without.", e);
      }
    const payResponse = await this.komojuFetch("POST", `/api/v1/sessions/${session.id}/pay`, {
      payment_details: secureTokenId ?? paymentDetails,
      api_locale: this.locale
    });
    const payResult = await payResponse.json();
    const result = {
      type: "submit-result",
      pay: payResult
    };
    if (payResult.error) {
      console.error(payResult);
      this.handleApiError(payResult.error);
      this.endFade();
    }
    return result;
  }
  async do3DS(paymentDetails) {
    const { secureToken, error } = await this.submitSecureToken(paymentDetails);
    if (error && error.code === "unsupported_card_brand") {
      return {
        error,
        skip: true
      };
    }
    if (error)
      return { error };
    else if (!secureToken)
      throw new Error("Secure token empty response");
    const status = secureToken.verification_status;
    if (status === "OK" || status === "SKIPPED") {
      return { secureToken };
    }
    if (status === "ERRORED") {
      return {
        skip: true
      };
    }
    const dialogResult = await this.broker.send({
      type: "dialog-start",
      url: secureToken.authentication_url
    });
    if (dialogResult?.type !== "dialog-result") {
      throw new Error("Expected dialog-result, got " + JSON.stringify(dialogResult));
    } else {
      const { result } = dialogResult;
      if (result.error && result.error.code === "unsupported_card_brand") {
        return {
          error: result.error,
          skip: true
        };
      }
      if (result.error) {
        this.handleApiError(result.error);
        this.endFade();
        return result;
      }
      if (result.secureToken && result.secureToken.verification_status === "ERRORED") {
        const error2 = i18nMessage(this.locale, "verification-failed") ?? "3DS error";
        this.handleApiError(error2);
        this.endFade();
        return {
          error: {
            code: "verification_status_errored",
            message: error2,
            param: null,
            details: null
          }
        };
      }
      return result;
    }
  }
  async submitSecureToken(paymentDetails) {
    const session = this.session;
    const returnURL = new URL(this.komojuCdn);
    returnURL.pathname = "/secure-token-return.html";
    returnURL.searchParams.set("session_id", session.id);
    const secureTokenResponse = await this.komojuFetch("POST", `/api/v1/secure_tokens`, {
      amount: session.amount,
      currency: session.currency,
      payment_details: paymentDetails,
      return_url: returnURL
    });
    if (secureTokenResponse.status >= 400) {
      const error = (await secureTokenResponse.json()).error;
      return { error };
    }
    const secureToken = await secureTokenResponse.json();
    return { secureToken };
  }
  async handleApiError(error) {
    if (!this.broker)
      throw new Error("KOMOJU Fields bug: broker should be set by now");
    const result = await this.broker.send({
      type: "dispatch-event",
      name: "komoju-error",
      detail: { error }
    });
    if (!result || result.type !== "dispatch-result") {
      throw new Error("Expected dispatch-result, got " + JSON.stringify(result));
    }
    if (result.cancel)
      return;
    this.querySelectorAll(".generic-error-message").forEach((container) => {
      const errorText = document.createElement("komoju-error");
      if (typeof error === "string") {
        errorText.textContent = error;
      } else if (error.message) {
        errorText.textContent = error.message;
      }
      container.append(errorText);
    });
  }
  async submitToken(paymentDetails) {
    if (paymentDetails.type === "credit_card") {
      const { secureToken, error, skip } = await this.do3DS(paymentDetails);
      if (error && !skip) {
        return { type: "submit-result", errors: [error] };
      } else if (secureToken) {
        return {
          type: "submit-result",
          token: secureToken
        };
      }
    }
    const tokenResponse = await this.komojuFetch("POST", `/api/v1/tokens`, {
      payment_details: paymentDetails
    });
    if (tokenResponse.status >= 400) {
      const error = (await tokenResponse.json()).error;
      this.handleApiError(error);
      this.endFade();
      return { type: "submit-result", errors: [error.message] };
    }
    const token = await tokenResponse.json();
    return {
      type: "submit-result",
      token
    };
  }
  async render() {
    if (!this.session)
      throw new Error("KOMOJU Session not loaded");
    const paymentMethod = this.session.payment_methods.find((method) => method.type === this.paymentType);
    const thisRender = ++this._renderCount;
    if (!paymentMethod) {
      const errorElement = document.createElement("komoju-error");
      const errorMessage = document.createElement("komoju-i18n");
      errorMessage.key = "payment-method-unavailable";
      errorElement.append(errorMessage);
      this.replaceChildren(errorElement);
      this.applyTheme();
      return;
    }
    let moduleName = paymentMethod.type;
    if (!supported_payment_types_default.has(moduleName)) {
      moduleName = "offsite";
    }
    const module = await import(`${this.komojuCdn}/fields/${moduleName}/module.js`);
    if (thisRender !== this._renderCount)
      return;
    this.module = module;
    if (!this.module)
      throw new Error(`KOMOJU Payment module not found: ${this.paymentType}`);
    this.module.render(this, paymentMethod);
    this.querySelectorAll("input").forEach((input) => {
      input.addEventListener("compositionstart", () => {
        input.dataset.ime = "active";
      });
      input.addEventListener("compositionend", () => {
        input.dataset.ime = "inactive";
      });
    });
    this.applyTheme();
    const priceInfo = this.querySelector(".price-info");
    if (!priceInfo)
      return;
    if (paymentMethod.customer_fee) {
      const listItem = document.createElement("li");
      const feeMessage = document.createElement("komoju-i18n");
      listItem.classList.add("customer-fee");
      feeMessage.key = "customer-fee-will-be-charged";
      feeMessage.dataset["fee"] = formatMoney(
        paymentMethod.customer_fee,
        paymentMethod.currency ?? this.session.currency
      );
      listItem.append(feeMessage);
      priceInfo.append(listItem);
    }
    if (paymentMethod.exchange_rate && paymentMethod.amount && paymentMethod.currency && paymentMethod.currency !== this.session.currency) {
      const listItem = document.createElement("li");
      const dccMessage = document.createElement("komoju-i18n");
      const rate = Math.round(paymentMethod.exchange_rate * 1e4) / 1e4;
      dccMessage.key = "dynamic-currency-notice";
      dccMessage.dataset["currency"] = paymentMethod.currency;
      dccMessage.dataset["original"] = formatMoney(this.session.amount, this.session.currency);
      dccMessage.dataset["converted"] = formatMoney(paymentMethod.amount, paymentMethod.currency);
      if (paymentMethod.customer_fee) {
        dccMessage.key = "dynamic-currency-notice-with-fee";
        dccMessage.dataset["total"] = formatMoney(
          paymentMethod.amount + paymentMethod.customer_fee,
          paymentMethod.currency
        );
      }
      listItem.title = `1 ${this.session.currency} = ${rate} ${paymentMethod.currency}`;
      listItem.classList.add("dynamic-currency");
      listItem.append(dccMessage);
      priceInfo.append(listItem);
    }
  }
  startFade() {
    const fade = document.createElement("komoju-fade");
    setTimeout(() => fade.classList.add("show"), 0);
    this.querySelector(".fields")?.prepend(fade);
  }
  endFade() {
    this.querySelectorAll("komoju-fade").forEach((el) => {
      const fade = el;
      fade.classList.remove("show");
      setTimeout(() => fade.remove(), 500);
    });
  }
};

// src/shared/komoju-error-element.ts
var KomojuErrorElement = class extends HTMLElement {
  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    const container = document.createElement("div");
    this.container = container;
    container.style.height = "0";
    container.style.transition = "height 0.2s ease-in-out";
    const slot = document.createElement("slot");
    container.append(slot);
    root.append(container);
  }
  connectedCallback() {
    this.container.style.height = this.container.scrollHeight + "px";
    const resizeObserver = new ResizeObserver((_) => {
      this.container.style.height = this.container.scrollHeight + "px";
    });
    resizeObserver.observe(this.container);
  }
  remove() {
    this.classList.add("removing");
    this.container.style.height = "0";
    window.setTimeout(() => {
      super.remove();
    }, 200);
  }
};

// src/shared/komoju-fade-element.ts
var KomojuFadeElement = class extends HTMLElement {
  connectedCallback() {
    const fields = this.parentElement;
    if (!fields)
      return;
    this.resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      this.style.width = `${width}px`;
      this.style.height = `${height}px`;
    });
    this.resizeObserver?.observe(fields);
  }
  disconnectedCallback() {
    this.resizeObserver?.disconnect();
    this.resizeObserver = void 0;
  }
};

// src/fields-iframe.ts
window.customElements.define("komoju-host", KomojuHostElement);
window.customElements.define("komoju-error", KomojuErrorElement);
window.customElements.define("komoju-i18n", KomojuI18nElement);
window.customElements.define("komoju-fade", KomojuFadeElement);
(async () => {
  const moduleName = "error-reporting";
  const module = await import(`${env_default.CDN}/extras/${moduleName}/module.js`);
  const onerror = (event) => {
    const error = event instanceof ErrorEvent ? event.error : event.reason;
    if (!(error instanceof Error))
      return;
    module.reportError(error);
  };
  window.addEventListener("error", onerror);
  window.addEventListener("unhandledrejection", onerror);
})();
//# sourceMappingURL=fields-iframe.js.map
