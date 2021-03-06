/**
 * switchable 1.1
 * http://IlikejQuery.com/switchable
 *
 * @Creator   wo_is神仙 <i@mrzhang.me>
 * @Depend    jQuery 1.4+
 **/
(function(b) {
    function k(a, e, c) {
        var f = this,
            j = b(this),
            i, l = a.length - 1;
        b.each(c, function(d, g) {
            b.isFunction(g) && j.bind(d, g)
        });
        b.extend(this, {
            click: function(d, g) {
                var n = a.eq(d);
                if (typeof d == "string" && d.replace("#", "")) {
                    n = a.filter("[href*=" + d.replace("#", "") + "]");
                    d = Math.max(n.index(), 0)
                }
                g = g || b.Event();
                g.type = "beforeSwitch";
                j.trigger(g, [d]);
                if (!g.isDefaultPrevented()) {
                    h[c.effect].call(f, d, function() {
                        g.type = "onSwitch";
                        j.trigger(g, [d])
                    });
                    g.type = "onStart";
                    j.trigger(g, [d]);
                    if (!g.isDefaultPrevented()) {
                        i = d;
                        a.removeClass(c.currentCls);
                        n.addClass(c.currentCls);
                        return f
                    }
                }
            },
            getCfg: function() {
                return c
            },
            getTriggers: function() {
                return a
            },
            getPanels: function() {
                return e
            },
            getVisiblePanel: function(d) {
                return f.getPanels().slice(d * c.steps, (d + 1) * c.steps)
            },
            getIndex: function() {
                return i
            },
            move: function(d) {
                if (e.parent().is(":animated") || e.length <= c.visible) return f;
                return typeof d == "number" ? d < 0 ? c.circular ? f.click(l) : f : d > l ? c.circular ? f.click(0) : f : f.click(d) : f.click()
            },
            next: function() {
                return f.move(i + 1)
            },
            prev: function() {
                return f.move(i - 1)
            },
            bind: function(d, g) {
                j.bind(d, g);
                return f
            },
            unbind: function(d) {
                j.unbind(d);
                return f
            },
            beforeSwitch: function(d) {
                return this.bind("beforeSwitch", d)
            },
            onSwitch: function(d) {
                return this.bind("onSwitch", d)
            },
            resetPosition: function() {}
        });
        var m;
        a.each(function(d) {
            c.triggerType === "mouse" ? b(this).bind({
                mouseenter: function(g) {
                    if (d !== i) m = setTimeout(function() {
                        f.click(d, g)
                    }, c.delay * 1E3)
                },
                mouseleave: function() {
                    clearTimeout(m)
                }
            }) : b(this).bind("click", function(g) {
                d !== i && f.click(d, g);
                return false
            })
        });
        if (location.hash) f.click(location.hash);
        else c.initIndex >= 0 && f.click(c.initIndex);
        e.find("a[href^=#]").click(function(d) {
            f.click(b(this).attr("href"), d)
        });
        c.panelSwitch && e.css("cursor", "pointer").click(function() {
            f.next();
            return false
        })
    }
    b.switchable = b.switchable || {};
    b.switchable = {
        cfg: {
            triggers: "a",
            currentCls: "current",
            initIndex: 0,
            triggerType: "mouse",
            delay: 0.1,
            effect: "default",
            steps: 1,
            visible: 1,
            speed: 0.7,
            easing: "swing",
            circular: false,
            vertical: false,
            panelSwitch: false,
            beforeSwitch: null,
            onSwitch: null,
            api: false
        },
        addEffect: function(a, e) {
            h[a] = e
        }
    };
    var h = {
        "default": function(a, e) {
            this.getPanels().hide();
            this.getVisiblePanel(a).show();
            e.call()
        },
        ajax: function(a, e) {
            this.getPanels().first().load(this.getTriggers().eq(a).attr("href"), e)
        }
    };
    b.fn.switchable = function(a, e) {
        var c = this.eq(typeof e == "number" ? e : 0).data("switchable");
        if (c) return c;
        if (b.isFunction(e)) e = {
            beforeSwitch: e
        };
        var f = b.extend({}, b.switchable.cfg),
            j = this.length;
        e = b.extend(f, e);
        this.each(function(i) {
            var l = b(this),
                m = a.jquery ? a : l.children(a);
            m.length || (m = j == 1 ? b(a) : l.parent().find(a));
            i = l.find(e.triggers);
            if (!i.length) {
                var d = Math.ceil(m.length / e.steps),
                    g = [];
                for (i = 1; i <= d; i++) g.push('<a href="javascript:void(0)" target="_self">' + i + "</a>");
                i = l.append(g.join("")).children("a")
            }
            c = new k(i, m, e);
            l.data("switchable", c)
        });
        return e.api ? c : this
    }
})(jQuery);
$.switchable.addEffect("fade", function(b, k) {
    var h = this.getCfg(),
        a = this.getPanels(),
        e = this.getVisiblePanel(b);
    a.hide();
    e.fadeIn(h.speed * 1E3, k)
});
$.switchable.addEffect("scroll", function(b, k) {
    var h = this,
        a = h.getCfg(),
        e = h.getVisiblePanel(b),
        c = h.getPanels().parent(),
        f = h.getIndex(),
        j = h.getTriggers().length - 1,
        i = f === 0 && b === j || f === j && b === 0,
        l = f === 0 && b === j ? true : false;
    e = a.vertical ? {
        top: -e.position().top
    } : {
        left: -e.position().left
    };
    c.is(":animated") && c.stop(true);
    c.animate(e, a.speed * 1E3, a.easing, function() {
        k.call();
        i && h.resetPosition(l)
    })
});
(function(b) {
    var k = b.switchable;
    k.plugin = k.plugin || {};
    k.plugin.autoplay = {
        cfg: {
            autoplay: true,
            interval: 3,
            autopause: true,
            api: false
        }
    };
    b.fn.autoplay = function(h) {
        if (typeof h == "number") h = {
            interval: h
        };
        var a = b.extend({}, k.plugin.autoplay.cfg),
            e;
        b.extend(a, h);
        this.each(function() {
            var c = b(this).switchable();
            if (c) e = c;
            var f, j, i = true;
            c.play = function() {
                if (!f) {
                    i = false;
                    f = setInterval(function() {
                        c.next()
                    }, a.interval * 1E3);
                    c.next()
                }
            };
            c.pause = function() {
                f = clearInterval(f)
            };
            c.stop = function() {
                c.pause();
                i = true
            };
            a.autopause && c.getPanels().hover(function() {
                c.pause();
                clearTimeout(j)
            }, function() {
                i || (j = setTimeout(c.play, a.interval * 1E3))
            });
            a.autoplay && setTimeout(c.play, a.interval * 1E3)
        });
        return a.api ? e : this
    }
})(jQuery);
(function(b) {
    b.fn.carousel = function() {
        this.each(function() {
            var k = b(this).switchable(),
                h = k.getCfg(),
                a = k.getPanels(),
                e = a.parent(),
                c = k.getTriggers().length - 1,
                f = a.slice(0, h.steps),
                j = a.slice(c * h.steps),
                i = h.vertical ? j.position().top : j.position().left,
                l = h.vertical ? "top" : "left",
                m = a.length > h.visible,
                d = 0;
            a.css("position", "relative").each(function() {
                d += h.vertical ? b(this).outerHeight(true) : b(this).outerWidth(true)
            });
            m && j.length < h.visible && e.append(a.slice(0, h.visible).clone().addClass("clone"));
            b.extend(k, {
                move: function(g) {
                    if (e.is(":animated") || !m) return this;
                    if (g < 0) {
                        this.adjustPosition(true);
                        return this.click(c)
                    } else if (g > c) {
                        this.adjustPosition(false);
                        return this.click(0)
                    } else return this.click(g)
                },
                adjustPosition: function(g) {
                    b.each(g ? j : f, function() {
                        b(this).css(l, g ? -d : d)
                    })
                },
                resetPosition: function(g) {
                    b.each(g ? j : f, function() {
                        b(this).css(l, 0)
                    });
                    e.css(l, g ? -i : 0)
                }
            })
        });
        return this
    }
})(jQuery);
(function(b) {
    function k(a) {
        switch (a.type) {
            case "mousemove":
                return b.extend(a.data, {
                    clientX: a.clientX,
                    clientY: a.clientY,
                    pageX: a.pageX,
                    pageY: a.pageY
                });
            case "DOMMouseScroll":
                b.extend(a, a.data);
                a.delta = -a.detail / 3;
                break;
            case "mousewheel":
                a.delta = a.wheelDelta / 120
        }
        a.type = "wheel";
        return b.event.handle.call(this, a, a.delta)
    }
    b.fn.wheel = function(a) {
        return this[a ? "bind" : "trigger"]("wheel", a)
    };
    b.event.special.wheel = {
        setup: function() {
            b.event.add(this, h, k, {})
        },
        teardown: function() {
            b.event.remove(this, h, k)
        }
    };
    var h = !b.browser.mozilla ? "mousewheel" : "DOMMouseScroll" + (b.browser.version < "1.9" ? " mousemove" : "");
    b.fn.mousewheel = function() {
        this.each(function() {
            var a = b(this).switchable();
            a.getPanels().parent().wheel(function(e, c) {
                c < 0 ? a.next() : a.prev();
                return false
            })
        });
        return this
    }
})(jQuery);
