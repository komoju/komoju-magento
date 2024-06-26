var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/fields/offsite/template.html
var template_default = '<div class="fields">\n  <template id="additional-field">\n    <label class="field">\n      <komoju-i18n></komoju-i18n>\n      <input type="text" required>\n    </label>\n  </template>\n</div>\n\n<ul class="price-info">\n</ul>\n\n<label class="generic-error-message">\n</label>\n';

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

// src/fields/offsite/i18n.ts
var i18n_exports = {};
__export(i18n_exports, {
  en: () => en,
  ja: () => ja
});
var en = {
  "os.label.name": "Customer name",
  "os.label.email": "Email address",
  "os.label.phone": "Phone number",
  "os.error.required": "Required"
};
var ja = {
  "os.label.name": "\u304A\u540D\u524D",
  "os.label.email": "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
  "os.label.phone": "\u96FB\u8A71\u756A\u53F7",
  "os.error.required": "\u5FC5\u9808\u9805\u76EE\u3067\u3059"
};

// src/fields/offsite/module.ts
registerMessages(i18n_exports);
var render = (root, paymentMethod) => {
  root.innerHTML = template_default;
  root.querySelectorAll(".fields").forEach((element) => {
    element.classList.add(paymentMethod.type);
  });
  const fieldTemplate = root.querySelector("#additional-field");
  for (const field of paymentMethod.additional_fields ?? []) {
    const element = fieldTemplate.content.cloneNode(true);
    const input = element.querySelector("input");
    const text = element.querySelector("komoju-i18n");
    if (field === "email")
      input.type = "email";
    else if (field === "phone")
      input.type = "tel";
    input.id = `offsite-${field}`;
    text.key = `os.label.${field}`;
    fieldTemplate.parentElement.appendChild(element);
    addValidation(i18n_exports, input, (input2) => {
      if (input2.value === "")
        return "os.error.required";
      return null;
    });
  }
};
var paymentDetails = (root, paymentMethod) => {
  const result = {
    type: paymentMethod.type
  };
  for (const field of paymentMethod.additional_fields ?? []) {
    const input = root.querySelector(`#offsite-${field}`);
    result[field] = input.value;
  }
  return result;
};
export {
  paymentDetails,
  render
};
//# sourceMappingURL=module.js.map
