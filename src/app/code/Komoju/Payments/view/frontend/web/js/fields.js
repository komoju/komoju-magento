var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/generated/env.ts
var env_default = {
  "CDN": "https://multipay.komoju.com",
  "ENV": "development",
  "HONEYBADGER_API_KEY": "",
  "GIT_REV": "99ad2eb29ce6530dedfe3a0ec34aea970dbaa78a"
};

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

// src/komoju-fields-element.ts
registerMessages(i18n_exports);
var KomojuFieldsElement = class extends HTMLElement {
  constructor() {
    super();
    this._submitting = false;
    this.session = null;
    this.broker = new MessageBroker();
    this.dialog = document.createElement("dialog");
    this.listenToMessagesFromIframe(this.broker);
    this.dialog.style.width = "80%";
    this.dialog.style.height = "80%";
    this.dialog.style.padding = "0";
  }
  static get observedAttributes() {
    console.log("KomojuFieldsElement, observedAttributes");
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
  get theme() {
    return this.getAttribute("theme");
  }
  set theme(value) {
    this.setAttribute("theme", value ?? "");
  }
  get komojuApi() {
    return this.getAttribute("komoju-api") ?? "https://komoju.com";
  }
  set komojuApi(value) {
    this.setAttribute("komoju-api", value);
  }
  connectedCallback() {
    const iframeParams = new URLSearchParams();
    iframeParams.append("broker", this.broker.id);
    if (this.hasAttribute("komoju-api")) {
      iframeParams.append("api", this.getAttribute("komoju-api"));
    }
    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");
    iframe.setAttribute("allow", "payment *");
    iframe.title = "KOMOJU secure payment fields";
    iframe.src = `${env_default.CDN}/fields-iframe.html#${iframeParams.toString()}`;
    iframe.style.border = "none";
    iframe.style.width = "100%";
    iframe.style.overflow = "hidden";
    iframe.height = "50";
    iframe.addEventListener("load", () => {
      if (!iframe.contentWindow)
        throw new Error("KOMOJU Fields: iframe had no contentWindow");
      this.broker.setup({
        send: iframe.contentWindow,
        receive: window
      });
    });
    this.replaceChildren(iframe, this.dialog);
    let parent = this.parentElement;
    while (parent && parent.tagName !== "FORM") {
      parent = parent.parentElement;
    }
    if (!parent)
      return;
    const form = parent;
    const target = form.parentElement;
    if (!target)
      return;
    const handler = (event) => {
      if (this._submitting)
        return;
      if (this.offsetParent === null)
        return;
      if (event.target !== form)
        return;
      event.preventDefault();
      event.stopImmediatePropagation();
      this.submit(event);
    };
    target.addEventListener("submit", handler, true);
    this.formSubmitHandler = { form, target, handler };
  }
  disconnectedCallback() {
    if (this.formSubmitHandler) {
      this.formSubmitHandler.target.removeEventListener("submit", this.formSubmitHandler.handler, true);
      this.formSubmitHandler = void 0;
    }
    this.broker.destroy();
  }
  listenToMessagesFromIframe(broker) {
    broker.receive("dispatch-event", (message) => {
      const event = new CustomEvent(message.name, {
        detail: message.detail,
        bubbles: true,
        composed: true,
        cancelable: true
      });
      if (message.name === "komoju-session-change") {
        this.session = message.detail.session;
      }
      const result = {
        type: "dispatch-result",
        cancel: !this.dispatchEvent(event)
      };
      return result;
    });
    broker.receive("resize", (message) => {
      const iframe = this.querySelector("iframe");
      iframe.height = message.height;
    });
    broker.receive("dialog-start", async (message) => {
      const result = {
        type: "dialog-result",
        result: await this.show3DSDialog(message.url)
      };
      return result;
    });
  }
  async attributeChangedCallback(name, _oldValue, newValue) {
    console.log("KomojuFieldsElement, oldValue?", name, _oldValue);
    console.log("###");
    console.log("KomojuFieldsElement, attributeChangedCallback", name, newValue);
    this.broker.send({
      type: "attr",
      attr: name,
      value: newValue
    });
  }
  async submit(event) {
    if (this.token)
      return JSON.parse(this.token);
    const submitResult = await this.broker.send({ type: "submit" });
    if (submitResult?.type !== "submit-result") {
      throw new Error(`Unexpected submit response from komoju-fields iframe ${JSON.stringify(submitResult)}`);
    }
    const result = submitResult;
    if (result.errors) {
      this.dispatchEvent(new CustomEvent("komoju-invalid", {
        detail: { errors: result.errors },
        bubbles: true,
        composed: true
      }));
      return;
    }
    if (result.pay) {
      if (!result.pay.error)
        await this.handlePayResult(result.pay);
      return;
    }
    if (result.token && event && this.formSubmitHandler) {
      const form = this.formSubmitHandler.form;
      const inputName = this.getAttribute("name") ?? "komoju_token";
      let input = document.querySelector(`input[name="${inputName}"]`);
      if (!input) {
        input = document.createElement("input");
        input.type = "hidden";
        input.name = inputName;
        form.append(input);
      }
      input.value = result.token.id;
      this.submitParentForm();
      return;
    }
    if (result.token) {
      this.token = JSON.stringify(result.token);
      return result.token;
    }
    throw new Error("KOMOJU Fields bug: submit result was not handled");
  }
  async handlePayResult(payResult) {
    const session = this.session;
    if (!session)
      throw new Error("handlePayResult called without a session");
    const instructions = payResult.payment?.payment_details?.instructions_url;
    if (instructions) {
      const returnURL = new URL(session.return_url ?? session.session_url);
      returnURL.searchParams.append("session_id", session.id);
      this.showInstructionsDialog(instructions, returnURL.toString());
    } else if (payResult.redirect_url) {
      window.location.href = payResult.redirect_url;
    } else {
      throw new Error(`payResult should have a redirect_url but doesnt ${JSON.stringify(payResult)}`);
    }
  }
  async submitParentForm() {
    if (!this.formSubmitHandler)
      throw new Error("KOMOJU Fields: tried to submit nonexistent parent form");
    const form = this.formSubmitHandler.form;
    try {
      this._submitting = true;
      const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
      if (form.dispatchEvent(submitEvent)) {
        form.submit();
      } else {
        this.broker.send({ type: "end-fade" });
      }
    } finally {
      this._submitting = false;
    }
  }
  showInstructionsDialog(url, finishURL) {
    const dialog = this.dialog;
    const iframe = createIframe(url);
    iframe.style.height = "90%";
    const closeButton = document.createElement("a");
    const closeText = document.createElement("komoju-i18n");
    closeText.key = "close";
    closeButton.append(closeText);
    closeButton.classList.add("komoju-fields-close-dialog");
    closeButton.href = finishURL;
    closeButton.style.display = "block";
    closeButton.style.padding = "10px";
    dialog.replaceChildren(
      closeButton,
      iframe
    );
    dialog.showModal();
  }
  show3DSDialog(url) {
    return new Promise((resolve, reject) => {
      const dialog = this.dialog;
      const origin = env_default["CDN"];
      const iframe = createIframe(url);
      window.addEventListener("message", async (event) => {
        if (event.origin !== origin)
          return;
        try {
          if (!event.data?._komojuFields)
            return;
          const { secureTokenId } = event.data;
          if (!secureTokenId)
            throw new Error("No secureTokenId in message");
          const credentials = {
            komojuApi: this.komojuApi,
            publishableKey: this.getAttribute("publishable-key") ?? ""
          };
          const secureTokenResponse = await komojuFetch(credentials, "GET", `/api/v1/secure_tokens/${secureTokenId}`);
          if (secureTokenResponse.status >= 400) {
            const error = await secureTokenResponse.json();
            resolve({ error });
            return;
          }
          const secureToken = await secureTokenResponse.json();
          dialog.close();
          resolve({ secureToken });
        } catch (e) {
          reject(e);
        }
      });
      dialog.replaceChildren(iframe);
      dialog.showModal();
    });
  }
};
for (const attr of KomojuFieldsElement.observedAttributes) {
  if (attr === "session" || attr === "theme" || attr === "komoju-api")
    continue;
  Object.defineProperty(KomojuFieldsElement.prototype, camelCase(attr), {
    get() {
      return this.getAttribute(attr);
    },
    set(value) {
      if (value === null)
        this.removeAttribute(attr);
      else
        this.setAttribute(attr, value);
    }
  });
}
function camelCase(str) {
  return str.split("-").reduce((a, b) => a + b.charAt(0).toUpperCase() + b.slice(1));
}
function createIframe(url) {
  const iframe = document.createElement("iframe");
  iframe.setAttribute(
    "sandbox",
    "allow-scripts allow-forms allow-same-origin"
  );
  iframe.src = url;
  iframe.style.border = "none";
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  return iframe;
}

// src/picker.html
var picker_default = '<template id="radio-template">\n  <label class="radio">\n    <input type="radio" name="payment-type">\n    <img class="picker-icon">\n    <komoju-i18n></komoju-i18n>\n  </label>\n</template>\n\n<div id="picker">\n</div>\n\n<style>\n  #picker {\n    box-sizing: border-box;\n    display: flex;\n    flex-direction: row;\n    flex-wrap: wrap;\n    gap: 4px;\n    justify-content: space-between;\n  }\n\n  .radio {\n    display: flex;\n    flex-direction: row;\n    width: 100%;\n    gap: 12px;\n  }\n\n  img {\n    width: 42px;\n    background: white;\n    border-radius: 6px;\n    border: 1px solid white;\n  }\n</style>\n';

// src/shared/radio-helpers.ts
function setupRadioParentCheckedClass(input, root) {
  if (!input.parentElement) {
    throw new Error("KOMOJU Fields bug: radio input has no parent");
  }
  if (!input.parentElement.classList.contains("radio")) {
    throw new Error("KOMOJU Fields bug: radio input parent has no .radio class");
  }
  if (input.checked) {
    input.parentElement.classList.add("checked");
  }
  input.addEventListener("change", () => {
    root.querySelectorAll(".radio.checked").forEach((el) => el.classList.remove("checked"));
    input.parentElement.classList.add("checked");
  });
}

// src/generated/supported-payment-types.ts
var supported = /* @__PURE__ */ new Set();
supported.add("bank_transfer");
supported.add("credit_card");
supported.add("konbini");
supported.add("offsite");
var supported_payment_types_default = supported;

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

// src/komoju-picker-element.ts
var KomojuPickerElement = class extends Themable {
  constructor() {
    super();
    this.sessionChangedHandler = null;
    const root = this.attachShadow({ mode: "open" });
    root.innerHTML = picker_default;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://multipay.komoju.com/static/shared.css`;
    root.append(link);
  }
  static get observedAttributes() {
    return ["locale", "theme"];
  }
  get fields() {
    return this.getAttribute("fields");
  }
  set fields(value) {
    this.setAttribute("fields", value ?? "");
  }
  get locale() {
    return this.getAttribute("locale");
  }
  set locale(value) {
    this.setAttribute("locale", value ?? "");
  }
  async connectedCallback() {
    const fields = this.komojuFieldsElement();
    let handler = {
      element: fields,
      handler: (_evt) => {
        this.render(fields);
      }
    };
    await this.setupPaymentTypesI18n();
    this.render(fields);
    fields.addEventListener("komoju-session-change", handler.handler);
    this.sessionChangedHandler = handler;
  }
  disconnectedCallback() {
    if (this.sessionChangedHandler) {
      this.sessionChangedHandler.element.removeEventListener(
        "komoju-session-change",
        this.sessionChangedHandler.handler
      );
    }
  }
  async attributeChangedCallback(name, oldValue, newValue) {
    if (!this.shadowRoot)
      return;
    if (name === "locale" && newValue && oldValue !== newValue) {
      broadcastLocaleChange(this.shadowRoot, newValue);
      this.updatePickerLocale(newValue);
    } else if (name === "theme") {
      this.applyTheme();
    }
  }
  komojuFieldsElement() {
    if (this.fields) {
      return document.querySelector(`#${this.fields}`);
    } else {
      return document.querySelector("komoju-fields");
    }
  }
  render(fields) {
    if (!fields.session)
      return;
    if (!this.shadowRoot)
      return;
    const picker = this.shadowRoot.getElementById("picker");
    const template = this.shadowRoot.getElementById("radio-template");
    if (!picker)
      throw new Error("KOMOJU Fields bug: <komoju-picker> wrong shadow DOM (no picker)");
    if (!template)
      throw new Error("KOMOJU Fields bug: <komoju-picker> wrong shadow DOM (no template)");
    if (!this.locale) {
      this.locale = fields.session.default_locale.substring(0, 2);
    }
    ;
    this.updatePickerLocale(this.locale);
    picker.replaceChildren();
    let i = 0;
    for (const paymentMethod of fields.session.payment_methods) {
      const moduleName = paymentMethod.offsite ? "offsite" : paymentMethod.type;
      if (fields.hasAttribute("token") && !supported_payment_types_default.has(moduleName)) {
        continue;
      }
      const radio = template.content.cloneNode(true);
      const input = radio.querySelector("input");
      const icon = radio.querySelector("img");
      const text = radio.querySelector("komoju-i18n");
      if (i === 0 || fields.paymentType === paymentMethod.type) {
        input.checked = true;
      }
      input.addEventListener("change", () => {
        fields.paymentType = paymentMethod.type;
      });
      setupRadioParentCheckedClass(input, this.shadowRoot);
      icon.src = `${fields.komojuApi}/payment_methods/${paymentMethod.type}.svg`;
      text.key = paymentMethod.type;
      picker.append(radio);
      i += 1;
    }
    if (!this.theme && fields.theme) {
      this.theme = fields.theme;
      this.applyTheme();
    }
  }
  async setupPaymentTypesI18n() {
    const fields = this.komojuFieldsElement();
    const response = await komojuFetch(fields, "GET", "/api/v1/payment_methods");
    this.komojuPaymentMethods = await response.json();
    for (const method of this.komojuPaymentMethods) {
      const i18n = {
        en: { [method.type_slug]: method.name_en },
        ja: { [method.type_slug]: method.name_ja },
        ko: { [method.type_slug]: method.name_ko }
      };
      registerMessages(i18n);
    }
  }
  updatePickerLocale(locale) {
    if (!this.shadowRoot)
      return;
    const picker = this.shadowRoot.getElementById("picker");
    if (picker) {
      picker.setAttribute("locale", locale);
    }
    ;
  }
};

// src/index.ts
window.customElements.define("komoju-fields", KomojuFieldsElement);
window.customElements.define("komoju-picker", KomojuPickerElement);
window.customElements.define("komoju-i18n", KomojuI18nElement);
window.komojuReportError = (error, context) => {
  console.error(error, context);
};
if (window.komojuErrorReporting !== false) {
  (async () => {
    const moduleName = "error-reporting";
    const module = await import(`https://multipay.komoju.com/extras/${moduleName}/module.js`);
    window.komojuReportError = module.reportError;
  })();
  const onerror = (event) => {
    const komojuFieldsFiles = [
      /\/fields\.js:\d+:\d+\n/,
      /\/fields\/[\w-]+\/module\.js\n:\d+:\d+/,
      /\/extras\/[\w-]+\/module\.js\n:\d+:\d+/
    ];
    const error = event instanceof ErrorEvent ? event.error : event.reason;
    if (!(error instanceof Error))
      return;
    if (!error.stack)
      return;
    if (!komojuFieldsFiles.find((regex) => regex.test(error.stack)))
      return;
    window.komojuReportError(error);
  };
  window.addEventListener("error", onerror);
  window.addEventListener("unhandledrejection", onerror);
}
//# sourceMappingURL=fields.js.map
