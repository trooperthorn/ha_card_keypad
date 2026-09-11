//#region node_modules/@lit/reactive-element/css-tag.js
var e = globalThis, t = e.ShadowRoot && (e.ShadyCSS === void 0 || e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, n = Symbol(), r = /* @__PURE__ */ new WeakMap(), i = class {
	constructor(e, t, r) {
		if (this._$cssResult$ = !0, r !== n) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, n = this.t;
		if (t && e === void 0) {
			let t = n !== void 0 && n.length === 1;
			t && (e = r.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), t && r.set(n, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, a = (e) => new i(typeof e == "string" ? e : e + "", void 0, n), o = (e, ...t) => new i(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, n), s = (n, r) => {
	if (t) n.adoptedStyleSheets = r.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let t of r) {
		let r = document.createElement("style"), i = e.litNonce;
		i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
	}
}, c = t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return a(t);
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: f, getOwnPropertySymbols: p, getPrototypeOf: m } = Object, h = globalThis, g = h.trustedTypes, ee = g ? g.emptyScript : "", te = h.reactiveElementPolyfillSupport, _ = (e, t) => e, v = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? ee : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, y = (e, t) => !l(e, t), ne = {
	attribute: !0,
	type: String,
	converter: v,
	reflect: !1,
	useDefault: !1,
	hasChanged: y
};
Symbol.metadata ??= Symbol("metadata"), h.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var b = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = ne) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && u(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = d(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? ne;
	}
	static _$Ei() {
		if (this.hasOwnProperty(_("elementProperties"))) return;
		let e = m(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(_("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(_("properties"))) {
			let e = this.properties, t = [...f(e), ...p(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(1 / 0).reverse());
			for (let e of n) t.unshift(c(e));
		} else e !== void 0 && t.push(c(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return s(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? v : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? v : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? y)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(e) {
		return !0;
	}
	update(e) {
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[_("elementProperties")] = /* @__PURE__ */ new Map(), b[_("finalized")] = /* @__PURE__ */ new Map(), te?.({ ReactiveElement: b }), (h.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var x = globalThis, S = (e) => e, C = x.trustedTypes, w = C ? C.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, T = "$lit$", E = `lit$${Math.random().toFixed(9).slice(2)}$`, re = "?" + E, ie = `<${re}>`, D = document, O = () => D.createComment(""), k = (e) => e === null || typeof e != "object" && typeof e != "function", A = Array.isArray, ae = (e) => A(e) || typeof e?.[Symbol.iterator] == "function", j = "[ 	\n\f\r]", M = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, N = /-->/g, P = />/g, F = RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), oe = /'/g, se = /"/g, I = /^(?:script|style|textarea|title)$/i, L = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), R = Symbol.for("lit-noChange"), z = Symbol.for("lit-nothing"), B = /* @__PURE__ */ new WeakMap(), V = D.createTreeWalker(D, 129);
function H(e, t) {
	if (!A(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return w === void 0 ? t : w.createHTML(t);
}
var ce = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = M;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === M ? c[1] === "!--" ? o = N : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = F) : (I.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = F) : o = P : o === F ? c[0] === ">" ? (o = i ?? M, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? F : c[3] === "\"" ? se : oe) : o === se || o === oe ? o = F : o === N || o === P ? o = M : (o = F, i = void 0);
		let d = o === F && e[t + 1].startsWith("/>") ? " " : "";
		a += o === M ? n + ie : l >= 0 ? (r.push(s), n.slice(0, l) + T + n.slice(l) + E + d) : n + E + (l === -2 ? t : d);
	}
	return [H(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, U = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = ce(t, n);
		if (this.el = e.createElement(l, r), V.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = V.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(T)) {
					let t = u[o++], n = i.getAttribute(e).split(E), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? ue : r[1] === "?" ? de : r[1] === "@" ? fe : K
					}), i.removeAttribute(e);
				} else e.startsWith(E) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (I.test(i.tagName)) {
					let e = i.textContent.split(E), t = e.length - 1;
					if (t > 0) {
						i.textContent = C ? C.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], O()), V.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], O());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === re) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(E, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += E.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = D.createElement("template");
		return n.innerHTML = e, n;
	}
};
function W(e, t, n = e, r) {
	if (t === R) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = k(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = W(e, i._$AS(e, t.values), i, r)), t;
}
var le = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? D).importNode(t, !0);
		V.currentNode = r;
		let i = V.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new G(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new pe(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = V.nextNode(), a++);
		}
		return V.currentNode = D, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, G = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = z, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = W(this, e, t), k(e) ? e === z || e == null || e === "" ? (this._$AH !== z && this._$AR(), this._$AH = z) : e !== this._$AH && e !== R && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? ae(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== z && k(this._$AH) ? this._$AA.nextSibling.data = e : this.T(D.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = U.createElement(H(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new le(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = B.get(e.strings);
		return t === void 0 && B.set(e.strings, t = new U(e)), t;
	}
	k(t) {
		A(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(O()), this.O(O()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = S(e).nextSibling;
			S(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, K = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = z, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = z;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = W(this, e, t, 0), a = !k(e) || e !== this._$AH && e !== R, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = W(this, r[n + o], t, o), s === R && (s = this._$AH[o]), a ||= !k(s) || s !== this._$AH[o], s === z ? e = z : e !== z && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === z ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, ue = class extends K {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === z ? void 0 : e;
	}
}, de = class extends K {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== z);
	}
}, fe = class extends K {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = W(this, e, t, 0) ?? z) === R) return;
		let n = this._$AH, r = e === z && n !== z || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== z && (n === z || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, pe = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		W(this, e);
	}
}, me = x.litHtmlPolyfillSupport;
me?.(U, G), (x.litHtmlVersions ??= []).push("3.3.3");
var he = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new G(t.insertBefore(O(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, q = globalThis, J = class extends b {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = he(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return R;
	}
};
J._$litElement$ = !0, J.finalized = !0, q.litElementHydrateSupport?.({ LitElement: J });
var ge = q.litElementPolyfillSupport;
ge?.({ LitElement: J }), (q.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/property.js
var _e = {
	attribute: !0,
	type: String,
	converter: v,
	reflect: !1,
	hasChanged: y
}, ve = (e = _e, t, n) => {
	let { kind: r, metadata: i } = n, a = globalThis.litPropertyMetadata.get(i);
	if (a === void 0 && globalThis.litPropertyMetadata.set(i, a = /* @__PURE__ */ new Map()), r === "setter" && ((e = Object.create(e)).wrapped = !0), a.set(n.name, e), r === "accessor") {
		let { name: r } = n;
		return {
			set(n) {
				let i = t.get.call(this);
				t.set.call(this, n), this.requestUpdate(r, i, e, !0, n);
			},
			init(t) {
				return t !== void 0 && this.C(r, void 0, e, t), t;
			}
		};
	}
	if (r === "setter") {
		let { name: r } = n;
		return function(n) {
			let i = this[r];
			t.call(this, n), this.requestUpdate(r, i, e, !0, n);
		};
	}
	throw Error("Unsupported decorator location: " + r);
};
function Y(e) {
	return (t, n) => typeof n == "object" ? ve(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function X(e) {
	return Y({
		...e,
		state: !0,
		attribute: !1
	});
}
//#endregion
//#region src/config.ts
var ye = /* @__PURE__ */ new Set([
	"disarm",
	"arm_home",
	"arm_away",
	"arm_night",
	"arm_vacation"
]), be = /* @__PURE__ */ new Set([
	"type",
	"entity",
	"action",
	"title",
	"submit_label",
	"min_length",
	"max_length",
	"clear_after_ms",
	"key_size",
	"layout",
	"theme",
	"matrix",
	"caption"
]), xe = /* @__PURE__ */ new Set(["plain", "phosphor"]), Se = /* @__PURE__ */ new Set([
	"auto",
	"portrait",
	"landscape"
]), Ce = {
	disarm: "alarm_disarm",
	arm_home: "alarm_arm_home",
	arm_away: "alarm_arm_away",
	arm_night: "alarm_arm_night",
	arm_vacation: "alarm_arm_vacation"
};
function Z(e, t, n, r, i, a) {
	return e === void 0 ? t : typeof e != "number" || !Number.isInteger(e) || e < n || e > r ? (a.push(`${i} must be an integer from ${n} to ${r}`), t) : e;
}
function we(e) {
	let t = [];
	if (typeof e != "object" || !e) return { errors: ["configuration must be a mapping"] };
	let n = e;
	for (let e of Object.keys(n)) be.has(e) || t.push(`unknown option: ${e}`);
	let r = n.entity;
	(typeof r != "string" || !r.startsWith("alarm_control_panel.")) && t.push("entity must be an alarm_control_panel entity id");
	let i = n.action ?? "disarm";
	(typeof i != "string" || !ye.has(i)) && t.push("action must be one of disarm, arm_home, arm_away, arm_night, arm_vacation");
	let a = n.title;
	a !== void 0 && typeof a != "string" && t.push("title must be a string");
	let o = n.submit_label ?? "Submit";
	(typeof o != "string" || o.length === 0) && t.push("submit_label must be a non-empty string");
	let s = Z(n.min_length, 4, 1, 16, "min_length", t), c = Z(n.max_length, 8, 1, 16, "max_length", t);
	s > c && t.push("min_length cannot exceed max_length");
	let l = Z(n.clear_after_ms, 3e4, 0, 6e5, "clear_after_ms", t), u = Z(n.key_size, 96, 48, 200, "key_size", t), d = n.layout ?? "auto";
	(typeof d != "string" || !Se.has(d)) && t.push("layout must be auto, portrait, or landscape");
	let f = n.theme ?? "plain";
	(typeof f != "string" || !xe.has(f)) && t.push("theme must be plain or phosphor");
	let p = n.matrix ?? !1;
	typeof p != "boolean" && t.push("matrix must be true or false");
	let m = n.caption;
	return m !== void 0 && typeof m != "string" && t.push("caption must be a string"), t.length > 0 ? { errors: t } : {
		errors: t,
		config: {
			type: String(n.type ?? "custom:keypad-card"),
			entity: r,
			action: i,
			title: a,
			submit_label: o,
			min_length: s,
			max_length: c,
			clear_after_ms: l,
			key_size: u,
			layout: d,
			theme: f,
			matrix: p,
			caption: m
		}
	};
}
//#endregion
//#region src/matrix-rain.ts
var Te = "0123456789ABCDEF<>[]{}=+-*/%#@$&", Ee = class {
	constructor(e, t, n, r) {
		this.canvas = e, this.color = t, this.fontSize = n, this.fps = r, this.columns = [], this.timer = null, this.context = e.getContext("2d");
	}
	start() {
		this.stop(), this.resize(), this.timer = setInterval(() => this.frame(), Math.max(50, Math.round(1e3 / this.fps)));
	}
	stop() {
		this.timer !== null && (clearInterval(this.timer), this.timer = null);
	}
	resize() {
		let e = this.canvas.getBoundingClientRect();
		if (e.width === 0 || e.height === 0) return;
		this.canvas.width = Math.floor(e.width), this.canvas.height = Math.floor(e.height);
		let t = Math.max(1, Math.floor(this.canvas.width / this.fontSize));
		this.columns = Array.from({ length: t }, () => Math.floor(Math.random() * -30)), this.context && (this.context.fillStyle = "#000", this.context.fillRect(0, 0, this.canvas.width, this.canvas.height));
	}
	frame() {
		let e = this.context;
		if (!e) return;
		let { width: t, height: n } = this.canvas;
		if (t === 0 || n === 0) {
			this.resize();
			return;
		}
		e.fillStyle = "rgba(0, 0, 0, 0.12)", e.fillRect(0, 0, t, n), e.font = `${this.fontSize}px monospace`, e.textBaseline = "top";
		for (let t = 0; t < this.columns.length; t += 1) {
			let r = this.columns[t] ?? 0, i = Te[Math.floor(Math.random() * 32)] ?? "0", a = t * this.fontSize;
			e.fillStyle = this.color, e.fillText(i, a, r * this.fontSize), r * this.fontSize > n && Math.random() > .96 ? this.columns[t] = Math.floor(Math.random() * -10) : this.columns[t] = r + 1;
		}
	}
};
//#endregion
//#region \0@oxc-project+runtime@0.147.0/helpers/esm/decorate.js
function Q(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
//#endregion
//#region src/keypad-card.ts
var De, Oe = [
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"clear",
	"0",
	"back"
], $ = class extends J {
	constructor(...e) {
		super(...e), this.errors = [], this.code = "", this.busy = !1, this.notice = null, this.clearTimer = null, this.rains = [], this.resizeObserver = null;
	}
	setConfig(e) {
		let t = we(e);
		this.errors = t.errors, this.config = t.config, this.code = "", this.notice = null;
	}
	getCardSize() {
		return 6;
	}
	static getStubConfig() {
		return {
			entity: "alarm_control_panel.example",
			action: "disarm"
		};
	}
	connectedCallback() {
		super.connectedCallback(), this.resizeObserver = new ResizeObserver(() => this.rains.forEach((e) => e.resize())), this.resizeObserver.observe(this);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.stopClearTimer(), this.stopRain(), this.resizeObserver?.disconnect(), this.resizeObserver = null, this.code = "";
	}
	updated(e) {
		if ((e.has("config") || e.has("errors")) && (this.stopRain(), this.config?.matrix && this.errors.length === 0)) {
			let e = this.renderRoot.querySelectorAll("canvas.rain"), t = Math.max(12, Math.round(this.config.key_size * .16));
			this.rains = Array.from(e, (e) => new Ee(e, "#33ff66", t, 12)), this.rains.forEach((e) => e.start());
		}
	}
	stopRain() {
		this.rains.forEach((e) => e.stop()), this.rains = [];
	}
	stopClearTimer() {
		this.clearTimer !== null && (clearTimeout(this.clearTimer), this.clearTimer = null);
	}
	armClearTimer() {
		this.stopClearTimer(), !(!this.config || this.config.clear_after_ms === 0) && (this.clearTimer = setTimeout(() => {
			this.code = "", this.clearTimer = null;
		}, this.config.clear_after_ms));
	}
	press(e) {
		!this.config || this.busy || (this.notice = null, e === "clear" ? this.code = "" : e === "back" ? this.code = this.code.slice(0, -1) : this.code.length < this.config.max_length && (this.code += e), this.armClearTimer());
	}
	async submit() {
		let e = this.config, t = this.hass;
		if (!e || !t || this.busy) return;
		if (this.code.length < e.min_length) {
			this.notice = {
				kind: "error",
				text: `Enter at least ${e.min_length} digits`
			};
			return;
		}
		let n = this.code;
		this.code = "", this.stopClearTimer(), this.busy = !0;
		try {
			await t.callService("alarm_control_panel", Ce[e.action], {
				entity_id: e.entity,
				code: n
			}), this.notice = {
				kind: "ok",
				text: "Sent to the panel"
			};
		} catch (e) {
			let t = e instanceof Error ? e.message : String(e);
			this.notice = {
				kind: "error",
				text: t || "The panel rejected the request"
			};
		} finally {
			this.busy = !1;
		}
	}
	render() {
		if (this.errors.length > 0) return L`<ha-card>
        <div class="errors">keypad-card configuration:\n${this.errors.join("\n")}</div>
      </ha-card>`;
		let e = this.config;
		if (!e) return z;
		let t = this.hass?.states[e.entity] === void 0, n = e.matrix ? L`<canvas class="rain"></canvas>` : z, r = e.theme === "phosphor" ? "_" : "";
		return L`<ha-card class=${e.theme} style="--kp-key: ${e.key_size}px">
      <div class="body ${e.layout}">
        <div class="side left">
          ${n}
          ${e.title ? L`<div class="title">${e.title}</div>` : z}
          <div class="display" aria-label="code entry">
            ${"•".repeat(this.code.length)}${r}
          </div>
        </div>
        <div class="grid">
          ${Oe.map((e) => L`<button
              type="button"
              ?disabled=${t || this.busy}
              aria-label=${e}
              @click=${() => this.press(e)}
            >
              ${e === "clear" ? "C" : e === "back" ? "⌫" : e}
            </button>`)}
          <button
            type="button"
            class="submit"
            ?disabled=${t || this.busy || this.code.length === 0}
            @click=${() => void this.submit()}
          >
            ${e.submit_label}
          </button>
        </div>
        <div class="side right">
          ${n}
          ${e.caption ? L`<div class="caption">${e.caption}</div>` : z}
          ${t ? L`<div class="notice error">${e.entity} is not available</div>` : z}
          ${this.notice ? L`<div class="notice ${this.notice.kind}">${this.notice.text}</div>` : z}
        </div>
      </div>
    </ha-card>`;
	}
};
De = $, De.styles = o`
    :host {
      display: block;
      --kp-fg: var(--primary-text-color, inherit);
      --kp-key-bg: var(--secondary-background-color, #eee);
      --kp-submit-bg: var(--primary-color, #03a9f4);
      --kp-submit-fg: var(--text-primary-color, #fff);
      --kp-font: inherit;
      --kp-glow: none;
    }
    ha-card {
      padding: 16px;
      container-type: inline-size;
      color: var(--kp-fg);
      font-family: var(--kp-font);
      position: relative;
      overflow: hidden;
    }
    ha-card.phosphor {
      background: #020803;
      --kp-fg: #33ff66;
      --kp-key-bg: #062a10;
      --kp-submit-bg: #0b5a22;
      --kp-submit-fg: #b6ffc9;
      --kp-font: "VT323", "Share Tech Mono", "IBM Plex Mono", "Courier New", monospace;
      --kp-glow: 0 0 6px rgba(51, 255, 102, 0.75), 0 0 14px rgba(51, 255, 102, 0.35);
      text-shadow: var(--kp-glow);
    }
    ha-card.phosphor::after {
      /* scanlines */
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: repeating-linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0) 0px,
        rgba(0, 0, 0, 0) 2px,
        rgba(0, 0, 0, 0.18) 3px
      );
    }
    .body {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      grid-template-areas: "left keypad right";
      align-items: center;
      gap: 24px;
    }
    .body.portrait {
      grid-template-columns: 1fr;
      grid-template-areas: "left" "keypad" "right";
    }
    @container (max-width: 559px) {
      .body.auto {
        grid-template-columns: 1fr;
        grid-template-areas: "left" "keypad" "right";
      }
    }
    .side {
      position: relative;
      min-width: 0;
      min-height: calc(var(--kp-key) * 3);
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 12px;
      text-align: center;
    }
    .side.left {
      grid-area: left;
    }
    .side.right {
      grid-area: right;
    }
    canvas.rain {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      opacity: 0.35;
      z-index: 0;
      pointer-events: none;
    }
    .side > :not(canvas) {
      position: relative;
      z-index: 1;
    }
    .title {
      font-size: calc(var(--kp-key) * 0.3);
      font-weight: 500;
    }
    .display {
      font-family: var(--kp-font);
      font-size: calc(var(--kp-key) * 0.55);
      letter-spacing: 0.3em;
      min-height: 1.4em;
    }
    .caption,
    .notice {
      font-size: calc(var(--kp-key) * 0.24);
    }
    .grid {
      grid-area: keypad;
      display: grid;
      grid-template-columns: repeat(3, var(--kp-key));
      gap: calc(var(--kp-key) * 0.16);
      justify-content: center;
      position: relative;
      z-index: 1;
    }
    button {
      font: inherit;
      font-family: var(--kp-font);
      font-size: calc(var(--kp-key) * 0.42);
      width: var(--kp-key);
      height: var(--kp-key);
      border-radius: 50%;
      border: none;
      background: var(--kp-key-bg);
      color: var(--kp-fg);
      cursor: pointer;
      touch-action: manipulation;
      text-shadow: var(--kp-glow);
    }
    ha-card.phosphor button {
      border: 1px solid rgba(51, 255, 102, 0.45);
      box-shadow: inset 0 0 10px rgba(51, 255, 102, 0.15);
    }
    button:active {
      filter: brightness(1.3);
    }
    button:disabled {
      opacity: 0.4;
      cursor: default;
    }
    button.submit {
      grid-column: 1 / -1;
      width: auto;
      height: calc(var(--kp-key) * 0.7);
      font-size: calc(var(--kp-key) * 0.3);
      border-radius: calc(var(--kp-key) * 0.35);
      background: var(--kp-submit-bg);
      color: var(--kp-submit-fg);
    }
    .notice.error {
      color: var(--error-color, #ff5c5c);
    }
    ha-card.phosphor .notice.error {
      color: #ffb347;
    }
    .notice.ok {
      color: var(--success-color, #0a7c3c);
    }
    ha-card.phosphor .notice.ok {
      color: #b6ffc9;
    }
    .errors {
      color: var(--error-color, #b00020);
      white-space: pre-wrap;
    }
  `, Q([Y({ attribute: !1 })], $.prototype, "hass", void 0), Q([X()], $.prototype, "config", void 0), Q([X()], $.prototype, "errors", void 0), Q([X()], $.prototype, "code", void 0), Q([X()], $.prototype, "busy", void 0), Q([X()], $.prototype, "notice", void 0), customElements.get("keypad-card") || customElements.define("keypad-card", $), window.customCards = window.customCards ?? [], window.customCards.some((e) => e.type === "keypad-card") || window.customCards.push({
	type: "keypad-card",
	name: "Keypad Card",
	description: "Numeric keypad that submits a code to an alarm control panel action.",
	preview: !1
}), console.info("%c keypad-card %c 2026.09.11.1 ", "color: white; background: #03a9f4", "");
//#endregion
