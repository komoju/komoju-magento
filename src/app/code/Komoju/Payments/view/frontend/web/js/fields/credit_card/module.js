var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/fields/credit_card/komoju-field-icon.html
var komoju_field_icon_default = '<div id="komoju-field-icon">\n</div>\n\n<style>\n  #komoju-field-icon {\n    position: absolute;\n    box-sizing: border-box;\n\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    justify-content: flex-end;\n  }\n\n  img {\n    position: absolute;\n\n    opacity: 0;\n    border-radius: 6px;\n\n    transition: opacity 0.4s ease-out, margin-right 0.3s ease-out;\n  }\n</style>\n';

// src/fields/credit_card/komoju-field-icon-element.ts
var _KomojuFieldIconElement = class extends HTMLElement {
  constructor() {
    super();
    this.visibleIcons = [];
    const root = this.attachShadow({ mode: "open" });
    root.innerHTML = komoju_field_icon_default;
  }
  static get observedAttributes() {
    return ["icon", "for"];
  }
  get target() {
    const targetId = this.getAttribute("for");
    const root = this.getRootNode();
    if (!targetId || !root || !root["querySelector"])
      return void 0;
    else
      return root.querySelector(`#${targetId}`);
  }
  set target(target) {
    if (target)
      this.setAttribute("for", target.id);
    else
      this.setAttribute("for", "");
  }
  get icon() {
    return this.getAttribute("icon") || "";
  }
  set icon(value) {
    this.setAttribute("icon", value);
  }
  connectedCallback() {
    this.style.width = "0";
    this.style.height = "0";
    const parent = this.parentElement;
    if (!parent)
      return;
    this.resizeObserver = new ResizeObserver(() => {
      this.reposition();
    });
    this.resizeObserver.observe(parent);
    this.reposition();
    setTimeout(() => this.reposition(), 100);
  }
  disconnectedCallback() {
    this.resizeObserver?.disconnect();
    this.resizeObserver = void 0;
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "icon") {
      const container = this.shadowRoot?.getElementById("komoju-field-icon");
      if (!container)
        throw new Error("KOMOJU Fields bug: field icon container missing");
      if (oldValue === newValue)
        return;
      const icons = newValue.split(/\s+/);
      this.updateVisibleIcons(icons);
    } else if (name === "for") {
      this.reposition();
    }
  }
  updateVisibleIcons(icons) {
    const container = this.shadowRoot?.getElementById("komoju-field-icon");
    const target = this.target;
    if (!target || !container)
      return;
    const iconsWidth = icons.length * (_KomojuFieldIconElement.ICON_WIDTH + _KomojuFieldIconElement.ICON_GAP);
    const maxWidth = target.offsetWidth / 2;
    if (iconsWidth > maxWidth) {
      const hiddenIconIndex = Math.floor(maxWidth / (_KomojuFieldIconElement.ICON_WIDTH + _KomojuFieldIconElement.ICON_GAP));
      const allIcons = icons;
      icons = icons.slice(0, hiddenIconIndex);
      if (this.iconSwapTimeout)
        clearTimeout(this.iconSwapTimeout);
      this.iconSwapTimeout = setTimeout(() => {
        let carry = allIcons[hiddenIconIndex - 1];
        for (let i = hiddenIconIndex - 1; i < allIcons.length - 1; i += 1) {
          const temp = allIcons[i + 1];
          allIcons[i + 1] = carry;
          carry = temp;
        }
        allIcons[hiddenIconIndex - 1] = carry;
        this.updateVisibleIcons(allIcons);
      }, _KomojuFieldIconElement.ICON_SWAP_INTERVAL);
    } else if (this.iconSwapTimeout) {
      clearTimeout(this.iconSwapTimeout);
      this.iconSwapTimeout = void 0;
    }
    const oldIcons = this.visibleIcons;
    const newIcons = icons;
    if (oldIcons === newIcons)
      return;
    const removedIcons = oldIcons.filter((icon) => !newIcons.includes(icon));
    this.visibleIcons = icons;
    for (const icon of newIcons) {
      const existing = container.querySelector(`img[src="${icon}"]`);
      if (existing) {
        existing.style.opacity = "1";
        continue;
      }
      const img = document.createElement("img");
      img.src = icon;
      img.width = _KomojuFieldIconElement.ICON_WIDTH;
      container.append(img);
      img.style.opacity = "0";
      setTimeout(() => img.style.opacity = "1", 100);
    }
    for (const icon of removedIcons) {
      const img = container.querySelector(`img[src="${icon}"]`);
      img.style.opacity = "0";
      img.style.marginRight = "0";
    }
    let position = 0;
    for (let i = this.visibleIcons.length - 1; i >= 0; i -= 1) {
      const icon = this.visibleIcons[i];
      const img = container.querySelector(`img[src="${icon}"]`);
      img.style.marginRight = `${position * (_KomojuFieldIconElement.ICON_WIDTH + _KomojuFieldIconElement.ICON_GAP)}px`;
      position += 1;
    }
  }
  reposition() {
    const parent = this.parentElement;
    const target = this.target;
    const container = this.shadowRoot?.getElementById("komoju-field-icon");
    if (!target || !parent || !container)
      return;
    container.style.top = `${target.offsetTop}px`;
    container.style.right = `${parent.offsetWidth - target.offsetWidth - target.offsetLeft}px`;
    container.style.height = `${target.offsetHeight}px`;
    const targetStyle = window.getComputedStyle(target);
    container.style.paddingRight = targetStyle.paddingRight;
    container.style.paddingTop = targetStyle.paddingTop;
    container.style.paddingBottom = targetStyle.paddingBottom;
    const icons = this.getAttribute("icon")?.split(/\s+/) || [];
    this.updateVisibleIcons(icons);
  }
};
var KomojuFieldIconElement = _KomojuFieldIconElement;
KomojuFieldIconElement.ICON_WIDTH = 42;
KomojuFieldIconElement.ICON_GAP = 4;
KomojuFieldIconElement.ICON_SWAP_INTERVAL = 5e3;

