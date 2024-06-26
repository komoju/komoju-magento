var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/fields/konbini/template.html
var template_default = '<div class="fields konbini">\n  <label class="field field-name">\n    <komoju-i18n key="kb.label.name"></komoju-i18n>\n    <input id="kb-name">\n  </label>\n\n  <label class="field field-email">\n    <komoju-i18n key="kb.label.email"></komoju-i18n>\n    <input type="email" id="kb-email">\n  </label>\n\n  <template id="konbini-radio">\n    <label class="radio">\n      <input type="radio" name="kb-store">\n      <img class="konbini-icon">\n      <komoju-i18n></komoju-i18n>\n    </label>\n  </template>\n</div>\n\n<ul class="price-info">\n</ul>\n\n<label class="generic-error-message">\n</label>\n\n<style>\n  .konbini {\n    box-sizing: border-box;\n    display: flex;\n    flex-direction: row;\n    flex-wrap: wrap;\n  }\n\n  .radio {\n    display: flex;\n    box-sizing: border-box;\n  }\n\n  img {\n    width: 38px;\n    height: 24px;\n  }\n</style>\n';

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

// src/fields/konbini/i18n.ts
var i18n_exports = {};
__export(i18n_exports, {
  en: () => en,
  ja: () => ja
});
var en = {
  "kb.label.name": "Name (shown on receipt)",
  "kb.label.email": "Email address",
  "kb.error.required": "Required",
  "kb.store.daily-yamazaki": "Daily Yamazaki",
  "kb.store.family-mart": "FamilyMart",
  "kb.store.lawson": "Lawson",
  "kb.store.ministop": "Ministop",
  "kb.store.seicomart": "Seicomart",
  "kb.store.seven-eleven": "Seven Eleven"
};
var ja = {
  "kb.label.name": "\u6C0F\u540D\uFF08\u30EC\u30B7\u30FC\u30C8\u3067\u8868\u793A\u3055\u308C\u307E\u3059\uFF09",
  "kb.label.email": "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
  "kb.error.required": "\u5FC5\u9808\u9805\u76EE\u3067\u3059",
  "kb.store.daily-yamazaki": "\u30C7\u30A4\u30EA\u30FC\u30E4\u30DE\u30B6\u30AD",
  "kb.store.family-mart": "\u30D5\u30A1\u30DF\u30EA\u30FC\u30DE\u30FC\u30C8",
  "kb.store.lawson": "\u30ED\u30FC\u30BD\u30F3",
  "kb.store.ministop": "\u30DF\u30CB\u30B9\u30C8\u30C3\u30D7",
  "kb.store.seicomart": "\u30BB\u30A4\u30B3\u30FC\u30DE\u30FC\u30C8",
  "kb.store.seven-eleven": "\u30BB\u30D6\u30F3\u30A4\u30EC\u30D6\u30F3"
};

// src/fields/konbini/module.ts
registerMessages(i18n_exports);
var render = (root, paymentMethod) => {
  root.innerHTML = template_default;
  initializeInputs(root, paymentMethod);
};
var paymentDetails = (root, _paymentMethod) => {
  const name = root.querySelector("#kb-name");
  const email = root.querySelector("#kb-email");
  const store = root.querySelector('input[name="kb-store"]:checked');
  return {
    type: "konbini",
    store: store.value,
    email: email.value,
    name: name.value
  };
};
function initializeInputs(root, paymentMethod) {
  const radioTemplate = root.querySelector("#konbini-radio");
  const email = root.querySelector("#kb-email");
  let checked = false;
  for (const brand in paymentMethod.brands) {
    const element = radioTemplate.content.cloneNode(true);
    const input = element.querySelector("input");
    const image = element.querySelector("img");
    const label = element.querySelector("komoju-i18n");
    input.value = brand;
    if (!checked) {
      input.checked = true;
      checked = true;
    }
    setupRadioParentCheckedClass(input, root);
    image.src = `${root.komojuApi}${paymentMethod.brands[brand].icon}`;
    label.key = `kb.store.${brand}`;
    radioTemplate.parentElement.appendChild(element);
  }
  addValidation(i18n_exports, email, (input) => {
    if (input.value === "")
      return "kb.error.required";
    return null;
  });
}
export {
  paymentDetails,
  render
};
//# sourceMappingURL=module.js.map
