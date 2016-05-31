define(['AbstractView', 'cHighlight'], function (AbstractView, cHighlight) {


  var hljs = new cHighlight();

  hljs.registerLanguage("javascript", function (a) {
    return { aliases: ["js"], k: { keyword: "in if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const class", literal: "true false null undefined NaN Infinity", built_in: "eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Error EvalError InternalError RangeError ReferenceError StopIteration SyntaxError TypeError URIError Number Math Date String RegExp Array Float32Array Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require" }, c: [{ cN: "pi", b: /^\s*('|")use strict('|")/, r: 10 }, a.ASM, a.QSM, a.CLCM, a.CBLCLM, a.CNM, { b: "(" + a.RSR + "|\\b(case|return|throw)\\b)\\s*", k: "return throw case", c: [a.CLCM, a.CBLCLM, a.REGEXP_MODE, { b: /</, e: />;/, r: 0, sL: "xml" }], r: 0 }, { cN: "function", bK: "function", e: /\{/, c: [a.inherit(a.TM, { b: /[A-Za-z$_][0-9A-Za-z$_]*/ }), { cN: "params", b: /\(/, e: /\)/, c: [a.CLCM, a.CBLCLM], i: /["'\(]/ }], i: /\[|%/ }, { b: /\$[(.]/ }, { b: "\\." + a.IR, r: 0 }] }
  });
  hljs.registerLanguage("xml", function (a) {
    var c = "[A-Za-z0-9\\._:-]+";
    var d = { b: /<\?(php)?(?!\w)/, e: /\?>/, sL: "php", subLanguageMode: "continuous" };
    var b = { eW: true, i: /</, r: 0, c: [d, { cN: "attribute", b: c, r: 0 }, { b: "=", r: 0, c: [{ cN: "value", v: [{ b: /"/, e: /"/ }, { b: /'/, e: /'/ }, { b: /[^\s\/>]+/ }] }] }] };
    return { aliases: ["html"], cI: true, c: [{ cN: "doctype", b: "<!DOCTYPE", e: ">", r: 10, c: [{ b: "\\[", e: "\\]" }] }, { cN: "comment", b: "<!--", e: "-->", r: 10 }, { cN: "cdata", b: "<\\!\\[CDATA\\[", e: "\\]\\]>", r: 10 }, { cN: "tag", b: "<style(?=\\s|>|$)", e: ">", k: { title: "style" }, c: [b], starts: { e: "</style>", rE: true, sL: "css" } }, { cN: "tag", b: "<script(?=\\s|>|$)", e: ">", k: { title: "script" }, c: [b], starts: { e: "<\/script>", rE: true, sL: "javascript" } }, { b: "<%", e: "%>", sL: "vbscript" }, d, { cN: "pi", b: /<\?\w+/, e: /\?>/, r: 10 }, { cN: "tag", b: "</?", e: "/?>", c: [{ cN: "title", b: "[^ /><]+", r: 0 }, b] }] }
  });
  hljs.registerLanguage("markdown", function (a) {
    return { c: [{ cN: "header", v: [{ b: "^#{1,6}", e: "$" }, { b: "^.+?\\n[=-]{2,}$" }] }, { b: "<", e: ">", sL: "xml", r: 0 }, { cN: "bullet", b: "^([*+-]|(\\d+\\.))\\s+" }, { cN: "strong", b: "[*_]{2}.+?[*_]{2}" }, { cN: "emphasis", v: [{ b: "\\*.+?\\*" }, { b: "_.+?_", r: 0 }] }, { cN: "blockquote", b: "^>\\s+", e: "$" }, { cN: "code", v: [{ b: "`.+?`" }, { b: "^( {4}|\t)", e: "$", r: 0 }] }, { cN: "horizontal_rule", b: "^[-\\*]{3,}", e: "$" }, { b: "\\[.+?\\][\\(\\[].+?[\\)\\]]", rB: true, c: [{ cN: "link_label", b: "\\[", e: "\\]", eB: true, rE: true, r: 0 }, { cN: "link_url", b: "\\]\\(", e: "\\)", eB: true, eE: true }, { cN: "link_reference", b: "\\]\\[", e: "\\]", eB: true, eE: true, }], r: 10 }, { b: "^\\[.+\\]:", e: "$", rB: true, c: [{ cN: "link_reference", b: "\\[", e: "\\]", eB: true, eE: true }, { cN: "link_url", b: "\\s", e: "$" }] }] }
  });
  hljs.registerLanguage("css", function (a) {
    var b = "[a-zA-Z-][a-zA-Z0-9_-]*";
    var c = { cN: "function", b: b + "\\(", e: "\\)", c: ["self", a.NM, a.ASM, a.QSM] };
    return { cI: true, i: "[=/|']", c: [a.CBLCLM, { cN: "id", b: "\\#[A-Za-z0-9_-]+" }, { cN: "class", b: "\\.[A-Za-z0-9_-]+", r: 0 }, { cN: "attr_selector", b: "\\[", e: "\\]", i: "$" }, { cN: "pseudo", b: ":(:)?[a-zA-Z0-9\\_\\-\\+\\(\\)\\\"\\']+" }, { cN: "at_rule", b: "@(font-face|page)", l: "[a-z-]+", k: "font-face page" }, { cN: "at_rule", b: "@", e: "[{;]", c: [{ cN: "keyword", b: /\S+/ }, { b: /\s/, eW: true, eE: true, r: 0, c: [c, a.ASM, a.QSM, a.NM] }] }, { cN: "tag", b: b, r: 0 }, { cN: "rules", b: "{", e: "}", i: "[^\\s]", r: 0, c: [a.CBLCLM, { cN: "rule", b: "[^\\s]", rB: true, e: ";", eW: true, c: [{ cN: "attribute", b: "[A-Z\\_\\.\\-]+", e: ":", eE: true, i: "[^\\s]", starts: { cN: "value", eW: true, eE: true, c: [c, a.NM, a.QSM, a.ASM, a.CBLCLM, { cN: "hexcolor", b: "#[0-9A-Fa-f]+" }, { cN: "important", b: "!important" }] } }] }] }] }
  });
  hljs.registerLanguage("json", function (a) {
    var e = { literal: "true false null" };
    var d = [a.QSM, a.CNM];
    var c = { cN: "value", e: ",", eW: true, eE: true, c: d, k: e };
    var b = { b: "{", e: "}", c: [{ cN: "attribute", b: '\\s*"', e: '"\\s*:\\s*', eB: true, eE: true, c: [a.BE], i: "\\n", starts: c }], i: "\\S" };
    var f = { b: "\\[", e: "\\]", c: [a.inherit(c, { cN: null })], i: "\\S" };
    d.splice(d.length, 0, b, f);
    return { c: d, k: e, i: "\\S" }
  });

  return _.inherit(AbstractView, {

    propertys: function ($super) {
      $super();

      //当前频道
      this.project = 'demo';
    },

    addEvent: function ($super) {
      $super();

      this.on('onShow', function () {
        //格式化其中的代码
        this.formatCode();
      });

    },

    formatCode: function () {
      window.sss = this;
      hljs.initHighlighting(this);
    }

  });

});