// src/fields/credit_card/template.html
var template_default = '<div class="fields credit_card">\n  <label class="field field-name">\n    <komoju-i18n key="cc.label.cardholder-name"></komoju-i18n>\n    <input id="cc-name" autocomplete="cc-name" required>\n  </label>\n\n  <label class="field field-number">\n    <komoju-i18n key="cc.label.card-number"></komoju-i18n>\n    <input id="cc-number" autocomplete="cc-number" placeholder="1234 1234 1234 1234" required>\n    <komoju-field-icon id="cc-icon" for="cc-number">\n    </komoju-field-icon>\n  </label>\n\n  <label class="field field-exp">\n    <komoju-i18n key="cc.label.expiration"></komoju-i18n>\n    <input\n      id="cc-exp"\n      placeholder="MM / YY"\n      maxlength="7"\n      autocomplete="cc-exp"\n      required\n    >\n  </label>\n\n  <label class="field field-cvc">\n    <komoju-i18n key="cc.label.cvc"></komoju-i18n>\n    <input id="cc-cvc" autocomplete="cc-csc" maxlength="10" placeholder="123" required>\n    <komoju-field-icon id="cc-cvc-icon" for="cc-cvc">\n    </komoju-field-icon>\n  </label>\n</div>\n\n<ul class="price-info">\n</ul>\n\n<label class="generic-error-message">\n</label>\n\n<style>\n  .credit_card {\n    box-sizing: border-box;\n    display: flex;\n    flex-direction: row;\n    flex-wrap: wrap;\n    justify-content: space-between;\n  }\n\n  @media screen and (min-width: 768px) {\n    .field-exp, .field-cvc {\n      width: 48%;\n    }\n  }\n\n  #cc-cvc {\n    background-repeat: no-repeat;\n    background-position-x: right;\n    background-size: contain;\n  }\n\n  #cc-cvc-icon {\n    background: white;\n    border-radius: 6px;\n  }\n</style>\n';

