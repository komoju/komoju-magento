var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/fields/bank_transfer/template.html
var template_default = '<div class="fields bank_transfer">\n  <label class="field field-lastname">\n    <komoju-i18n key="bt.label.lastname"></komoju-i18n>\n    <input id="bt-lastname" placeholder="Yamato">\n  </label>\n\n  <label class="field field-firstname">\n    <komoju-i18n key="bt.label.firstname"></komoju-i18n>\n    <input id="bt-firstname" placeholder="Taro">\n  </label>\n\n  <label class="field field-lastname-kana kana">\n    <komoju-i18n key="bt.label.lastname-kana"></komoju-i18n>\n    <input id="bt-lastname-kana" placeholder="\u30E4\u30DE\u30C8">\n  </label>\n\n  <label class="field field-firstname-kana kana">\n    <komoju-i18n key="bt.label.firstname-kana"></komoju-i18n>\n    <input id="bt-firstname-kana" placeholder="\u30BF\u30ED\u30A6">\n  </label>\n\n  <label class="field field-email">\n    <komoju-i18n key="bt.label.email"></komoju-i18n>\n    <input type="email" id="bt-email" placeholder="taro@example.com">\n  </label>\n\n  <label class="field field-phone">\n    <komoju-i18n key="bt.label.phone"></komoju-i18n>\n    <input type="tel" id="bt-phone" placeholder="000 0000 0000">\n  </label>\n</div>\n\n<ul class="price-info">\n</ul>\n\n<label class="generic-error-message">\n</label>\n\n<style>\n  .bank_transfer {\n    box-sizing: border-box;\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n  }\n\n  @media screen and (max-width: 700px) {\n    .bank_transfer {\n      grid-template-columns: 1fr;\n    }\n  }\n</style>\n';

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

// src/fields/bank_transfer/i18n.ts
var i18n_exports = {};
__export(i18n_exports, {
  en: () => en,
  ja: () => ja
});
var en = {
  "bt.label.lastname": "Last name",
  "bt.label.firstname": "First name",
  "bt.label.lastname-kana": "Last name (kana)",
  "bt.label.firstname-kana": "First name (kana)",
  "bt.label.email": "Email address",
  "bt.label.phone": "Phone number",
  "bt.error.required": "Required"
};
var ja = {
  "bt.label.lastname": "\u59D3",
  "bt.label.firstname": "\u540D",
  "bt.label.lastname-kana": "\u59D3 (\u30AB\u30BF\u30AB\u30CA)",
  "bt.label.firstname-kana": "\u540D (\u30AB\u30BF\u30AB\u30CA)",
  "bt.label.email": "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
  "bt.label.phone": "\u96FB\u8A71\u756A\u53F7",
  "bt.error.required": "\u5FC5\u9808\u9805\u76EE\u3067\u3059"
};

