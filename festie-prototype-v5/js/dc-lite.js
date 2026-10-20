/*
 * dc-lite.js
 * Festie 프로토타입을 캔버스 밖(GitHub Pages, 로컬 파일)에서 돌리기 위한 작은 런타임.
 *
 * 디자인 캔버스의 컴포넌트 문법을 그대로 해석해서 Preact로 그립니다.
 *   {{ path }}                  값 넣기 (점으로 이어진 경로, true/false/숫자 리터럴)
 *   <sc-if value="{{ x }}">     x가 참일 때만 그리기
 *   <sc-for list="{{ xs }}" as="item">   배열 반복 ({{ item.* }}, {{ $index }})
 *   onClick / onChange / onKeyDown="{{ fn }}"   이벤트
 *   class Component extends DCLogic { renderVals() { ... } }
 *
 * 의존성: Preact 10 (vendor/preact.umd.js, 전역 preact)
 */
(function () {
  'use strict';

  var preact = window.preact;
  if (!preact) throw new Error('dc-lite: Preact가 먼저 로드되어야 해요 (vendor/preact.umd.js)');
  var h = preact.h;

  var HOLE = /\{\{\s*([^}]*?)\s*\}\}/g;
  var WHOLE = /^\s*\{\{\s*([^}]*?)\s*\}\}\s*$/;
  var NUM = /^-?\d+(\.\d+)?$/;

  // ---------- 값 찾기 ----------
  function lookup(expr, scope) {
    if (expr === 'true') return true;
    if (expr === 'false') return false;
    if (expr === 'null') return null;
    if (expr === 'undefined' || expr === '') return undefined;
    if (NUM.test(expr)) return Number(expr);
    var q = expr.charAt(0);
    if ((q === '"' || q === "'") && expr.charAt(expr.length - 1) === q) return expr.slice(1, -1);
    var parts = expr.split('.');
    var v = scope;
    for (var i = 0; i < parts.length; i++) {
      if (v == null) return undefined;
      v = v[parts[i]];
    }
    return v;
  }

  function interpolate(str, scope) {
    return str.replace(HOLE, function (_, expr) {
      var v = lookup(expr, scope);
      return v == null ? '' : String(v);
    });
  }

  // 값 하나 또는 문자열 보간을 미리 정해 두는 작은 컴파일러
  function compileValue(str) {
    var m = WHOLE.exec(str);
    if (m) { var expr = m[1]; return function (scope) { return lookup(expr, scope); }; }
    if (str.indexOf('{{') === -1) return function () { return str; };
    return function (scope) { return interpolate(str, scope); };
  }

  // ---------- 이벤트 이름 ----------
  // HTML 파서가 속성 이름을 소문자로 바꾸므로 여기서 Preact 이벤트로 되돌립니다.
  // 입력창의 onChange는 React처럼 글자를 칠 때마다 불리도록 input 이벤트로 연결합니다.
  function eventProp(attrName, tag) {
    var ev = attrName.slice(2).toLowerCase();
    if (ev === 'change' && (tag === 'input' || tag === 'textarea')) ev = 'input';
    return 'on' + ev;
  }

  // ---------- 템플릿 컴파일 ----------
  function compileChildren(nodeList) {
    var fns = [];
    for (var i = 0; i < nodeList.length; i++) {
      var fn = compileNode(nodeList[i]);
      if (fn) fns.push(fn);
    }
    return function (scope) {
      var out = [];
      for (var i = 0; i < fns.length; i++) {
        var r = fns[i](scope);
        if (r == null || r === false) continue;
        if (Array.isArray(r)) { for (var j = 0; j < r.length; j++) out.push(r[j]); }
        else out.push(r);
      }
      return out;
    };
  }

  function compileNode(node) {
    if (node.nodeType === 3) {
      var text = node.nodeValue;
      if (text.indexOf('{{') === -1) return function () { return text; };
      return function (scope) { return interpolate(text, scope); };
    }
    if (node.nodeType !== 1) return null;

    var tag = node.localName;

    if (tag === 'sc-if') {
      var cond = compileValue(node.getAttribute('value') || '');
      var body = compileChildren(node.childNodes);
      return function (scope) { return cond(scope) ? body(scope) : null; };
    }

    if (tag === 'sc-for') {
      var list = compileValue(node.getAttribute('list') || '');
      var as = node.getAttribute('as') || 'item';
      var each = compileChildren(node.childNodes);
      return function (scope) {
        var xs = list(scope);
        if (!xs || !xs.length) return null;
        var out = [];
        for (var i = 0; i < xs.length; i++) {
          var inner = Object.create(scope);
          inner[as] = xs[i];
          inner.$index = i;
          var r = each(inner);
          for (var j = 0; j < r.length; j++) out.push(r[j]);
        }
        return out;
      };
    }

    if (tag === 'helmet') return null;

    var attrs = [];
    for (var a = 0; a < node.attributes.length; a++) {
      var at = node.attributes[a];
      var name = at.name;
      if (name.indexOf('hint-') === 0) continue;
      if (/^on[a-z]/i.test(name)) {
        attrs.push({ name: eventProp(name, tag), get: compileValue(at.value), event: true });
        continue;
      }
      attrs.push({ name: name, get: compileValue(at.value) });
    }
    var kids = compileChildren(node.childNodes);

    return function (scope) {
      var props = {};
      for (var i = 0; i < attrs.length; i++) {
        var v = attrs[i].get(scope);
        if (attrs[i].event) { if (typeof v === 'function') props[attrs[i].name] = v; continue; }
        if (v === undefined || v === null) continue;
        props[attrs[i].name] = v;
      }
      return h.apply(null, [tag, props].concat(kids(scope)));
    };
  }

  // ---------- 컴포넌트 ----------
  function DCLogic(props) { preact.Component.call(this, props); }
  DCLogic.prototype = Object.create(preact.Component.prototype);
  DCLogic.prototype.constructor = DCLogic;
  DCLogic.prototype.renderVals = function () { return {}; };
  DCLogic.prototype.render = function () {
    var tpl = this.constructor.__template;
    var out = tpl(this.renderVals() || {});
    return out.length === 1 ? out[0] : h(preact.Fragment, null, out);
  };

  /**
   * mount({ template, component, target, props })
   *   template  : <template> 요소 (안에 화면 마크업)
   *   component : class Component extends DCLogic
   *   target    : 그려 넣을 요소
   *   props     : 컴포넌트에 넘길 값 (예: { start: 'summary' })
   */
  function mount(opts) {
    var root = opts.template.content || opts.template;
    opts.component.__template = compileChildren(root.childNodes);
    preact.render(h(opts.component, opts.props || {}), opts.target);
  }

  window.DCLogic = DCLogic;
  window.dcLite = { mount: mount };
})();
