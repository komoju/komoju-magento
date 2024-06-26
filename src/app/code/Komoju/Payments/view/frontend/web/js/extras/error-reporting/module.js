var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/@honeybadger-io/js/dist/browser/honeybadger.js
var require_honeybadger = __commonJS({
  "node_modules/@honeybadger-io/js/dist/browser/honeybadger.js"(exports, module) {
    (function(global2, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, global2.Honeybadger = factory());
    })(exports, function() {
      "use strict";
      var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
      function getDefaultExportFromCjs(x) {
        return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
      }
      function getAugmentedNamespace(n) {
        var f = n.default;
        if (typeof f == "function") {
          var a = function() {
            return f.apply(this, arguments);
          };
          a.prototype = f.prototype;
        } else
          a = {};
        Object.defineProperty(a, "__esModule", { value: true });
        Object.keys(n).forEach(function(k) {
          var d = Object.getOwnPropertyDescriptor(n, k);
          Object.defineProperty(a, k, d.get ? d : {
            enumerable: true,
            get: function() {
              return n[k];
            }
          });
        });
        return a;
      }
      var browser$1 = {};
      var src = {};
      var client = {};
      var util$1 = {};
      var UNKNOWN_FUNCTION = "<unknown>";
      function parse(stackString) {
        var lines = stackString.split("\n");
        return lines.reduce(function(stack, line) {
          var parseResult = parseChrome(line) || parseWinjs(line) || parseGecko(line) || parseNode(line) || parseJSC(line);
          if (parseResult) {
            stack.push(parseResult);
          }
          return stack;
        }, []);
      }
      var chromeRe = /^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|\/|[a-z]:\\|\\\\).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
      var chromeEvalRe = /\((\S*)(?::(\d+))(?::(\d+))\)/;
      function parseChrome(line) {
        var parts = chromeRe.exec(line);
        if (!parts) {
          return null;
        }
        var isNative2 = parts[2] && parts[2].indexOf("native") === 0;
        var isEval = parts[2] && parts[2].indexOf("eval") === 0;
        var submatch = chromeEvalRe.exec(parts[2]);
        if (isEval && submatch != null) {
          parts[2] = submatch[1];
          parts[3] = submatch[2];
          parts[4] = submatch[3];
        }
        return {
          file: !isNative2 ? parts[2] : null,
          methodName: parts[1] || UNKNOWN_FUNCTION,
          arguments: isNative2 ? [parts[2]] : [],
          lineNumber: parts[3] ? +parts[3] : null,
          column: parts[4] ? +parts[4] : null
        };
      }
      var winjsRe = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i;
      function parseWinjs(line) {
        var parts = winjsRe.exec(line);
        if (!parts) {
          return null;
        }
        return {
          file: parts[2],
          methodName: parts[1] || UNKNOWN_FUNCTION,
          arguments: [],
          lineNumber: +parts[3],
          column: parts[4] ? +parts[4] : null
        };
      }
      var geckoRe = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|\[native).*?|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i;
      var geckoEvalRe = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
      function parseGecko(line) {
        var parts = geckoRe.exec(line);
        if (!parts) {
          return null;
        }
        var isEval = parts[3] && parts[3].indexOf(" > eval") > -1;
        var submatch = geckoEvalRe.exec(parts[3]);
        if (isEval && submatch != null) {
          parts[3] = submatch[1];
          parts[4] = submatch[2];
          parts[5] = null;
        }
        return {
          file: parts[3],
          methodName: parts[1] || UNKNOWN_FUNCTION,
          arguments: parts[2] ? parts[2].split(",") : [],
          lineNumber: parts[4] ? +parts[4] : null,
          column: parts[5] ? +parts[5] : null
        };
      }
      var javaScriptCoreRe = /^\s*(?:([^@]*)(?:\((.*?)\))?@)?(\S.*?):(\d+)(?::(\d+))?\s*$/i;
      function parseJSC(line) {
        var parts = javaScriptCoreRe.exec(line);
        if (!parts) {
          return null;
        }
        return {
          file: parts[3],
          methodName: parts[1] || UNKNOWN_FUNCTION,
          arguments: [],
          lineNumber: +parts[4],
          column: parts[5] ? +parts[5] : null
        };
      }
      var nodeRe = /^\s*at (?:((?:\[object object\])?[^\\/]+(?: \[as \S+\])?) )?\(?(.*?):(\d+)(?::(\d+))?\)?\s*$/i;
      function parseNode(line) {
        var parts = nodeRe.exec(line);
        if (!parts) {
          return null;
        }
        return {
          file: parts[2],
          methodName: parts[1] || UNKNOWN_FUNCTION,
          arguments: [],
          lineNumber: +parts[3],
          column: parts[4] ? +parts[4] : null
        };
      }
      var stackTraceParser_esm = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        parse
      });
      var require$$0 = /* @__PURE__ */ getAugmentedNamespace(stackTraceParser_esm);
      var __createBinding = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __setModuleDefault = commonjsGlobal && commonjsGlobal.__setModuleDefault || (Object.create ? function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      } : function(o, v) {
        o["default"] = v;
      });
      var __importStar = commonjsGlobal && commonjsGlobal.__importStar || function(mod) {
        if (mod && mod.__esModule)
          return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
              __createBinding(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
      var __awaiter = commonjsGlobal && commonjsGlobal.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      var __generator = commonjsGlobal && commonjsGlobal.__generator || function(thisArg, body) {
        var _ = { label: 0, sent: function() {
          if (t[0] & 1)
            throw t[1];
          return t[1];
        }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
          return this;
        }), g;
        function verb(n) {
          return function(v) {
            return step([n, v]);
          };
        }
        function step(op) {
          if (f)
            throw new TypeError("Generator is already executing.");
          while (_)
            try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                return t;
              if (y = 0, t)
                op = [op[0] & 2, t.value];
              switch (op[0]) {
                case 0:
                case 1:
                  t = op;
                  break;
                case 4:
                  _.label++;
                  return { value: op[1], done: false };
                case 5:
                  _.label++;
                  y = op[1];
                  op = [0];
                  continue;
                case 7:
                  op = _.ops.pop();
                  _.trys.pop();
                  continue;
                default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                    _ = 0;
                    continue;
                  }
                  if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                    _.label = op[1];
                    break;
                  }
                  if (op[0] === 6 && _.label < t[1]) {
                    _.label = t[1];
                    t = op;
                    break;
                  }
                  if (t && _.label < t[2]) {
                    _.label = t[2];
                    _.ops.push(op);
                    break;
                  }
                  if (t[2])
                    _.ops.pop();
                  _.trys.pop();
                  continue;
              }
              op = body.call(thisArg, _);
            } catch (e) {
              op = [6, e];
              y = 0;
            } finally {
              f = t = 0;
            }
          if (op[0] & 5)
            throw op[1];
          return { value: op[0] ? op[1] : void 0, done: true };
        }
      };
      Object.defineProperty(util$1, "__esModule", { value: true });
      util$1.isBrowserConfig = util$1.clone = util$1.formatCGIData = util$1.filterUrl = util$1.filter = util$1.generateStackTrace = util$1.endpoint = util$1.instrument = util$1.isErrorObject = util$1.makeNotice = util$1.logger = util$1.sanitize = util$1.shallowClone = util$1.runAfterNotifyHandlers = util$1.runBeforeNotifyHandlers = util$1.getSourceForBacktrace = util$1.getCauses = util$1.makeBacktrace = util$1.objectIsExtensible = util$1.objectIsEmpty = util$1.mergeNotice = util$1.merge = void 0;
      var stackTraceParser = __importStar(require$$0);
      function merge(obj1, obj2) {
        var result = {};
        for (var k in obj1) {
          result[k] = obj1[k];
        }
        for (var k in obj2) {
          result[k] = obj2[k];
        }
        return result;
      }
      util$1.merge = merge;
      function mergeNotice(notice1, notice2) {
        var result = merge(notice1, notice2);
        if (notice1.context && notice2.context) {
          result.context = merge(notice1.context, notice2.context);
        }
        return result;
      }
      util$1.mergeNotice = mergeNotice;
      function objectIsEmpty(obj) {
        for (var k in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, k)) {
            return false;
          }
        }
        return true;
      }
      util$1.objectIsEmpty = objectIsEmpty;
      function objectIsExtensible(obj) {
        if (typeof Object.isExtensible !== "function") {
          return true;
        }
        return Object.isExtensible(obj);
      }
      util$1.objectIsExtensible = objectIsExtensible;
      function makeBacktrace(stack, shift) {
        if (shift === void 0) {
          shift = 0;
        }
        try {
          var backtrace = stackTraceParser.parse(stack).map(function(line) {
            return {
              file: line.file,
              method: line.methodName,
              number: line.lineNumber,
              column: line.column
            };
          });
          backtrace.splice(0, shift);
          return backtrace;
        } catch (_err) {
          return [];
        }
      }
      util$1.makeBacktrace = makeBacktrace;
      function getCauses(notice) {
        if (notice.cause) {
          var causes = [];
          var cause = notice;
          while (causes.length < 3 && (cause = cause.cause)) {
            causes.push({
              class: cause.name,
              message: cause.message,
              backtrace: typeof cause.stack == "string" ? makeBacktrace(cause.stack) : null
            });
          }
          return causes;
        }
        return [];
      }
      util$1.getCauses = getCauses;
      function getSourceForBacktrace(backtrace, getSourceFileHandler) {
        return __awaiter(this, void 0, void 0, function() {
          var result, index, trace, fileContent;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                result = [];
                if (!getSourceFileHandler || !backtrace || !backtrace.length) {
                  return [2, result];
                }
                index = 0;
                _a.label = 1;
              case 1:
                if (!backtrace.length)
                  return [3, 3];
                trace = backtrace.splice(0)[index];
                return [4, getSourceFileHandler(trace.file)];
              case 2:
                fileContent = _a.sent();
                result[index] = getSourceCodeSnippet(fileContent, trace.number);
                index++;
                return [3, 1];
              case 3:
                return [2, result];
            }
          });
        });
      }
      util$1.getSourceForBacktrace = getSourceForBacktrace;
      function runBeforeNotifyHandlers(notice, handlers) {
        var result = true;
        for (var i = 0, len = handlers.length; i < len; i++) {
          var handler = handlers[i];
          if (handler(notice) === false) {
            result = false;
          }
        }
        return result;
      }
      util$1.runBeforeNotifyHandlers = runBeforeNotifyHandlers;
      function runAfterNotifyHandlers(notice, handlers, error) {
        if (notice && notice.afterNotify) {
          notice.afterNotify(error, notice);
        }
        for (var i = 0, len = handlers.length; i < len; i++) {
          handlers[i](error, notice);
        }
        return true;
      }
      util$1.runAfterNotifyHandlers = runAfterNotifyHandlers;
      function shallowClone(obj) {
        if (typeof obj !== "object" || obj === null) {
          return {};
        }
        var result = {};
        for (var k in obj) {
          result[k] = obj[k];
        }
        return result;
      }
      util$1.shallowClone = shallowClone;
      function sanitize$2(obj, maxDepth) {
        if (maxDepth === void 0) {
          maxDepth = 8;
        }
        var seenObjects = [];
        function seen(obj2) {
          if (!obj2 || typeof obj2 !== "object") {
            return false;
          }
          for (var i = 0; i < seenObjects.length; i++) {
            var value = seenObjects[i];
            if (value === obj2) {
              return true;
            }
          }
          seenObjects.push(obj2);
          return false;
        }
        function canSerialize(obj2) {
          var typeOfObj = typeof obj2;
          if (/function/.test(typeOfObj)) {
            return obj2.name === "toJSON";
          }
          if (/symbol/.test(typeOfObj)) {
            return false;
          }
          if (obj2 === null) {
            return false;
          }
          if (typeof obj2 === "object" && typeof obj2.hasOwnProperty === "undefined") {
            return false;
          }
          return true;
        }
        function serialize(obj2, depth) {
          if (depth === void 0) {
            depth = 0;
          }
          if (depth >= maxDepth) {
            return "[DEPTH]";
          }
          if (!canSerialize(obj2)) {
            return Object.prototype.toString.call(obj2);
          }
          if (seen(obj2)) {
            return "[RECURSION]";
          }
          if (Array.isArray(obj2)) {
            return obj2.map(function(o) {
              return safeSerialize(o, depth + 1);
            });
          }
          if (typeof obj2 === "object") {
            var ret = {};
            for (var k in obj2) {
              var v = obj2[k];
              if (Object.prototype.hasOwnProperty.call(obj2, k) && k != null && v != null) {
                ret[k] = safeSerialize(v, depth + 1);
              }
            }
            return ret;
          }
          return obj2;
        }
        function safeSerialize(obj2, depth) {
          if (depth === void 0) {
            depth = 0;
          }
          try {
            return serialize(obj2, depth);
          } catch (e) {
            return "[ERROR] ".concat(e);
          }
        }
        return safeSerialize(obj);
      }
      util$1.sanitize = sanitize$2;
      function logger(client2) {
        var log = function(method) {
          return function() {
            var _a;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
            }
            if (method === "debug") {
              if (!client2.config.debug) {
                return;
              }
              method = "log";
            }
            args.unshift("[Honeybadger]");
            (_a = client2.config.logger)[method].apply(_a, args);
          };
        };
        return {
          log: log("log"),
          info: log("info"),
          debug: log("debug"),
          warn: log("warn"),
          error: log("error")
        };
      }
      util$1.logger = logger;
      function makeNotice$1(thing) {
        var notice;
        if (!thing) {
          notice = {};
        } else if (isErrorObject(thing)) {
          var e = thing;
          notice = merge(thing, { name: e.name, message: e.message, stack: e.stack, cause: e.cause });
        } else if (typeof thing === "object") {
          notice = shallowClone(thing);
        } else {
          var m = String(thing);
          notice = { message: m };
        }
        return notice;
      }
      util$1.makeNotice = makeNotice$1;
      function isErrorObject(thing) {
        return thing instanceof Error || Object.prototype.toString.call(thing) === "[object Error]";
      }
      util$1.isErrorObject = isErrorObject;
      function instrument$5(object, name, replacement) {
        if (!object || !name || !replacement || !(name in object)) {
          return;
        }
        var original = object[name];
        while (original && original.__hb_original) {
          original = original.__hb_original;
        }
        try {
          object[name] = replacement(original);
          object[name].__hb_original = original;
        } catch (_e) {
        }
      }
      util$1.instrument = instrument$5;
      function endpoint(base, path) {
        var endpoint2 = base.trim().replace(/\/$/, "");
        path = path.trim().replace(/(^\/|\/$)/g, "");
        return "".concat(endpoint2, "/").concat(path);
      }
      util$1.endpoint = endpoint;
      function generateStackTrace() {
        try {
          throw new Error("");
        } catch (e) {
          if (e.stack) {
            return e.stack;
          }
        }
        var maxStackSize = 10;
        var stack = [];
        var curr = arguments.callee;
        while (curr && stack.length < maxStackSize) {
          if (/function(?:\s+([\w$]+))+\s*\(/.test(curr.toString())) {
            stack.push(RegExp.$1 || "<anonymous>");
          } else {
            stack.push("<anonymous>");
          }
          try {
            curr = curr.caller;
          } catch (e) {
            break;
          }
        }
        return stack.join("\n");
      }
      util$1.generateStackTrace = generateStackTrace;
      function filter(obj, filters) {
        if (!is("Object", obj)) {
          return;
        }
        if (!is("Array", filters)) {
          filters = [];
        }
        var seen = [];
        function filter2(obj2) {
          var k, newObj;
          if (is("Object", obj2) || is("Array", obj2)) {
            if (seen.indexOf(obj2) !== -1) {
              return "[CIRCULAR DATA STRUCTURE]";
            }
            seen.push(obj2);
          }
          if (is("Object", obj2)) {
            newObj = {};
            for (k in obj2) {
              if (filterMatch(k, filters)) {
                newObj[k] = "[FILTERED]";
              } else {
                newObj[k] = filter2(obj2[k]);
              }
            }
            return newObj;
          }
          if (is("Array", obj2)) {
            return obj2.map(function(v) {
              return filter2(v);
            });
          }
          if (is("Function", obj2)) {
            return "[FUNC]";
          }
          return obj2;
        }
        return filter2(obj);
      }
      util$1.filter = filter;
      function filterMatch(key, filters) {
        for (var i = 0; i < filters.length; i++) {
          if (key.toLowerCase().indexOf(filters[i].toLowerCase()) !== -1) {
            return true;
          }
        }
        return false;
      }
      function is(type, obj) {
        var klass = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== void 0 && obj !== null && klass === type;
      }
      function filterUrl(url, filters) {
        if (!filters) {
          return url;
        }
        if (typeof url !== "string") {
          return url;
        }
        var query = url.split(/\?/, 2)[1];
        if (!query) {
          return url;
        }
        var result = url;
        query.split(/[&]\s?/).forEach(function(pair) {
          var _a = pair.split("=", 2), key = _a[0], value = _a[1];
          if (filterMatch(key, filters)) {
            result = result.replace("".concat(key, "=").concat(value), "".concat(key, "=[FILTERED]"));
          }
        });
        return result;
      }
      util$1.filterUrl = filterUrl;
      function formatCGIData(vars, prefix) {
        if (prefix === void 0) {
          prefix = "";
        }
        var formattedVars = {};
        Object.keys(vars).forEach(function(key) {
          var formattedKey = prefix + key.replace(/\W/g, "_").toUpperCase();
          formattedVars[formattedKey] = vars[key];
        });
        return formattedVars;
      }
      util$1.formatCGIData = formatCGIData;
      function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
      }
      util$1.clone = clone;
      function getSourceCodeSnippet(fileData, lineNumber, sourceRadius) {
        if (sourceRadius === void 0) {
          sourceRadius = 2;
        }
        if (!fileData) {
          return null;
        }
        var lines = fileData.split("\n");
        lines.unshift("");
        var start = lineNumber - sourceRadius;
        var end = lineNumber + sourceRadius;
        var result = {};
        for (var i = start; i <= end; i++) {
          var line = lines[i];
          if (typeof line === "string") {
            result[i] = line;
          }
        }
        return result;
      }
      function isBrowserConfig(config) {
        return config.async !== void 0;
      }
      util$1.isBrowserConfig = isBrowserConfig;
      var store = {};
      Object.defineProperty(store, "__esModule", { value: true });
      store.GlobalStore = void 0;
      var util_1$2 = util$1;
      var GlobalStore = function() {
        function GlobalStore2(contents, breadcrumbsLimit) {
          this.contents = contents;
          this.breadcrumbsLimit = breadcrumbsLimit;
        }
        GlobalStore2.create = function(contents, breadcrumbsLimit) {
          return new GlobalStore2(contents, breadcrumbsLimit);
        };
        GlobalStore2.prototype.available = function() {
          return true;
        };
        GlobalStore2.prototype.getContents = function(key) {
          var value = key ? this.contents[key] : this.contents;
          return JSON.parse(JSON.stringify(value));
        };
        GlobalStore2.prototype.setContext = function(context) {
          this.contents.context = (0, util_1$2.merge)(this.contents.context, context || {});
        };
        GlobalStore2.prototype.addBreadcrumb = function(breadcrumb) {
          if (this.contents.breadcrumbs.length == this.breadcrumbsLimit) {
            this.contents.breadcrumbs.shift();
          }
          this.contents.breadcrumbs.push(breadcrumb);
        };
        GlobalStore2.prototype.clear = function() {
          this.contents.context = {};
          this.contents.breadcrumbs = [];
        };
        GlobalStore2.prototype.run = function(callback) {
          return callback();
        };
        return GlobalStore2;
      }();
      store.GlobalStore = GlobalStore;
      var __assign = commonjsGlobal && commonjsGlobal.__assign || function() {
        __assign = Object.assign || function(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
              if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
          }
          return t;
        };
        return __assign.apply(this, arguments);
      };
      Object.defineProperty(client, "__esModule", { value: true });
      client.Client = void 0;
      var util_1$1 = util$1;
      var store_1 = store;
      var notifier = {
        name: "honeybadger-js",
        url: "https://github.com/honeybadger-io/honeybadger-js",
        version: "4.7.4"
      };
      var TAG_SEPARATOR = /,|\s+/;
      var NOT_BLANK = /\S/;
      var Client = function() {
        function Client2(opts, transport2) {
          if (opts === void 0) {
            opts = {};
          }
          this.__pluginsExecuted = false;
          this.__store = null;
          this.__beforeNotifyHandlers = [];
          this.__afterNotifyHandlers = [];
          this.config = __assign({ apiKey: null, endpoint: "https://api.honeybadger.io", environment: null, hostname: null, projectRoot: null, component: null, action: null, revision: null, reportData: null, breadcrumbsEnabled: true, maxBreadcrumbs: 40, maxObjectDepth: 8, logger: console, developmentEnvironments: ["dev", "development", "test"], debug: false, tags: null, enableUncaught: true, enableUnhandledRejection: true, afterUncaught: function() {
            return true;
          }, filters: ["creditcard", "password"], __plugins: [] }, opts);
          this.__initStore();
          this.__transport = transport2;
          this.logger = (0, util_1$1.logger)(this);
        }
        Client2.prototype.getVersion = function() {
          return notifier.version;
        };
        Client2.prototype.configure = function(opts) {
          var _this = this;
          if (opts === void 0) {
            opts = {};
          }
          for (var k in opts) {
            this.config[k] = opts[k];
          }
          if (!this.__pluginsExecuted) {
            this.__pluginsExecuted = true;
            this.config.__plugins.forEach(function(plugin) {
              return plugin.load(_this);
            });
          }
          return this;
        };
        Client2.prototype.__initStore = function() {
          this.__store = new store_1.GlobalStore({ context: {}, breadcrumbs: [] }, this.config.maxBreadcrumbs);
        };
        Client2.prototype.beforeNotify = function(handler) {
          this.__beforeNotifyHandlers.push(handler);
          return this;
        };
        Client2.prototype.afterNotify = function(handler) {
          this.__afterNotifyHandlers.push(handler);
          return this;
        };
        Client2.prototype.setContext = function(context) {
          if (typeof context === "object" && context != null) {
            this.__store.setContext(context);
          }
          return this;
        };
        Client2.prototype.resetContext = function(context) {
          this.logger.warn("Deprecation warning: `Honeybadger.resetContext()` has been deprecated; please use `Honeybadger.clear()` instead.");
          this.__store.clear();
          if (typeof context === "object" && context !== null) {
            this.__store.setContext(context);
          }
          return this;
        };
        Client2.prototype.clear = function() {
          this.__store.clear();
          return this;
        };
        Client2.prototype.notify = function(noticeable, name, extra) {
          var _this = this;
          if (name === void 0) {
            name = void 0;
          }
          if (extra === void 0) {
            extra = void 0;
          }
          var preConditionError = null;
          var notice = this.makeNotice(noticeable, name, extra);
          if (!notice) {
            this.logger.debug("failed to build error report");
            preConditionError = new Error("failed to build error report");
          }
          if (!preConditionError && this.config.reportData === false) {
            this.logger.debug("skipping error report: honeybadger.js is disabled", notice);
            preConditionError = new Error("honeybadger.js is disabled");
          }
          if (!preConditionError && this.__developmentMode()) {
            this.logger.log("honeybadger.js is in development mode; the following error report will be sent in production.", notice);
            preConditionError = new Error("honeybadger.js is in development mode");
          }
          if (!preConditionError && !this.config.apiKey) {
            this.logger.warn("could not send error report: no API key has been configured", notice);
            preConditionError = new Error("missing API key");
          }
          var sourceCodeData = notice && notice.backtrace ? notice.backtrace.map(function(trace) {
            return (0, util_1$1.shallowClone)(trace);
          }) : null;
          var beforeNotifyResult = (0, util_1$1.runBeforeNotifyHandlers)(notice, this.__beforeNotifyHandlers);
          if (!preConditionError && !beforeNotifyResult) {
            this.logger.debug("skipping error report: beforeNotify handlers returned false", notice);
            preConditionError = new Error("beforeNotify handlers returned false");
          }
          if (preConditionError) {
            (0, util_1$1.runAfterNotifyHandlers)(notice, this.__afterNotifyHandlers, preConditionError);
            return false;
          }
          this.addBreadcrumb("Honeybadger Notice", {
            category: "notice",
            metadata: {
              message: notice.message,
              name: notice.name,
              stack: notice.stack
            }
          });
          var breadcrumbs2 = this.__store.getContents("breadcrumbs");
          notice.__breadcrumbs = this.config.breadcrumbsEnabled ? breadcrumbs2 : [];
          (0, util_1$1.getSourceForBacktrace)(sourceCodeData, this.__getSourceFileHandler).then(function(sourcePerTrace) {
            sourcePerTrace.forEach(function(source, index) {
              notice.backtrace[index].source = source;
            });
            var payload = _this.__buildPayload(notice);
            _this.__transport.send({
              headers: {
                "X-API-Key": _this.config.apiKey,
                "Content-Type": "application/json",
                "Accept": "text/json, application/json"
              },
              method: "POST",
              endpoint: (0, util_1$1.endpoint)(_this.config.endpoint, "/v1/notices/js"),
              maxObjectDepth: _this.config.maxObjectDepth,
              logger: _this.logger,
              async: (0, util_1$1.isBrowserConfig)(_this.config) ? _this.config.async : void 0
            }, payload).then(function(res) {
              if (res.statusCode !== 201) {
                (0, util_1$1.runAfterNotifyHandlers)(notice, _this.__afterNotifyHandlers, new Error("Bad HTTP response: ".concat(res.statusCode)));
                _this.logger.warn("Error report failed: unknown response from server. code=".concat(res.statusCode));
                return;
              }
              var uuid = JSON.parse(res.body).id;
              (0, util_1$1.runAfterNotifyHandlers)((0, util_1$1.merge)(notice, {
                id: uuid
              }), _this.__afterNotifyHandlers);
              _this.logger.info("Error report sent \u26A1 https://app.honeybadger.io/notice/".concat(uuid));
            }).catch(function(err) {
              _this.logger.error("Error report failed: an unknown error occurred.", "message=".concat(err.message));
              (0, util_1$1.runAfterNotifyHandlers)(notice, _this.__afterNotifyHandlers, err);
            });
          });
          return true;
        };
        Client2.prototype.notifyAsync = function(noticeable, name, extra) {
          var _this = this;
          if (name === void 0) {
            name = void 0;
          }
          if (extra === void 0) {
            extra = void 0;
          }
          return new Promise(function(resolve, reject) {
            var applyAfterNotify = function(partialNotice) {
              var originalAfterNotify = partialNotice.afterNotify;
              partialNotice.afterNotify = function(err) {
                originalAfterNotify === null || originalAfterNotify === void 0 ? void 0 : originalAfterNotify.call(_this, err);
                if (err) {
                  return reject(err);
                }
                resolve();
              };
            };
            var objectToOverride;
            if (noticeable.afterNotify) {
              objectToOverride = noticeable;
            } else if (name && name.afterNotify) {
              objectToOverride = name;
            } else if (extra && extra.afterNotify) {
              objectToOverride = extra;
            } else if (name && typeof name === "object") {
              objectToOverride = name;
            } else if (extra) {
              objectToOverride = extra;
            } else {
              objectToOverride = name = {};
            }
            applyAfterNotify(objectToOverride);
            _this.notify(noticeable, name, extra);
          });
        };
        Client2.prototype.makeNotice = function(noticeable, name, extra) {
          if (name === void 0) {
            name = void 0;
          }
          if (extra === void 0) {
            extra = void 0;
          }
          var notice = (0, util_1$1.makeNotice)(noticeable);
          if (name && !(typeof name === "object")) {
            var n = String(name);
            name = { name: n };
          }
          if (name) {
            notice = (0, util_1$1.mergeNotice)(notice, name);
          }
          if (typeof extra === "object" && extra !== null) {
            notice = (0, util_1$1.mergeNotice)(notice, extra);
          }
          if ((0, util_1$1.objectIsEmpty)(notice)) {
            return null;
          }
          var context = this.__store.getContents("context");
          var noticeTags = this.__constructTags(notice.tags);
          var contextTags = this.__constructTags(context["tags"]);
          var configTags = this.__constructTags(this.config.tags);
          var tags = noticeTags.concat(contextTags).concat(configTags);
          var uniqueTags = tags.filter(function(item, index) {
            return tags.indexOf(item) === index;
          });
          notice = (0, util_1$1.merge)(notice, {
            name: notice.name || "Error",
            context: (0, util_1$1.merge)(context, notice.context),
            projectRoot: notice.projectRoot || this.config.projectRoot,
            environment: notice.environment || this.config.environment,
            component: notice.component || this.config.component,
            action: notice.action || this.config.action,
            revision: notice.revision || this.config.revision,
            tags: uniqueTags
          });
          var backtraceShift = 0;
          if (typeof notice.stack !== "string" || !notice.stack.trim()) {
            notice.stack = (0, util_1$1.generateStackTrace)();
            backtraceShift = 2;
          }
          notice.backtrace = (0, util_1$1.makeBacktrace)(notice.stack, backtraceShift);
          return notice;
        };
        Client2.prototype.addBreadcrumb = function(message, opts) {
          if (!this.config.breadcrumbsEnabled) {
            return;
          }
          opts = opts || {};
          var metadata = (0, util_1$1.shallowClone)(opts.metadata);
          var category = opts.category || "custom";
          var timestamp = new Date().toISOString();
          this.__store.addBreadcrumb({
            category,
            message,
            metadata,
            timestamp
          });
          return this;
        };
        Client2.prototype.__getBreadcrumbs = function() {
          return this.__store.getContents("breadcrumbs").slice();
        };
        Client2.prototype.__getContext = function() {
          return this.__store.getContents("context");
        };
        Client2.prototype.__developmentMode = function() {
          if (this.config.reportData === true) {
            return false;
          }
          return this.config.environment && this.config.developmentEnvironments.includes(this.config.environment);
        };
        Client2.prototype.__buildPayload = function(notice) {
          var headers = (0, util_1$1.filter)(notice.headers, this.config.filters) || {};
          var cgiData = (0, util_1$1.filter)(__assign(__assign({}, notice.cgiData), (0, util_1$1.formatCGIData)(headers, "HTTP_")), this.config.filters);
          return {
            notifier,
            breadcrumbs: {
              enabled: !!this.config.breadcrumbsEnabled,
              trail: notice.__breadcrumbs || []
            },
            error: {
              class: notice.name,
              message: notice.message,
              backtrace: notice.backtrace,
              fingerprint: notice.fingerprint,
              tags: notice.tags,
              causes: (0, util_1$1.getCauses)(notice)
            },
            request: {
              url: (0, util_1$1.filterUrl)(notice.url, this.config.filters),
              component: notice.component,
              action: notice.action,
              context: notice.context,
              cgi_data: cgiData,
              params: (0, util_1$1.filter)(notice.params, this.config.filters) || {},
              session: (0, util_1$1.filter)(notice.session, this.config.filters) || {}
            },
            server: {
              project_root: notice.projectRoot,
              environment_name: notice.environment,
              revision: notice.revision,
              hostname: this.config.hostname,
              time: new Date().toUTCString()
            },
            details: notice.details || {}
          };
        };
        Client2.prototype.__constructTags = function(tags) {
          if (!tags) {
            return [];
          }
          return tags.toString().split(TAG_SEPARATOR).filter(function(tag) {
            return NOT_BLANK.test(tag);
          });
        };
        return Client2;
      }();
      client.Client = Client;
      var types = {};
      Object.defineProperty(types, "__esModule", { value: true });
      (function(exports2) {
        var __createBinding2 = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
          if (k2 === void 0)
            k2 = k;
          var desc = Object.getOwnPropertyDescriptor(m, k);
          if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
            desc = { enumerable: true, get: function() {
              return m[k];
            } };
          }
          Object.defineProperty(o, k2, desc);
        } : function(o, m, k, k2) {
          if (k2 === void 0)
            k2 = k;
          o[k2] = m[k];
        });
        var __setModuleDefault2 = commonjsGlobal && commonjsGlobal.__setModuleDefault || (Object.create ? function(o, v) {
          Object.defineProperty(o, "default", { enumerable: true, value: v });
        } : function(o, v) {
          o["default"] = v;
        });
        var __exportStar = commonjsGlobal && commonjsGlobal.__exportStar || function(m, exports3) {
          for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p))
              __createBinding2(exports3, m, p);
        };
        var __importStar2 = commonjsGlobal && commonjsGlobal.__importStar || function(mod) {
          if (mod && mod.__esModule)
            return mod;
          var result = {};
          if (mod != null) {
            for (var k in mod)
              if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                __createBinding2(result, mod, k);
          }
          __setModuleDefault2(result, mod);
          return result;
        };
        Object.defineProperty(exports2, "__esModule", { value: true });
        exports2.Util = exports2.Types = exports2.Client = void 0;
        var client_1 = client;
        Object.defineProperty(exports2, "Client", { enumerable: true, get: function() {
          return client_1.Client;
        } });
        __exportStar(store, exports2);
        exports2.Types = __importStar2(types);
        exports2.Util = __importStar2(util$1);
      })(src);
      var util = {};
      Object.defineProperty(util, "__esModule", { value: true });
      util.preferCatch = util.encodeCookie = util.decodeCookie = util.localURLPathname = util.parseURL = util.nativeFetch = util.stringTextOfElement = util.stringSelectorOfElement = util.stringNameOfElement = void 0;
      function stringNameOfElement(element) {
        if (!element || !element.tagName) {
          return "";
        }
        var name = element.tagName.toLowerCase();
        if (name === "html") {
          return "";
        }
        if (element.id) {
          name += "#".concat(element.id);
        }
        var stringClassNames = element.getAttribute("class");
        if (stringClassNames) {
          stringClassNames.split(/\s+/).forEach(function(className) {
            name += ".".concat(className);
          });
        }
        ["alt", "name", "title", "type"].forEach(function(attrName) {
          var attr = element.getAttribute(attrName);
          if (attr) {
            name += "[".concat(attrName, '="').concat(attr, '"]');
          }
        });
        var siblings = getSiblings(element);
        if (siblings.length > 1) {
          name += ":nth-child(".concat(Array.prototype.indexOf.call(siblings, element) + 1, ")");
        }
        return name;
      }
      util.stringNameOfElement = stringNameOfElement;
      function stringSelectorOfElement(element) {
        var name = stringNameOfElement(element);
        if (element.parentNode && element.parentNode.tagName) {
          var parentName = stringSelectorOfElement(element.parentNode);
          if (parentName.length > 0) {
            return "".concat(parentName, " > ").concat(name);
          }
        }
        return name;
      }
      util.stringSelectorOfElement = stringSelectorOfElement;
      function stringTextOfElement(element) {
        var text = element.textContent || element.innerText || "";
        if (!text && (element.type === "submit" || element.type === "button")) {
          text = element.value;
        }
        return truncate(text.trim(), 300);
      }
      util.stringTextOfElement = stringTextOfElement;
      function nativeFetch() {
        if (!window.fetch) {
          return false;
        }
        if (isNative(window.fetch)) {
          return true;
        }
        try {
          var sandbox = document.createElement("iframe");
          sandbox.style.display = "none";
          document.head.appendChild(sandbox);
          var result = sandbox.contentWindow.fetch && isNative(sandbox.contentWindow.fetch);
          document.head.removeChild(sandbox);
          return result;
        } catch (err) {
          if (console && console.warn) {
            console.warn("failed to detect native fetch via iframe: " + err);
          }
        }
        return false;
      }
      util.nativeFetch = nativeFetch;
      function isNative(func) {
        return func.toString().indexOf("native") !== -1;
      }
      function parseURL(url) {
        var match = url.match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/) || {};
        return {
          protocol: match[2],
          host: match[4],
          pathname: match[5]
        };
      }
      util.parseURL = parseURL;
      function localURLPathname(url) {
        var parsed = parseURL(url);
        var parsedDocURL = parseURL(document.URL);
        if (!parsed.host || !parsed.protocol) {
          return parsed.pathname;
        }
        if (parsed.protocol === parsedDocURL.protocol && parsed.host === parsedDocURL.host) {
          return parsed.pathname;
        }
        return "".concat(parsed.protocol, "://").concat(parsed.host).concat(parsed.pathname);
      }
      util.localURLPathname = localURLPathname;
      function decodeCookie(string) {
        var result = {};
        string.split(/[;,]\s?/).forEach(function(pair) {
          var _a = pair.split("=", 2), key = _a[0], value = _a[1];
          result[key] = value;
        });
        return result;
      }
      util.decodeCookie = decodeCookie;
      function encodeCookie(object) {
        if (typeof object !== "object") {
          return void 0;
        }
        var cookies = [];
        for (var k in object) {
          cookies.push(k + "=" + object[k]);
        }
        return cookies.join(";");
      }
      util.encodeCookie = encodeCookie;
      function getSiblings(element) {
        try {
          var nodes = element.parentNode.childNodes;
          var siblings_1 = [];
          Array.prototype.forEach.call(nodes, function(node) {
            if (node.tagName && node.tagName === element.tagName) {
              siblings_1.push(node);
            }
          });
          return siblings_1;
        } catch (e) {
          return [];
        }
      }
      function truncate(string, length) {
        if (string.length > length) {
          string = string.substr(0, length) + "...";
        }
        return string;
      }
      util.preferCatch = function() {
        var preferCatch = true;
        if (!window.atob) {
          preferCatch = false;
        }
        if (window.ErrorEvent) {
          try {
            if (new window.ErrorEvent("").colno === 0) {
              preferCatch = false;
            }
          } catch (_e) {
          }
        }
        return preferCatch;
      }();
      var onerror = {};
      Object.defineProperty(onerror, "__esModule", { value: true });
      onerror.onError = onerror.ignoreNextOnError = void 0;
      var core_1$5 = src;
      var instrument$4 = core_1$5.Util.instrument, makeNotice = core_1$5.Util.makeNotice;
      var ignoreOnError = 0;
      var currentTimeout;
      function ignoreNextOnError() {
        ignoreOnError += 1;
        clearTimeout(currentTimeout);
        currentTimeout = setTimeout(function() {
          ignoreOnError = 0;
        });
      }
      onerror.ignoreNextOnError = ignoreNextOnError;
      function onError(_window) {
        if (_window === void 0) {
          _window = window;
        }
        return {
          load: function(client2) {
            instrument$4(_window, "onerror", function(original) {
              var onerror2 = function(msg, url, line, col, err) {
                client2.logger.debug("window.onerror callback invoked", arguments);
                if (ignoreOnError > 0) {
                  client2.logger.debug("Ignoring window.onerror (error likely reported earlier)", arguments);
                  ignoreOnError -= 1;
                  return;
                }
                if (line === 0 && /Script error\.?/.test(msg)) {
                  if (client2.config.enableUncaught) {
                    client2.logger.warn("Ignoring cross-domain script error: enable CORS to track these types of errors", arguments);
                  }
                  return;
                }
                var notice = makeNotice(err);
                if (!notice.name) {
                  notice.name = "window.onerror";
                }
                if (!notice.message) {
                  notice.message = msg;
                }
                if (!notice.stack) {
                  notice.stack = [notice.message, "\n    at ? (", url || "unknown", ":", line || 0, ":", col || 0, ")"].join("");
                }
                client2.addBreadcrumb(notice.name === "window.onerror" || !notice.name ? "window.onerror" : "window.onerror: ".concat(notice.name), {
                  category: "error",
                  metadata: {
                    name: notice.name,
                    message: notice.message,
                    stack: notice.stack
                  }
                });
                if (client2.config.enableUncaught) {
                  client2.notify(notice);
                }
              };
              return function(msg, url, line, col, err) {
                onerror2(msg, url, line, col, err);
                if (typeof original === "function") {
                  return original.apply(window, arguments);
                }
                return false;
              };
            });
          }
        };
      }
      onerror.onError = onError;
      var onunhandledrejection = {};
      Object.defineProperty(onunhandledrejection, "__esModule", { value: true });
      var core_1$4 = src;
      var instrument$3 = core_1$4.Util.instrument;
      function default_1$3(_window) {
        if (_window === void 0) {
          _window = window;
        }
        return {
          load: function(client2) {
            if (!client2.config.enableUnhandledRejection) {
              return;
            }
            instrument$3(_window, "onunhandledrejection", function(original) {
              function onunhandledrejection2(promiseRejectionEvent) {
                var _a;
                client2.logger.debug("window.onunhandledrejection callback invoked", arguments);
                if (!client2.config.enableUnhandledRejection) {
                  return;
                }
                var reason = promiseRejectionEvent.reason;
                if (reason instanceof Error) {
                  var fileName = "unknown";
                  var lineNumber = 0;
                  var stackFallback = "".concat(reason.message, "\n    at ? (").concat(fileName, ":").concat(lineNumber, ")");
                  var stack = reason.stack || stackFallback;
                  var err = {
                    name: reason.name,
                    message: "UnhandledPromiseRejectionWarning: ".concat(reason),
                    stack
                  };
                  client2.addBreadcrumb("window.onunhandledrejection: ".concat(err.name), {
                    category: "error",
                    metadata: err
                  });
                  client2.notify(err);
                  return;
                }
                var message = typeof reason === "string" ? reason : (_a = JSON.stringify(reason)) !== null && _a !== void 0 ? _a : "Unspecified reason";
                client2.notify({
                  name: "window.onunhandledrejection",
                  message: "UnhandledPromiseRejectionWarning: ".concat(message)
                });
              }
              return function(promiseRejectionEvent) {
                onunhandledrejection2(promiseRejectionEvent);
                if (typeof original === "function") {
                  original.apply(this, arguments);
                }
              };
            });
          }
        };
      }
      onunhandledrejection.default = default_1$3;
      var breadcrumbs = {};
      Object.defineProperty(breadcrumbs, "__esModule", { value: true });
      var core_1$3 = src;
      var util_1 = util;
      var sanitize$1 = core_1$3.Util.sanitize, instrument$2 = core_1$3.Util.instrument;
      function default_1$2(_window) {
        if (_window === void 0) {
          _window = window;
        }
        return {
          load: function(client2) {
            function breadcrumbsEnabled(type) {
              if (client2.config.breadcrumbsEnabled === true) {
                return true;
              }
              if (type) {
                return client2.config.breadcrumbsEnabled[type] === true;
              }
              return client2.config.breadcrumbsEnabled !== false;
            }
            (function() {
              if (!breadcrumbsEnabled("console")) {
                return;
              }
              function inspectArray(obj) {
                if (!Array.isArray(obj)) {
                  return "";
                }
                return obj.map(function(value) {
                  try {
                    return String(value);
                  } catch (e) {
                    return "[unknown]";
                  }
                }).join(" ");
              }
              ["debug", "info", "warn", "error", "log"].forEach(function(level) {
                instrument$2(_window.console, level, function(original) {
                  return function() {
                    var args = Array.prototype.slice.call(arguments);
                    var message = inspectArray(args);
                    var opts = {
                      category: "log",
                      metadata: {
                        level,
                        arguments: sanitize$1(args, 3)
                      }
                    };
                    client2.addBreadcrumb(message, opts);
                    if (typeof original === "function") {
                      Function.prototype.apply.call(original, _window.console, arguments);
                    }
                  };
                });
              });
            })();
            (function() {
              if (!breadcrumbsEnabled("dom")) {
                return;
              }
              _window.addEventListener("click", function(event) {
                var message, selector, text;
                try {
                  message = (0, util_1.stringNameOfElement)(event.target);
                  selector = (0, util_1.stringSelectorOfElement)(event.target);
                  text = (0, util_1.stringTextOfElement)(event.target);
                } catch (e) {
                  message = "UI Click";
                  selector = "[unknown]";
                  text = "[unknown]";
                }
                if (message.length === 0) {
                  return;
                }
                client2.addBreadcrumb(message, {
                  category: "ui.click",
                  metadata: {
                    selector,
                    text,
                    event
                  }
                });
              }, true);
            })();
            (function() {
              if (!breadcrumbsEnabled("network")) {
                return;
              }
              instrument$2(XMLHttpRequest.prototype, "open", function(original) {
                return function() {
                  var xhr = this;
                  var url = arguments[1];
                  var method = typeof arguments[0] === "string" ? arguments[0].toUpperCase() : arguments[0];
                  var message = "".concat(method, " ").concat((0, util_1.localURLPathname)(url));
                  this.__hb_xhr = {
                    type: "xhr",
                    method,
                    url,
                    message
                  };
                  if (typeof original === "function") {
                    original.apply(xhr, arguments);
                  }
                };
              });
              instrument$2(XMLHttpRequest.prototype, "send", function(original) {
                return function() {
                  var xhr = this;
                  function onreadystatechangeHandler() {
                    if (xhr.readyState === 4) {
                      var message = void 0;
                      if (xhr.__hb_xhr) {
                        xhr.__hb_xhr.status_code = xhr.status;
                        message = xhr.__hb_xhr.message;
                        delete xhr.__hb_xhr.message;
                      }
                      client2.addBreadcrumb(message || "XMLHttpRequest", {
                        category: "request",
                        metadata: xhr.__hb_xhr
                      });
                    }
                  }
                  if ("onreadystatechange" in xhr && typeof xhr.onreadystatechange === "function") {
                    instrument$2(xhr, "onreadystatechange", function(original2) {
                      return function() {
                        onreadystatechangeHandler();
                        if (typeof original2 === "function") {
                          original2.apply(this, arguments);
                        }
                      };
                    });
                  } else {
                    xhr.onreadystatechange = onreadystatechangeHandler;
                  }
                  if (typeof original === "function") {
                    original.apply(xhr, arguments);
                  }
                };
              });
            })();
            (function() {
              if (!breadcrumbsEnabled("network")) {
                return;
              }
              if (!(0, util_1.nativeFetch)()) {
                return;
              }
              instrument$2(_window, "fetch", function(original) {
                return function() {
                  var input = arguments[0];
                  var method = "GET";
                  var url;
                  if (typeof input === "string") {
                    url = input;
                  } else if ("Request" in _window && input instanceof Request) {
                    url = input.url;
                    if (input.method) {
                      method = input.method;
                    }
                  } else {
                    url = String(input);
                  }
                  if (arguments[1] && arguments[1].method) {
                    method = arguments[1].method;
                  }
                  if (typeof method === "string") {
                    method = method.toUpperCase();
                  }
                  var message = "".concat(method, " ").concat((0, util_1.localURLPathname)(url));
                  var metadata = {
                    type: "fetch",
                    method,
                    url
                  };
                  return original.apply(this, arguments).then(function(response) {
                    metadata["status_code"] = response.status;
                    client2.addBreadcrumb(message, {
                      category: "request",
                      metadata
                    });
                    return response;
                  }).catch(function(error) {
                    client2.addBreadcrumb("fetch error", {
                      category: "error",
                      metadata
                    });
                    throw error;
                  });
                };
              });
            })();
            (function() {
              if (!breadcrumbsEnabled("navigation")) {
                return;
              }
              var lastHref = _window.location.href;
              function recordUrlChange(from, to) {
                lastHref = to;
                client2.addBreadcrumb("Page changed", {
                  category: "navigation",
                  metadata: {
                    from,
                    to
                  }
                });
              }
              instrument$2(_window, "onpopstate", function(original) {
                return function() {
                  recordUrlChange(lastHref, _window.location.href);
                  if (original) {
                    return original.apply(this, arguments);
                  }
                };
              });
              function historyWrapper(original) {
                return function() {
                  var url = arguments.length > 2 ? arguments[2] : void 0;
                  if (url) {
                    recordUrlChange(lastHref, String(url));
                  }
                  return original.apply(this, arguments);
                };
              }
              instrument$2(_window.history, "pushState", historyWrapper);
              instrument$2(_window.history, "replaceState", historyWrapper);
            })();
          }
        };
      }
      breadcrumbs.default = default_1$2;
      var timers = {};
      Object.defineProperty(timers, "__esModule", { value: true });
      var core_1$2 = src;
      var instrument$1 = core_1$2.Util.instrument;
      function default_1$1(_window) {
        if (_window === void 0) {
          _window = window;
        }
        return {
          load: function(client2) {
            (function() {
              function instrumentTimer(wrapOpts) {
                return function(original) {
                  return function(func, delay) {
                    if (typeof func === "function") {
                      var args_1 = Array.prototype.slice.call(arguments, 2);
                      func = client2.__wrap(func, wrapOpts);
                      return original(function() {
                        func.apply(void 0, args_1);
                      }, delay);
                    } else {
                      return original(func, delay);
                    }
                  };
                };
              }
              instrument$1(_window, "setTimeout", instrumentTimer({ component: "setTimeout" }));
              instrument$1(_window, "setInterval", instrumentTimer({ component: "setInterval" }));
            })();
          }
        };
      }
      timers.default = default_1$1;
      var event_listeners = {};
      Object.defineProperty(event_listeners, "__esModule", { value: true });
      var core_1$1 = src;
      var instrument = core_1$1.Util.instrument;
      function default_1(_window) {
        if (_window === void 0) {
          _window = window;
        }
        return {
          load: function(client2) {
            var targets = ["EventTarget", "Window", "Node", "ApplicationCache", "AudioTrackList", "ChannelMergerNode", "CryptoOperation", "EventSource", "FileReader", "HTMLUnknownElement", "IDBDatabase", "IDBRequest", "IDBTransaction", "KeyOperation", "MediaController", "MessagePort", "ModalWindow", "Notification", "SVGElementInstance", "Screen", "TextTrack", "TextTrackCue", "TextTrackList", "WebSocket", "WebSocketWorker", "Worker", "XMLHttpRequest", "XMLHttpRequestEventTarget", "XMLHttpRequestUpload"];
            targets.forEach(function(prop) {
              var prototype = _window[prop] && _window[prop].prototype;
              if (prototype && Object.prototype.hasOwnProperty.call(prototype, "addEventListener")) {
                instrument(prototype, "addEventListener", function(original) {
                  var wrapOpts = { component: "".concat(prop, ".prototype.addEventListener") };
                  return function(type, listener, useCapture, wantsUntrusted) {
                    try {
                      if (listener && listener.handleEvent != null) {
                        listener.handleEvent = client2.__wrap(listener.handleEvent, wrapOpts);
                      }
                    } catch (e) {
                      client2.logger.error(e);
                    }
                    return original.call(this, type, client2.__wrap(listener, wrapOpts), useCapture, wantsUntrusted);
                  };
                });
                instrument(prototype, "removeEventListener", function(original) {
                  return function(type, listener, useCapture, wantsUntrusted) {
                    original.call(this, type, listener, useCapture, wantsUntrusted);
                    return original.call(this, type, client2.__wrap(listener), useCapture, wantsUntrusted);
                  };
                });
              }
            });
          }
        };
      }
      event_listeners.default = default_1;
      var transport = {};
      Object.defineProperty(transport, "__esModule", { value: true });
      transport.BrowserTransport = void 0;
      var core_1 = src;
      var sanitize = core_1.Util.sanitize;
      var BrowserTransport = function() {
        function BrowserTransport2() {
        }
        BrowserTransport2.prototype.send = function(options, payload) {
          return new Promise(function(resolve, reject) {
            try {
              var x_1 = new XMLHttpRequest();
              x_1.open(options.method, options.endpoint, options.async);
              if (Object.keys(options.headers || []).length) {
                for (var i in options.headers) {
                  if (typeof options.headers[i] !== "undefined") {
                    x_1.setRequestHeader(i, String(options.headers[i]));
                  }
                }
              }
              x_1.send(payload ? JSON.stringify(sanitize(payload, options.maxObjectDepth)) : void 0);
              x_1.onload = function() {
                return resolve({ statusCode: x_1.status, body: x_1.response });
              };
            } catch (err) {
              reject(err);
            }
          });
        };
        return BrowserTransport2;
      }();
      transport.BrowserTransport = BrowserTransport;
      (function(exports2) {
        var __extends = commonjsGlobal && commonjsGlobal.__extends || function() {
          var extendStatics = function(d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
              d2.__proto__ = b2;
            } || function(d2, b2) {
              for (var p in b2)
                if (Object.prototype.hasOwnProperty.call(b2, p))
                  d2[p] = b2[p];
            };
            return extendStatics(d, b);
          };
          return function(d, b) {
            if (typeof b !== "function" && b !== null)
              throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() {
              this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
          };
        }();
        var __assign2 = commonjsGlobal && commonjsGlobal.__assign || function() {
          __assign2 = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                  t[p] = s[p];
            }
            return t;
          };
          return __assign2.apply(this, arguments);
        };
        var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
          return mod && mod.__esModule ? mod : { "default": mod };
        };
        Object.defineProperty(exports2, "__esModule", { value: true });
        exports2.Types = void 0;
        var core_12 = src;
        var util_12 = util;
        var onerror_1 = onerror;
        var onunhandledrejection_1 = __importDefault(onunhandledrejection);
        var breadcrumbs_1 = __importDefault(breadcrumbs);
        var timers_1 = __importDefault(timers);
        var event_listeners_1 = __importDefault(event_listeners);
        var transport_1 = transport;
        var merge2 = core_12.Util.merge, filter2 = core_12.Util.filter, objectIsExtensible2 = core_12.Util.objectIsExtensible;
        var Honeybadger2 = function(_super) {
          __extends(Honeybadger3, _super);
          function Honeybadger3(opts) {
            if (opts === void 0) {
              opts = {};
            }
            var _this = _super.call(this, __assign2({ async: true, maxErrors: null, projectRoot: window.location.protocol + "//" + window.location.host }, opts), new transport_1.BrowserTransport()) || this;
            _this.__errorsSent = 0;
            _this.__lastWrapErr = void 0;
            _this.__beforeNotifyHandlers = [
              function(notice) {
                if (_this.__exceedsMaxErrors()) {
                  _this.logger.debug("Dropping notice: max errors exceeded", notice);
                  return false;
                }
                if (notice && !notice.url) {
                  notice.url = document.URL;
                }
                _this.__incrementErrorsCount();
                return true;
              }
            ];
            return _this;
          }
          Honeybadger3.prototype.configure = function(opts) {
            if (opts === void 0) {
              opts = {};
            }
            return _super.prototype.configure.call(this, opts);
          };
          Honeybadger3.prototype.resetMaxErrors = function() {
            return this.__errorsSent = 0;
          };
          Honeybadger3.prototype.factory = function(opts) {
            return new Honeybadger3(opts);
          };
          Honeybadger3.prototype.checkIn = function(_id) {
            throw new Error("Honeybadger.checkIn() is not supported on the browser");
          };
          Honeybadger3.prototype.__buildPayload = function(notice) {
            var cgiData = {
              HTTP_USER_AGENT: void 0,
              HTTP_REFERER: void 0,
              HTTP_COOKIE: void 0
            };
            cgiData.HTTP_USER_AGENT = navigator.userAgent;
            if (document.referrer.match(/\S/)) {
              cgiData.HTTP_REFERER = document.referrer;
            }
            var cookiesObject;
            if (typeof notice.cookies === "string") {
              cookiesObject = (0, util_12.decodeCookie)(notice.cookies);
            } else {
              cookiesObject = notice.cookies;
            }
            if (cookiesObject) {
              cgiData.HTTP_COOKIE = (0, util_12.encodeCookie)(filter2(cookiesObject, this.config.filters));
            }
            var payload = _super.prototype.__buildPayload.call(this, notice);
            payload.request.cgi_data = merge2(cgiData, payload.request.cgi_data);
            return payload;
          };
          Honeybadger3.prototype.__wrap = function(f, opts) {
            if (opts === void 0) {
              opts = {};
            }
            var func = f;
            if (!opts) {
              opts = {};
            }
            try {
              if (typeof func !== "function") {
                return func;
              }
              if (!objectIsExtensible2(func)) {
                return func;
              }
              if (!func.___hb) {
                var client_1 = this;
                func.___hb = function() {
                  if (util_12.preferCatch) {
                    try {
                      return func.apply(this, arguments);
                    } catch (err) {
                      if (client_1.__lastWrapErr === err) {
                        throw err;
                      }
                      client_1.__lastWrapErr = err;
                      (0, onerror_1.ignoreNextOnError)();
                      client_1.addBreadcrumb(opts.component ? "".concat(opts.component, ": ").concat(err.name) : err.name, {
                        category: "error",
                        metadata: {
                          message: err.message,
                          name: err.name,
                          stack: err.stack
                        }
                      });
                      if (client_1.config.enableUncaught) {
                        client_1.notify(err);
                      }
                      throw err;
                    }
                  } else {
                    return func.apply(this, arguments);
                  }
                };
              }
              func.___hb.___hb = func.___hb;
              return func.___hb;
            } catch (_e) {
              return func;
            }
          };
          Honeybadger3.prototype.__incrementErrorsCount = function() {
            return this.__errorsSent++;
          };
          Honeybadger3.prototype.__exceedsMaxErrors = function() {
            return this.config.maxErrors && this.__errorsSent >= this.config.maxErrors;
          };
          return Honeybadger3;
        }(core_12.Client);
        var core_2 = src;
        Object.defineProperty(exports2, "Types", { enumerable: true, get: function() {
          return core_2.Types;
        } });
        exports2.default = new Honeybadger2({
          __plugins: [
            (0, onerror_1.onError)(),
            (0, onunhandledrejection_1.default)(),
            (0, timers_1.default)(),
            (0, event_listeners_1.default)(),
            (0, breadcrumbs_1.default)()
          ]
        });
      })(browser$1);
      var browser = /* @__PURE__ */ getDefaultExportFromCjs(browser$1);
      return browser;
    });
  }
});

// src/generated/env.ts
var env_default = {
  "CDN": "https://multipay.komoju.com",
  "ENV": "development",
  "HONEYBADGER_API_KEY": "",
  "GIT_REV": "99ad2eb29ce6530dedfe3a0ec34aea970dbaa78a"
};

// src/extras/error-reporting/module.ts
var Honeybadger = require_honeybadger();
var initialized = false;
var reportError = (error, context) => {
  if (window.komojuErrorReporting === false)
    return;
  if (!initialized)
    initialize();
  console.error(error, context);
  Honeybadger.setContext(context);
  Honeybadger.notify(error);
};
function initialize() {
  Honeybadger.configure({
    apiKey: env_default.HONEYBADGER_API_KEY,
    environment: env_default.ENV,
    revision: env_default.GIT_REV,
    filters: ["number", "cvc", "verification_value"],
    enableUncaught: false
  });
  initialized = true;
}
export {
  reportError
};
//# sourceMappingURL=module.js.map