// src/shared/char-width-utils.ts
var conversionMap = {
  \u30AC: "\uFF76\uFF9E",
  \u30AE: "\uFF77\uFF9E",
  \u30B0: "\uFF78\uFF9E",
  \u30B2: "\uFF79\uFF9E",
  \u30B4: "\uFF7A\uFF9E",
  \u30B6: "\uFF7B\uFF9E",
  \u30B8: "\uFF7C\uFF9E",
  \u30BA: "\uFF7D\uFF9E",
  \u30BC: "\uFF7E\uFF9E",
  \u30BE: "\uFF7F\uFF9E",
  \u30C0: "\uFF80\uFF9E",
  \u30C2: "\uFF81\uFF9E",
  \u30C5: "\uFF82\uFF9E",
  \u30C7: "\uFF83\uFF9E",
  \u30C9: "\uFF84\uFF9E",
  \u30D0: "\uFF8A\uFF9E",
  \u30D3: "\uFF8B\uFF9E",
  \u30D6: "\uFF8C\uFF9E",
  \u30D9: "\uFF8D\uFF9E",
  \u30DC: "\uFF8E\uFF9E",
  \u30D1: "\uFF8A\uFF9F",
  \u30D4: "\uFF8B\uFF9F",
  \u30D7: "\uFF8C\uFF9F",
  \u30DA: "\uFF8D\uFF9F",
  \u30DD: "\uFF8E\uFF9F",
  \u30F4: "\uFF73\uFF9E",
  \u30F7: "\uFF9C\uFF9E",
  \u30FA: "\uFF66\uFF9E",
  \u30A2: "\uFF71",
  \u30A4: "\uFF72",
  \u30A6: "\uFF73",
  \u30A8: "\uFF74",
  \u30AA: "\uFF75",
  \u30AB: "\uFF76",
  \u30AD: "\uFF77",
  \u30AF: "\uFF78",
  \u30B1: "\uFF79",
  \u30B3: "\uFF7A",
  \u30B5: "\uFF7B",
  \u30B7: "\uFF7C",
  \u30B9: "\uFF7D",
  \u30BB: "\uFF7E",
  \u30BD: "\uFF7F",
  \u30BF: "\uFF80",
  \u30C1: "\uFF81",
  \u30C4: "\uFF82",
  \u30C6: "\uFF83",
  \u30C8: "\uFF84",
  \u30CA: "\uFF85",
  \u30CB: "\uFF86",
  \u30CC: "\uFF87",
  \u30CD: "\uFF88",
  \u30CE: "\uFF89",
  \u30CF: "\uFF8A",
  \u30D2: "\uFF8B",
  \u30D5: "\uFF8C",
  \u30D8: "\uFF8D",
  \u30DB: "\uFF8E",
  \u30DE: "\uFF8F",
  \u30DF: "\uFF90",
  \u30E0: "\uFF91",
  \u30E1: "\uFF92",
  \u30E2: "\uFF93",
  \u30E4: "\uFF94",
  \u30E6: "\uFF95",
  \u30E8: "\uFF96",
  \u30E9: "\uFF97",
  \u30EA: "\uFF98",
  \u30EB: "\uFF99",
  \u30EC: "\uFF9A",
  \u30ED: "\uFF9B",
  \u30EF: "\uFF9C",
  \u30F2: "\uFF66",
  \u30F3: "\uFF9D",
  \u30A1: "\uFF67",
  \u30A3: "\uFF68",
  \u30A5: "\uFF69",
  \u30A7: "\uFF6A",
  \u30A9: "\uFF6B",
  \u30C3: "\uFF6F",
  \u30E3: "\uFF6C",
  \u30E5: "\uFF6D",
  \u30E7: "\uFF6E",
  "\u3002": "\uFF61",
  "\u3001": "\uFF64",
  \u30FC: "\uFF70",
  "\u2212": "-",
  "\uFF08": "(",
  "\uFF09": ")",
  "\u300C": "\uFF62",
  "\u300D": "\uFF63",
  "\u30FB": "\uFF65",
  "\u3000": " ",
  \uFF21: "A",
  \uFF22: "B",
  \uFF23: "C",
  \uFF24: "D",
  \uFF25: "E",
  \uFF26: "F",
  \uFF27: "G",
  \uFF28: "H",
  \uFF29: "I",
  \uFF2A: "J",
  \uFF2B: "K",
  \uFF2C: "L",
  \uFF2D: "M",
  \uFF2E: "N",
  \uFF2F: "O",
  \uFF30: "P",
  \uFF31: "Q",
  \uFF32: "R",
  \uFF33: "S",
  \uFF34: "T",
  \uFF35: "U",
  \uFF36: "V",
  \uFF37: "W",
  \uFF38: "X",
  \uFF39: "Y",
  \uFF3A: "Z",
  \uFF41: "a",
  \uFF42: "b",
  \uFF43: "c",
  \uFF44: "d",
  \uFF45: "e",
  \uFF46: "f",
  \uFF47: "g",
  \uFF48: "h",
  \uFF49: "i",
  \uFF4A: "j",
  \uFF4B: "k",
  \uFF4C: "l",
  \uFF4D: "m",
  \uFF4E: "n",
  \uFF4F: "o",
  \uFF50: "p",
  \uFF51: "q",
  \uFF52: "r",
  \uFF53: "s",
  \uFF54: "t",
  \uFF55: "u",
  \uFF56: "v",
  \uFF57: "w",
  \uFF58: "x",
  \uFF59: "y",
  \uFF5A: "z",
  "\uFF10": "0",
  "\uFF11": "1",
  "\uFF12": "2",
  "\uFF13": "3",
  "\uFF14": "4",
  "\uFF15": "5",
  "\uFF16": "6",
  "\uFF17": "7",
  "\uFF18": "8",
  "\uFF19": "9"
};
function convertCharsToHalfWidth(str) {
  const convertedChars = str.split("").map((char) => {
    return conversionMap[char] ?? char;
  });
  return convertedChars.join("");
}

// src/fields/bank_transfer/module.ts
registerMessages(i18n_exports);
var render = (root, paymentMethod) => {
  root.innerHTML = template_default;
  root.querySelectorAll("input").forEach((element) => {
    addValidation(i18n_exports, element, (input) => {
      if (input.value === "")
        return "bt.error.required";
      return null;
    });
  });
  root.querySelectorAll(".kana").forEach((element) => {
    element.addEventListener("input", (event) => {
      const input = event.target;
      if (input.dataset.ime === "active")
        return;
      input.value = convertCharsToHalfWidth(input.value);
    });
  });
};
var paymentDetails = (root, _paymentMethod) => {
  const firstname = root.querySelector("#bt-firstname");
  const lastname = root.querySelector("#bt-lastname");
  const firstnameKana = root.querySelector("#bt-firstname-kana");
  const lastnameKana = root.querySelector("#bt-lastname-kana");
  const email = root.querySelector("#bt-email");
  const phone = root.querySelector("#bt-phone");
  return {
    type: "bank_transfer",
    email: email.value,
    family_name: lastname.value,
    family_name_kana: lastnameKana.value,
    given_name: firstname.value,
    given_name_kana: firstnameKana.value,
    phone: phone.value
  };
};
export {
  paymentDetails,
  render
};
//# sourceMappingURL=module.js.map
