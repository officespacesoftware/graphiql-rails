! function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? t(exports, require("@graphiql/react"), require("react")) : "function" == typeof define && define.amd ? define(["exports", "@graphiql/react", "react"], t) : t((e || self).graphiqlPluginChatgpt = {}, e.GraphiQL.GraphQL, e.React)
  }(this, function(e, t, n) {
    function r(e) {
        return e && "object" == typeof e && "default" in e ? e : {
            default: e
        }
    }
    var o = /*#__PURE__*/ r(n);

    function i() {
        return i = Object.assign ? Object.assign.bind() : function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
            }
            return e
        }, i.apply(this, arguments)
    }

    function a(e, t) {
        e.prototype = Object.create(t.prototype), e.prototype.constructor = e, u(e, t)
    }

    function u(e, t) {
        return u = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(e, t) {
            return e.__proto__ = t, e
        }, u(e, t)
    }
    var c = /*#__PURE__*/ function() {
            function e(e) {
                this.provider = void 0, this.provider = "azure" === e.provider ? new f(e) : new l(e)
            }
            return e.prototype.createCompletion = function(e) {
                try {
                    return Promise.resolve(this.provider.sendRequest("completions", e)).then(function(e) {
                        var t = e.data;
                        if (200 !== e.status) throw e;
                        return t && t.choices[0].text
                    })
                } catch (e) {
                    return Promise.reject(e)
                }
            }, e
        }(),
        s = /*#__PURE__*/ function() {
            function e(e, t) {
                this.baseUrl = void 0, this.config = void 0, this.apiKey = void 0, this.baseUrl = e, this.config = t, this.apiKey = t.apiKey
            }
            return e.prototype.sendRequest = function(e, t) {
                try {
                    var n = this,
                        r = {
                            method: "POST",
                            headers: i({
                                "Content-Type": "application/json"
                            }, n.getAuthHeader(), n.config.headers),
                            body: JSON.stringify(t)
                        };
                    return Promise.resolve(fetch(n.baseUrl + "/" + e, r)).then(function(e) {
                        return Promise.resolve(e.json()).then(function(t) {
                            return {
                                data: t,
                                status: e.status
                            }
                        })
                    })
                } catch (e) {
                    return Promise.reject(e)
                }
            }, e
        }(),
        l = /*#__PURE__*/ function(e) {
            function t(t) {
                return e.call(this, "https://api.openai.com", t) || this
            }
            a(t, e);
            var n = t.prototype;
            return n.getAuthHeader = function() {
                return {
                    Authorization: "Bearer " + String(this.apiKey)
                }
            }, n.sendRequest = function(t, n) {
                try {
                    return Promise.resolve(e.prototype.sendRequest.call(this, "v1/" + t, n))
                } catch (e) {
                    return Promise.reject(e)
                }
            }, t
        }(s),
        f = /*#__PURE__*/ function(e) {
            function t(t) {
                return e.call(this, t.endpoint, t) || this
            }
            a(t, e);
            var n = t.prototype;
            return n.getAuthHeader = function() {
                return {
                    "api-key": this.apiKey
                }
            }, n.sendRequest = function(t, n) {
                try {
                    var r = this;
                    return Promise.resolve(e.prototype.sendRequest.call(r, "openai/deployments/" + r.config.deploymentId + "/" + t + "?api-version=" + r.config.apiVersion, n))
                } catch (e) {
                    return Promise.reject(e)
                }
            }, t
        }(s),
        p = "Click 'Suggest' button to see result..",
        d = "query {";

    function h(e) {
      var r = e.userId,
            i = e.query,
            a = e.onEdit,
            u = new c(e.config),
            s = n.useState(p),
            l = s[0],
            f = s[1],
            h = n.useState(""),
            y = h[0],
            m = h[1],
            g = n.useState(""),
            v = g[0],
            b = g[1],
            q = n.useState(!1),
            P = q[0],
            E = q[1],
            j = n.useState(!1),
            C = j[0],
            k = j[1],
            O = n.useMemo(function() {
                return ["### Generate graphql query based on following", "#"].concat(i.split("\n").map(function(e, t) {
                    return (t ? "" : "##") + "# " + e
                }), ["### " + v, d]).join("\n")
            }, [i, v]);
        n.useEffect(function() {
            r || console.error("Missing user value: use with auth key..")
        }, []), n.useEffect(function() {
            console.log(O)
        }, [O]), n.useEffect(function() {
            var e = "";
            v || (e = "Missing query description"), i || (e = "Missing query"), r || (e = "Missing userId"), E(!e), m(e || "Ready..")
        }, [r, i, v]), n.useEffect(function() {
            k(!!l)
        }, [l]);
        var S = function() {
            try {
                return f(""), m("Getting suggestion.."), Promise.resolve(u.createCompletion({
                    model: "text-davinci-003",
                    user: r,
                    prompt: O,
                    temperature: 0,
                    max_tokens: 250,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                    stop: ["###"]
                }).then(function(e) {
                    return "" + d + e
                }).catch(console.error)).then(function(e) {
                    f(e || ""), m("Ready!")
                })
            } catch (e) {
                return Promise.reject(e)
            }
        };
        return o.default.createElement("div", {
            className: "graphiql-plugin-chatgpt"
        }, o.default.createElement("h1", null, "ChatGPT"), o.default.createElement("h4", null, "Describe a query to generate:"), o.default.createElement("textarea", {
            value: v,
            onChange: function(e) {
                return b(e.target.value)
            },
            onKeyDown: function(e) {
                P && (e.metaKey || e.ctrlKey) && "Enter" === e.key && S()
            }
        }), o.default.createElement("div", {
            style: {
                marginTop: 10
            }
        }, o.default.createElement("button", {
            type: "button",
            onClick: S,
            disabled: !P
        }, "Suggest")
        , o.default.createElement("em", null, y)), o.default.createElement("br", null), o.default.createElement("p", null, l), l != p && o.default.createElement("button", {
            type: "button",
            onClick: function() {
                a(l), f("")
            },
            disabled: !C
        }, "Set query"))
    }

    function y(e) {
        var t = n.useRef(e);
        t.current = e;
        var r = n.useRef();
        return r.current || (r.current = {
            title: "ChatGPT",
            icon: function() {
                return o.default.createElement("svg", {
                    strokeWidth: "0.05",
                    viewBox: "0 0 24 24",
                    fill: "currentColor"
                }, o.default.createElement("path", {
                    d: "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z",
                    stroke: "currentColor",
                    strokeLinecap: "round",
                    strokeLinejoin: "round"
                }))
            },
            content: function() {
                return o.default.createElement(h, i({}, t.current))
            }
        }), r.current
    }
    e.default = y, e.useChatGPTPlugin = y
});
//# sourceMappingURL=graphiql-plugin-chatgpt.umd.js.map