// src/shared/char-width-utils.ts
function convertNumbersToHalfWidth(str) {
  var fullwidth = "\uFF10\uFF11\uFF12\uFF13\uFF14\uFF15\uFF16\uFF17\uFF18\uFF19\uFF0F";
  var halfwidth = "0123456789/";
  for (var i = 0; i < 10; ++i) {
    str = str.replace(
      new RegExp(fullwidth.charAt(i), "g"),
      halfwidth.charAt(i)
    );
  }
  return str;
}

// src/shared/validation.ts
function addValidation(_i18n, input, callback) {
  input.classList.add("has-validation");
  input.addEventListener("input", () => {
    input.dataset.validationDirty = "true";
  });
  const validate = (event) => {
    const input2 = event.target;
    const errorMessageKey = callback(input2);
    if (errorMessageKey) {
      showError(_i18n, input2, errorMessageKey);
    }
  };
  input.addEventListener("blur", (event) => {
    if (input.dataset.validationDirty !== "true")
      return;
    else
      return validate(event);
  });
  input.addEventListener("validate", validate);
  input.addEventListener("focus", (event) => {
    const input2 = event.target;
    clearErrors(input2);
  });
}
function showError(_i18n, input, messageKey) {
  input.classList.add("invalid");
  const key = messageKey;
  const container = input.parentElement;
  const dupeSelector = `komoju-error:not(.removing) > komoju-i18n[key="${key}"]`;
  if (container?.querySelector(dupeSelector)) {
    return;
  }
  container?.append(createErrorElement(messageKey));
}
function clearErrors(input) {
  input.classList.remove("invalid");
  input.parentElement?.querySelectorAll("komoju-error:not(.removing)").forEach((element) => {
    element.remove();
  });
}
function createErrorElement(messageKey) {
  const el = window.document.createElement("komoju-error");
  const i18nEl = window.document.createElement("komoju-i18n");
  i18nEl.key = messageKey;
  el.appendChild(i18nEl);
  return el;
}

// src/fields/credit_card/card-number-utils.ts
function cardTypeToKomojuSubtype(type) {
  if (type === "amex")
    return "american_express";
  if (type === "diner")
    return "diners_club";
  if (type === "jcb15")
    return "jcb";
  if (type === "mastercard")
    return "master";
  return type;
}
function insertSpaceEvery4Characters(str) {
  return str.replace(/(.{4})/g, "$1 ").trim();
}
function cardNumberMaxLength(type) {
  if (type == "diner") {
    return 16;
  } else if (type == "amex") {
    return 17;
  } else {
    return 23;
  }
}
function formatCardNumber(value, type) {
  if (type == "unknown" || type == "visa" || type == "jcb" || type == "mastercard") {
    return insertSpaceEvery4Characters(value);
  } else {
    return value.replace(/(.{4})/, "$1 ").replace(/(.{11})/, "$1 ").trim();
  }
}
function removeNonDigits(value) {
  return value.replace(/[^0-9( \/ )]+/g, "");
}
function insertSlash(value) {
  const hasSlash = value.includes("/");
  const hasFullMonth = value.length >= 2;
  if (hasFullMonth && !hasSlash) {
    let yearStart = value.lastIndexOf(" ");
    if (yearStart === -1)
      yearStart = 2;
    const month = value.slice(0, 2);
    const year = value.slice(yearStart, value.length);
    return `${month} / ${year}`;
  }
  return value;
}
function removeSlash(value) {
  return value.endsWith("/") ? value.replace(/[^0-9]+/g, "") : value;
}
var cardTypeRegex = {
  amex: /^3[47]\d{0,13}/,
  diner: /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/,
  mastercard: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
  jcb15: /^(?:2131|1800)\d{0,11}/,
  jcb: /^(?:35)\d{0,17}/,
  visa: /^4\d{0,18}/
};
function cardType(value) {
  if (cardTypeRegex.amex.exec(value)) {
    return "amex";
  } else if (cardTypeRegex.diner.exec(value)) {
    return "diner";
  } else if (cardTypeRegex.mastercard.exec(value)) {
    return "mastercard";
  } else if (cardTypeRegex.jcb15.exec(value)) {
    return "jcb15";
  } else if (cardTypeRegex.jcb.exec(value)) {
    return "jcb";
  } else if (cardTypeRegex.visa.exec(value)) {
    return "visa";
  } else {
    return "unknown";
  }
}
function luhnCheck(cardNumber) {
  if (/[^0-9\s]+/.test(cardNumber)) {
    return false;
  }
  let sum = 0;
  let shouldDouble = false;
  cardNumber = cardNumber.replace(/\D/g, "");
  const length = cardNumber.length;
  for (let i = length - 1; i >= 0; --i) {
    let digit = parseInt(cardNumber.charAt(i), 10);
    if (shouldDouble && (digit *= 2) > 9) {
      digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

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

// src/fields/credit_card/i18n.ts
var i18n_exports = {};
__export(i18n_exports, {
  en: () => en,
  ja: () => ja
});
var en = {
  "cc.label.cardholder-name": "Cardholder name",
  "cc.label.card-number": "Card number",
  "cc.label.expiration": "Expiration",
  "cc.label.cvc": "CVC",
  "cc.error.required": "Required",
  "cc.error.incomplete": "Please input the full expiration date",
  "cc.error.please_use_half_width": "Please use half-width characters",
  "cc.error.invalid-number": "Invalid number",
  "cc.error.expired": "Card is expired",
  "cc.error.invalid-month": "Month must be between 1 and 12",
  "cc.error.unsupported-brand": "Unsupported card brand"
};
var ja = {
  "cc.label.cardholder-name": "\u30AB\u30FC\u30C9\u6240\u6709\u8005\u540D",
  "cc.label.card-number": "\u30AB\u30FC\u30C9\u756A\u53F7",
  "cc.label.expiration": "\u6709\u52B9\u671F\u9650",
  "cc.label.cvc": "\u30BB\u30AD\u30E5\u30EA\u30C6\u30A3\u30B3\u30FC\u30C9",
  "cc.error.required": "\u5FC5\u9808\u9805\u76EE\u3067\u3059",
  "cc.error.incomplete": "\u6709\u52B9\u671F\u9650\u3092\u6B63\u3057\u304F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
  "cc.error.please_use_half_width": "\u534A\u89D2\u82F1\u6570\u5B57\u30FB\u8A18\u53F7\u306E\u307F\u6709\u52B9\u3067\u3059",
  "cc.error.invalid-number": "\u30AB\u30FC\u30C9\u756A\u53F7\u304C\u6B63\u3057\u304F\u3042\u308A\u307E\u305B\u3093",
  "cc.error.expired": "\u30AB\u30FC\u30C9\u306E\u6709\u52B9\u671F\u9650\u304C\u5207\u308C\u3066\u3044\u307E\u3059",
  "cc.error.invalid-month": "\u6708\u306F1\u304B\u308912\u306E\u9593\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
  "cc.error.unsupported-brand": "\u5BFE\u5FDC\u3057\u3066\u3044\u306A\u3044\u30AF\u30EC\u30B8\u30C3\u30C8\u30AB\u30FC\u30C9\u30D6\u30E9\u30F3\u30C9\u3067\u3059"
};

// src/fields/credit_card/module.ts
registerMessages(i18n_exports);
window.customElements.define("komoju-field-icon", KomojuFieldIconElement);
var render = (root, paymentMethod) => {
  root.innerHTML = template_default;
  initializeInputs(
    root,
    paymentMethod
  );
};
function initializeInputs(root, paymentMethod) {
  const name = document.getElementById("cc-name");
  addValidation(i18n_exports, name, (input) => {
    if (input.value === "")
      return "cc.error.required";
    if (/[^\x01-\x7E]/.test(input.value))
      return "cc.error.please_use_half_width";
    return null;
  });
  const cardIcon = document.getElementById("cc-icon");
  const defaultCardImage = `${root.komojuCdn}/static/credit_card_number.svg`;
  const supportedBrandImages = paymentMethod.brands.map((brand) => {
    return `https://komoju.com/payment_methods/credit_card.svg?brands=${brand}`;
  }).join(" ");
  cardIcon.icon = supportedBrandImages;
  const number = document.getElementById("cc-number");
  number.addEventListener("input", (event) => {
    const input = event.target;
    if (input.dataset.ime === "active")
      return;
    let value = input.value;
    value = convertNumbersToHalfWidth(value).replace(/\D/g, "");
    if (value.length === 0) {
      clearErrors(input);
    }
    const type = cardType(value);
    input.maxLength = cardNumberMaxLength(type);
    input.value = formatCardNumber(value, type);
    input.dataset.brand = type;
    const brand = cardTypeToKomojuSubtype(type);
    if (type === "unknown") {
      if (value.length < 3) {
        cardIcon.icon = supportedBrandImages;
      } else {
        cardIcon.icon = defaultCardImage;
      }
    } else if (paymentMethod.brands.includes(brand)) {
      cardIcon.icon = `https://komoju.com/payment_methods/credit_card.svg?brands=${brand}`;
      clearErrors(input);
    } else {
      cardIcon.icon = supportedBrandImages;
      showError(i18n_exports, input, "cc.error.unsupported-brand");
    }
  });
  addValidation(i18n_exports, number, (input) => {
    const value = input.value.replace(/\D/g, "");
    if (value === "")
      return "cc.error.required";
    if (!luhnCheck(value))
      return "cc.error.invalid-number";
    const type = cardType(value);
    const brand = cardTypeToKomojuSubtype(type);
    if (type === "unknown")
      return "cc.error.unsupported-brand";
    if (!paymentMethod.brands.includes(brand))
      return "cc.error.unsupported-brand";
    return null;
  });
  const exp = document.getElementById("cc-exp");
  let lastExpValue = exp.value;
  exp.addEventListener("input", (event) => {
    const input = event.target;
    if (input.dataset.ime === "active")
      return;
    let value = convertNumbersToHalfWidth(input.value);
    const addedNewCharacter = value.length > lastExpValue.length;
    value = removeNonDigits(value);
    value = addedNewCharacter ? insertSlash(value) : removeSlash(value);
    input.value = value;
    lastExpValue = value;
  });
  exp.addEventListener("blur", (event) => {
    const input = event.target;
    if (input.dataset.ime === "inactive") {
      let value = convertNumbersToHalfWidth(input.value);
      value = removeNonDigits(value);
      value = insertSlash(value);
      input.value = value;
      lastExpValue = value;
    }
  });
  addValidation(i18n_exports, exp, (input) => {
    const mmyy = input.value.replace(/[^0-9\/]/g, "");
    const [month, year] = mmyy.split("/");
    if (month == null || year == null || year.length !== 2 || month.length !== 2 || !/^\d{2}\/\d{2}$/.test(mmyy)) {
      return "cc.error.incomplete";
    }
    const now = new Date();
    const currentYear = parseInt(
      now.getFullYear().toString().substr(2, 2)
    );
    const currentMonth = now.getMonth() + 1;
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    if (yearNum < currentYear) {
      return "cc.error.expired";
    }
    if (yearNum === currentYear && monthNum < currentMonth) {
      return "cc.error.expired";
    }
    if (monthNum > 12 || monthNum <= 0) {
      return "cc.error.invalid-month";
    }
    return null;
  });
  const cvcIcon = document.getElementById("cc-cvc-icon");
  cvcIcon.icon = `${root.komojuCdn}/static/credit_card_cvc.svg`;
  const cvc = document.getElementById("cc-cvc");
  addValidation(i18n_exports, cvc, (input) => {
    if (input.value === "")
      return "cc.error.required";
    return null;
  });
}
var paymentDetails = (root, _paymentMethod) => {
  const name = root.querySelector("#cc-name");
  const number = root.querySelector("#cc-number");
  const expiration = root.querySelector("#cc-exp");
  const cvc = root.querySelector("#cc-cvc");
  const [month, year] = expiration.value.split("/").map((s) => s.trim());
  return {
    type: "credit_card",
    name: name.value,
    number: number.value.replace(/\s+/g, ""),
    month,
    year,
    verification_value: cvc.value
  };
};
export {
  paymentDetails,
  render
};
//# sourceMappingURL=module.js.map
