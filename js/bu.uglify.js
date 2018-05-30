function gl_() {
    bujs.a.s()
}
function BUJS() {}
BUJS.e = function(s) {
    var a = this;
    a.u = {
        i: "perfect.wav",
        c: "normal.wav",
        r: "miss.wav",
        b: "space.wav"
    },
    a.o = new (window.AudioContext || window.webkitAudioContext),
    a.p = s,
    async.eachOf(a.u, function(s, n, e) {
        var t = new XMLHttpRequest;
        t.open("GET", "sound/" + s, !0),
        t.responseType = "arraybuffer",
        t.onload = function() {
            a.o.decodeAudioData(t.response, function(s) {
                a.u[n] = s
            }, function(s) {}),
            e()
        }
        ,
        t.send()
    }),
    a.j("notes/" + bujs.a.f + ".json")
}
,
BUJS.e.prototype.j = function(s) {
    var a = this;
    $.get(s, function(s) {
        a.g = bujs.l[bujs.a.f],
        a.g._ = s,
        a.h = 6e4 / (4 * a.g.bpm),
        a.v(),
        a.U("music/" + a.g.ogg)
    })
}
,
BUJS.e.prototype.U = function(s) {
    var a = this
      , n = new XMLHttpRequest;
    bujs.B("Downloading music"),
    n.open("GET", s, !0),
    n.responseType = "arraybuffer",
    n.onload = function() {
        bujs.d ? (a.w = new ArrayBuffer(n.response.byteLength),
        new Uint8Array(a.w).set(new Uint8Array(n.response)),
        bujs.B("Touch/click to start music")) : a.o.decodeAudioData(n.response, function(s) {
            a.S = a.J(s),
            a.m = a.o.currentTime,
            a.S.start(0),
            void 0 !== a.p && a.p.call(bujs.a, a)
        }, function(s) {})
    }
    ,
    n.send()
}
,
BUJS.e.prototype.J = function(s) {
    var a = this.o.createBufferSource();
    return a.buffer = s,
    a.connect(this.o.destination),
    a
}
,
BUJS.e.prototype.k = function(s) {
    this.J(s).start(0)
}
,
BUJS.e.prototype.v = function() {
    for (var s = this, a = 0; a < s.g._.length; a++)
        s.g._[a].t = s.g._[a].t * s.h
}
,
BUJS.e.prototype.L = function() {
    return 1e3 * (this.o.currentTime - this.m)
}
,
BUJS.R = function(s) {
    var a = this;
    a.M = [],
    a.p = s,
    a.T(),
    a.$(),
    a.F()
}
,
BUJS.R.prototype.Y = function() {
    var s = this;
    async.eachOf(s.A, s.G, function(a) {
        if (a)
            ;
        else {
            s.D();
            var n = document.getElementById("cvs");
            s.I = n.getContext("2d");
            var e = s.P.H * s.P.W
              , t = s.P.X * s.P.W;
            n.width = e,
            n.height = t,
            void 0 !== s.p && s.p.call(bujs.a, s)
        }
    })
}
,
BUJS.R.prototype.T = function() {
    this.P = {
        q: "img/",
        W: 1,
        H: 980,
        X: 400
    }
}
,
BUJS.R.prototype.$ = function() {
    var s = this;
    s.A = {
        N: ["bg/lafesta.jpg"],
        z: ["dnxp.png"],
        C: ["lane_7.png", "lane_4.png", "lane_1.png", "lane_9.png", "lane_6.png", "lane_3.png"],
        O: ["beatdown_7.png", "beatdown_4.png", "beatdown_1.png", "beatdown_9.png", "beatdown_6.png", "beatdown_3.png"],
        K: ["tableL.png"],
        Q: ["laneL.png"],
        V: ["landingL.png"],
        Z: ["tableR.png"],
        ss: ["laneR.png"],
        as: ["landingR.png"],
        ns: ["space_frame.png"],
        es: ["space_frame_cursor.png"],
        ts: ["space_frame_explode.png"],
        us: ["space_frame_space_explode.png"],
        cs: ["arrow_explode.png"],
        rs: ["a71.png", "a72.png", "a73.png", "a74.png", "a75.png", "a76.png", "a77.png", "a78.png"],
        bs: ["a41.png", "a42.png", "a43.png", "a44.png", "a45.png", "a46.png", "a47.png", "a48.png"],
        os: ["a11.png", "a12.png", "a13.png", "a14.png", "a15.png", "a16.png", "a17.png", "a18.png"],
        ps: ["a91.png", "a92.png", "a93.png", "a94.png", "a95.png", "a96.png", "a97.png", "a98.png"],
        js: ["a61.png", "a62.png", "a63.png", "a64.png", "a65.png", "a66.png", "a67.png", "a68.png"],
        fs: ["a31.png", "a32.png", "a33.png", "a34.png", "a35.png", "a36.png", "a37.png", "a38.png"],
        gs: ["space_frame_letter_b.png", "space_frame_letter_e.png", "space_frame_letter_a.png", "space_frame_letter_t.png", "space_frame_letter_u.png", "space_frame_letter_p.png"],
        ls: ["space_frame_letter_glow_blue.png"],
        _s: ["space_frame_letter_glow_yellow.png"],
        hs: ["space_frame_glow_blue.png"],
        vs: ["space_frame_glow_yellow.png"],
        Us: ["up_1.png"],
        Bs: ["up.png"],
        ds: ["perfect.png", "great.png", "cool.png", "bad.png", "miss.png"],
        ws: ["del_1.png", "del_2.png"],
        Ss: ["chance_1.png", "chance_2.png", "chance_3.png", "chance_4.png"],
        Js: ["c71.png"],
        ms: ["c41.png"],
        ks: ["c11.png"],
        Ls: ["c91.png"],
        ys: ["c61.png"],
        xs: ["c31.png"]
    };
    for (var a in s.A)
        s.A[a]._this = s
}
,
BUJS.R.prototype.F = function() {
    var s = this;
    this.Rs = {
        Ms: 80,
        Ts: 150,
        $s: 135,
        Fs: s.P.X - 350,
        Ys: 3,
        As: 67,
        Gs: 131,
        Ds: 5,
        Es: 256,
        Is: 123,
        Hs: 3,
        Ps: 1,
        Ws: 80,
        Xs: 46,
        qs: 20,
        Ns: 20,
        zs: 50,
        Cs: 14,
        Os: 40,
        Ks: 200,
        Qs: 60,
        Vs: 80,
        Zs: (s.P.H - 600) / 2,
        sa: 11,
        aa: 150
    }
}
,
BUJS.R.prototype.G = function(s, a, n) {
    var e = s._this;
    async.each(s, function(n, t) {
        if ("string" == typeof n) {
            var u = new Image;
            u.onload = function() {
                void 0 === e.A[a] && (e.A[a] = []),
                e.A[a][s.indexOf(n)] = u,
                t()
            }
            ,
            u.src = e.P.q + n
        }
    }, function(s) {
        s || n()
    })
}
,
BUJS.R.prototype.na = function() {
    var s = this;
    s.I.fillStyle = "black",
    s.I.clearRect(0, 0, s.P.H, s.P.X)
}
,
BUJS.R.prototype.ea = function(s, a, n, e, t) {
    var u = this;
    e || (e = "12px"),
    n || (n = "Arial"),
    t || (t = "white"),
    u.I.font = e + " " + n,
    u.I.fillStyle = t,
    u.I.fillText(a, s.x, s.y)
}
,
BUJS.R.prototype.ta = function(s, a) {
    var n = this;
    void 0 !== s && null !== s && void 0 !== s.pos && (void 0 === a && (a = 1),
    n.I.drawImage(s, s.pos.x, s.pos.y, s.width * a, s.height * a))
}
,
BUJS.R.prototype.ua = function(s) {
    var a = this;
    a.ta(a.A.Q[0]),
    a.ta(a.A.ss[0]),
    a.ta(a.A.V[0]),
    a.ta(a.A.as[0]),
    a.ta(a.A.z[0]),
    a.ia(s)
}
,
BUJS.R.prototype.ca = function() {
    var s = this;
    s.ta(s.A.Js[0]),
    s.ta(s.A.Ls[0]),
    s.ta(s.A.ms[0]),
    s.ta(s.A.ys[0]),
    s.ta(s.A.ks[0]),
    s.ta(s.A.xs[0])
}
,
BUJS.R.prototype.ia = function(s) {
    var a = this;
    s && (s >= 100 && s < 400 ? a.ta(a.A.vs[0]) : s >= 400 && a.ta(a.A.hs[0])),
    a.ta(a.A.ns[0])
}
,
BUJS.R.prototype.ra = function(s) {
    var a = this
      , n = null
      , e = null
      , t = 0
      , u = 0;
    if (s >= 400 ? (n = a.A.ls,
    t = 6) : s >= 100 ? (n = a.A.ls,
    e = a.A._s,
    u = 6 - (t = Math.floor((s - 100) / 50))) : (n = a.A._s,
    s >= 80 ? t = 5 : s >= 60 ? t = 4 : s >= 40 ? t = 3 : s >= 20 ? t = 2 : s >= 10 && (t = 1)),
    null != n)
        for (i = 0; i < t; i++)
            a.ba(n[0], a.P.H / 2 - a.Rs.Xs / 2 * (5 - 2 * i) - a.A.ls[0].width / 2, a.P.X - a.Rs.Ws - a.A.ls[0].height / 2),
            a.ta(n[0]),
            a.ta(a.A.gs[i]);
    if (null != e)
        for (var i = t; i < t + u; i++)
            a.ba(e[0], a.P.H / 2 - a.Rs.Xs / 2 * (5 - 2 * i) - a.A.ls[0].width / 2, a.P.X - a.Rs.Ws - a.A.ls[0].height / 2),
            a.ta(e[0]),
            a.ta(a.A.gs[i])
}
,
BUJS.R.prototype.oa = function() {
    var s = this;
    s.ta(s.A.K[0]),
    s.ta(s.A.Z[0])
}
,
BUJS.R.prototype.ba = function(s, a, n) {
    s.pos = {
        x: a,
        y: n
    }
}
,
BUJS.R.prototype.D = function() {
    var s = this;
    s.ba(s.A.z[0], s.P.H - s.A.z[0].width - s.Rs.qs, s.P.X - s.A.z[0].height - s.Rs.qs),
    s.ba(s.A.K[0], 0, s.Rs.Fs),
    s.ba(s.A.Q[0], s.Rs.Is - s.Rs.Hs - s.Rs.Ms, s.Rs.Fs),
    s.ba(s.A.V[0], s.A.Q[0].pos.x + s.Rs.Es, s.Rs.Fs),
    s.ba(s.A.Z[0], s.P.H - s.Rs.Is, s.Rs.Fs),
    s.ba(s.A.ss[0], s.P.H - s.Rs.Is + s.Rs.Hs - s.Rs.Es + s.Rs.Ms, s.Rs.Fs),
    s.ba(s.A.as[0], s.P.H - s.Rs.Is + s.Rs.Hs - s.Rs.Es - s.A.as[0].width + s.Rs.Ms, s.Rs.Fs),
    s.ba(s.A.ns[0], (s.P.H - s.A.ns[0].width) / 2, s.P.X - s.Rs.Ws - s.A.ns[0].height / 2),
    s.ba(s.A.ws[0], s.P.H / 2 + s.A.ns[0].width / 2, s.P.X - s.Rs.Ws - s.A.ws[0].height / 2),
    s.ba(s.A.ws[1], s.P.H / 2 + s.A.ns[0].width / 2, s.P.X - s.Rs.Ws - s.A.ws[1].height / 2),
    s.ba(s.A.Ss[0], s.P.H / 2 - s.A.ns[0].width / 2 - s.A.Ss[0].width, s.P.X - s.Rs.Ws - s.A.Ss[0].height / 2),
    s.ba(s.A.Ss[1], s.P.H / 2 - s.A.ns[0].width / 2 - s.A.Ss[1].width, s.P.X - s.Rs.Ws - s.A.Ss[1].height / 2),
    s.ba(s.A.Ss[2], s.P.H / 2 - s.A.ns[0].width / 2 - s.A.Ss[2].width, s.P.X - s.Rs.Ws - s.A.Ss[2].height / 2),
    s.ba(s.A.Ss[3], s.P.H / 2 - s.A.ns[0].width / 2 - s.A.Ss[3].width, s.P.X - s.Rs.Ws - s.A.Ss[3].height / 2),
    s.ba(s.A.hs[0], (s.P.H - s.A.ns[0].width) / 2, s.P.X - s.Rs.Ws - s.A.ns[0].height / 2),
    s.ba(s.A.vs[0], (s.P.H - s.A.ns[0].width) / 2, s.P.X - s.Rs.Ws - s.A.ns[0].height / 2);
    for (var a = 0; a < 6; a++)
        s.ba(s.A.gs[a], s.P.H / 2 - s.Rs.Xs / 2 * (5 - 2 * a) - s.A.gs[0].width / 2, s.P.X - s.Rs.Ws - s.A.gs[0].height / 2);
    var n = s.P.H - s.A.rs[0].width;
    s.ba(s.A.Js[0], 0, s.Rs.Fs + s.Rs.Ys),
    s.ba(s.A.Ls[0], n, s.Rs.Fs + s.Rs.Ys),
    s.ba(s.A.ms[0], 0, s.Rs.Fs + s.Rs.As),
    s.ba(s.A.ys[0], n, s.Rs.Fs + s.Rs.As),
    s.ba(s.A.ks[0], 0, s.Rs.Fs + s.Rs.Gs),
    s.ba(s.A.xs[0], n, s.Rs.Fs + s.Rs.Gs)
}
,
BUJS.R.prototype.pa = function(s, a, n, e, t) {
    var u = this
      , i = 0
      , c = u.Rs.Fs + n
      , r = bujs.a.ja.L();
    (i = e ? a + u.Rs.Is - u.Rs.Hs + u.Rs.Es - u.Rs.Ms + u.Rs.Ps - 40 * (t - r - 0) / bujs.a.ja.h : u.P.H - (a + u.Rs.Is - u.Rs.Hs + u.Rs.Es - u.Rs.Ms + u.Rs.Ps + s.width) + 40 * (t - r - 0) / bujs.a.ja.h) > u.P.H - u.Rs.Is || i + s.width < u.Rs.Is || (u.ba(s, i, c),
    u.ta(s))
}
,
BUJS.R.prototype.fa = function() {
    var s = this;
    s.pa(s.A.rs[0], 1, s.Rs.Ys, !0, bujs.a.ja.L()),
    s.pa(s.A.ps[0], 1, s.Rs.Ys, !1, bujs.a.ja.L()),
    s.pa(s.A.bs[0], 1 + s.Rs.Ds, s.Rs.As, !0, bujs.a.ja.L()),
    s.pa(s.A.js[0], 1 + s.Rs.Ds, s.Rs.As, !1, bujs.a.ja.L()),
    s.pa(s.A.os[0], 1, s.Rs.Gs, !0, bujs.a.ja.L()),
    s.pa(s.A.fs[0], 1, s.Rs.Gs, !1, bujs.a.ja.L())
}
,
BUJS.R.prototype.ga = function(s) {
    var a = this
      , n = Math.min(bujs.a.la + a.Rs.Cs, bujs.a.ja.g._.length);
    if (bujs.a.la >= 0)
        for (var e = bujs.a.ja.h, t = bujs.a.la; t < n; t++) {
            var u = bujs.a.ja.g._[t]
              , i = u.t
              , c = u.n
              , r = s + e * (a.Rs.Cs + 1)
              , b = s + 8 * e;
            if (5 !== c && i > r || 5 === c && i > b)
                break;
            if (!u._a) {
                var o = 0
                  , p = !0
                  , j = 0
                  , f = null
                  , g = s - i;
                if (g < 0 && (g = -g),
                o = Math.round(g / e) % 4,
                0 === bujs.a.ha)
                    switch (c) {
                    case 7:
                        f = a.A.rs[o],
                        j = a.Rs.Ys;
                        break;
                    case 4:
                        f = a.A.bs[o],
                        j = a.Rs.As;
                        break;
                    case 1:
                        f = a.A.os[o],
                        j = a.Rs.Gs;
                        break;
                    case 9:
                        p = !1,
                        f = a.A.ps[o],
                        j = a.Rs.Ys;
                        break;
                    case 6:
                        p = !1,
                        f = a.A.js[o],
                        j = a.Rs.As;
                        break;
                    case 3:
                        p = !1,
                        f = a.A.fs[o],
                        j = a.Rs.Gs
                    }
                if (1 === bujs.a.ha)
                    switch (c) {
                    case 7:
                        f = a.A.rs[o],
                        j = a.Rs.As;
                        break;
                    case 4:
                        f = a.A.bs[o],
                        j = a.Rs.As;
                        break;
                    case 1:
                        f = a.A.os[o],
                        j = a.Rs.As;
                        break;
                    case 9:
                        p = !1,
                        f = a.A.ps[o],
                        j = a.Rs.As;
                        break;
                    case 6:
                        p = !1,
                        f = a.A.js[o],
                        j = a.Rs.As;
                        break;
                    case 3:
                        p = !1,
                        f = a.A.fs[o],
                        j = a.Rs.As
                    }
                if (2 === bujs.a.ha)
                    switch (c) {
                    case 7:
                        f = a.A.rs[o],
                        j = a.Rs.Gs;
                        break;
                    case 4:
                        f = a.A.bs[o],
                        j = a.Rs.As;
                        break;
                    case 1:
                        f = a.A.os[o],
                        j = a.Rs.Ys;
                        break;
                    case 9:
                        p = !1,
                        f = a.A.ps[o],
                        j = a.Rs.Gs;
                        break;
                    case 6:
                        p = !1,
                        f = a.A.js[o],
                        j = a.Rs.As;
                        break;
                    case 3:
                        p = !1,
                        f = a.A.fs[o],
                        j = a.Rs.Ys
                    }
                if (null !== f)
                    a.pa(f, 0, j, p, i);
                else if (5 === c) {
                    var l = (a.P.H - a.A.es[0].width) / 2 - (i - s) / e * 31 / 2
                      , _ = (a.P.H - a.A.es[0].width) / 2 + (i - s) / e * 31 / 2
                      , h = a.P.X - a.Rs.Ws - a.A.es[0].height / 2;
                    a.ba(a.A.es[0], l, h),
                    a.ta(a.A.es[0]),
                    a.ba(a.A.es[0], _, h),
                    a.ta(a.A.es[0])
                }
            }
        }
}
,
BUJS.R.prototype.va = function() {
    var s = this;
    if (bujs.a.Ua > 0) {
        var a = bujs.a.ja.L() - bujs.a.Ua
          , n = s.A.ds[bujs.a.Ba]
          , e = 1;
        a < 50 && (e = 1 + (50 - a) / 90),
        s.ba(n, (s.P.H - n.width * e) / 2, (s.Rs.Ts - n.height * e) / 2),
        s.ta(n, e),
        a > 200 && (bujs.a.Ba = 0,
        bujs.a.Ua = 0)
    }
}
,
BUJS.da = function() {
    var s = this;
    $("body")[0].onkeydown = function(a) {
        var n = a.keyCode;
        s.wa(n)
    }
    ;
    var a = document.getElementsByTagName("canvas")[0];
    a.addEventListener("touchstart", function(a) {
        s.Sa(a)
    }, !1),
    bujs.d && a.addEventListener("touchend", function(a) {
        s.Ja(a)
    }, !1)
}
,
BUJS.da.prototype.wa = function(s) {
    var a = this;
    switch (s) {
    case 112:
        bujs.a.ma = !bujs.a.ma;
        break;
    case 113:
        break;
    case 114:
        bujs.a.ha = (bujs.a.ha + 1) % 3;
        break;
    case 115:
        bujs.a.ka = (bujs.a.ka + 1) % (bujs.a.La.A.N.length + 1);
        break;
    case 16:
        bujs.a.ya = !bujs.a.ya;
        break;
    case 93:
        bujs.a.xa = !bujs.a.xa;
    case 55:
    case 82:
    case 69:
    case 103:
    case 36:
        bujs.a.xa || a.Ra(7);
        break;
    case 52:
    case 70:
    case 100:
    case 37:
        bujs.a.xa || a.Ra(4);
        break;
    case 49:
    case 86:
    case 97:
    case 35:
        bujs.a.xa || a.Ra(1);
        break;
    case 57:
    case 73:
    case 105:
    case 33:
        bujs.a.xa || a.Ra(9);
        break;
    case 54:
    case 75:
    case 74:
    case 102:
    case 39:
        bujs.a.xa || a.Ra(6);
        break;
    case 51:
    case 77:
    case 78:
    case 99:
    case 34:
        bujs.a.xa || a.Ra(3);
        break;
    case 48:
    case 53:
    case 32:
    case 96:
    case 101:
        bujs.a.xa || a.Ra(5)
    }
}
,
BUJS.da.prototype.Ra = function(s) {
    var a = !0
      , n = -1
      , e = 0
      , t = 0
      , u = 0
      , i = 0;
    switch (s) {
    case 7:
        n = 0,
        u = bujs.a.La.Rs.Ys;
        break;
    case 4:
        n = 1,
        t = 6,
        u = bujs.a.La.Rs.As;
        break;
    case 1:
        n = 2,
        u = bujs.a.La.Rs.Gs;
        break;
    case 9:
        n = 3,
        a = !1,
        u = bujs.a.La.Rs.Ys;
        break;
    case 6:
        n = 4,
        a = !1,
        t = -5,
        u = bujs.a.La.Rs.As;
        break;
    case 3:
        n = 5,
        a = !1,
        u = bujs.a.La.Rs.Gs
    }
    n >= 0 && (a ? (e = bujs.a.La.Rs.Is - bujs.a.La.Rs.Hs - bujs.a.La.Rs.Ms - bujs.a.La.Rs.Ps,
    t = t + bujs.a.La.Rs.Is - bujs.a.La.Rs.Hs + bujs.a.La.Rs.Es - bujs.a.La.Rs.Ms + bujs.a.La.Rs.Ps) : (e = bujs.a.La.P.H - (bujs.a.La.Rs.Is - bujs.a.La.Rs.Ms + bujs.a.La.Rs.Es - bujs.a.La.Rs.Ps + bujs.a.La.A.os[0].width + 3),
    t = t + bujs.a.La.P.H - (bujs.a.La.Rs.Is - bujs.a.La.Rs.Hs + bujs.a.La.Rs.Es - bujs.a.La.Rs.Ms + bujs.a.La.Rs.Ps + bujs.a.La.A.os[0].width + 1)),
    i = u + bujs.a.La.Rs.Fs + bujs.a.La.A.os[0].height / 2 - bujs.a.La.A.O[0].height / 2,
    u = u + bujs.a.La.Rs.Fs + bujs.a.La.A.os[0].height / 2 - bujs.a.La.A.C[0].height / 2,
    bujs.a.Ma.push(new BUJS.Ta(bujs.a.La,bujs.a.ja.L(),bujs.a.La.Rs.$s,bujs.a.La.A.C[n],e,u)),
    bujs.a.Ma.push(new BUJS.Ta(bujs.a.La,bujs.a.ja.L(),bujs.a.La.Rs.$s,bujs.a.La.A.O[n],t,i))),
    5 === s && bujs.a.Ma.push(new BUJS.Ta(bujs.a.La,bujs.a.ja.L(),bujs.a.La.Rs.$s,bujs.a.La.A.ts[0],(bujs.a.La.P.H - bujs.a.La.A.ts[0].width) / 2,bujs.a.La.P.X - bujs.a.La.Rs.Ws - bujs.a.La.A.ts[0].height / 2)),
    bujs.a.$a(s)
}
,
BUJS.da.prototype.Sa = function(s) {
    s.preventDefault();
    for (var a = this, n = s.changedTouches[0].target, e = n.offsetLeft, t = n.offsetTop, u = bujs.a.La.A.rs[0], i = bujs.a.La.A.ns[0], c = bujs.a.La.A.z[0], r = bujs.a.La.Rs.Is - bujs.a.La.Rs.Hs + bujs.a.La.Rs.Es - bujs.a.La.Rs.Ms + bujs.a.La.Rs.Ps, b = bujs.a.La.P.H - (bujs.a.La.Rs.Is - bujs.a.La.Rs.Hs + bujs.a.La.Rs.Es - bujs.a.La.Rs.Ms + bujs.a.La.Rs.Ps + u.width), o = (bujs.a.La.P.H - i.width) / 2, p = bujs.a.La.P.X - bujs.a.La.Rs.Ws - i.height / 2, j = 0; j < s.changedTouches.length; j++) {
        var f = s.changedTouches[j]
          , g = f.pageX - e
          , l = f.pageY - t
          , _ = 0
          , h = 0;
        l >= bujs.a.La.Rs.Fs + bujs.a.La.Rs.Ys && l <= bujs.a.La.Rs.Fs + bujs.a.La.Rs.Ys + u.height && (h = 1),
        l >= bujs.a.La.Rs.Fs + bujs.a.La.Rs.As && l <= bujs.a.La.Rs.Fs + bujs.a.La.Rs.As + u.height && (h = 2),
        l >= bujs.a.La.Rs.Fs + bujs.a.La.Rs.Gs && l <= bujs.a.La.Rs.Fs + bujs.a.La.Rs.Gs + u.height && (h = 3);
        var v = 0;
        (g >= r && g <= r + u.width || g >= 0 && g <= bujs.a.La.A.K[0].width) && (v = 1),
        (g >= b && g <= b + u.width || g >= bujs.a.La.P.H - bujs.a.La.A.Z[0].width && g <= bujs.a.La.P.H) && (v = 2),
        1 === h && 1 === v ? _ = 7 : 2 === h && 1 === v ? _ = 4 : 3 === h && 1 === v ? _ = 1 : 1 === h && 2 === v ? _ = 9 : 2 === h && 2 === v ? _ = 6 : 3 === h && 2 === v && (_ = 3),
        g >= o && g <= o + i.width && l >= p && l <= p + i.height && (_ = 5),
        g >= 0 && g <= c.width && l >= bujs.a.La.P.X - c.height && l <= bujs.a.La.P.X && (_ = 5),
        g >= bujs.a.La.P.H - c.width && g <= bujs.a.La.P.H && l >= bujs.a.La.P.X - c.height && l <= bujs.a.La.P.X && (_ = 5),
        0 !== _ && a.Ra(_)
    }
}
,
BUJS.da.prototype.Ja = function(s) {
    var a = bujs.a.ja;
    void 0 !== a.m && null !== a.m || a.o.decodeAudioData(a.w.slice(0), function(s) {
        a.S = a.J(s),
        a.m = a.o.currentTime,
        a.S.start(0),
        void 0 !== a.p && a.p.call(bujs.a, a)
    }, function(s) {})
}
,
BUJS.Ta = function(s, a, n, e, t, u) {
    this.La = s,
    this.Fa = a,
    this.Ya = n || bujs.a.La.Rs.$s,
    this.Aa = e || null,
    this.Ga = t || 0,
    this.Da = u || 0
}
,
BUJS.Ta.prototype.Ea = function(s) {
    var a = this;
    return 1 - (s - a.Fa) / a.Ya
}
,
BUJS.Ta.prototype.Ia = function(s) {
    var a = this;
    null != a.Aa && (a.Fa + a.Ya > s ? a.Fa <= s && (a.Aa.pos = {
        x: a.Ga,
        y: a.Da
    },
    a.La.I.globalAlpha = a.Ea(s),
    a.La.ta(a.Aa),
    a.La.I.globalAlpha = 1) : a.Fa = -1)
}
,
BUJS.Ha = function(s) {
    var a = this;
    this.f = s,
    this.Pa = [],
    this.Wa = 0,
    this.Xa = 0,
    this.la = 0,
    this.Ba = 0,
    this.Ua = 0,
    this.qa = 0,
    this.Na = [0, 0, 0, 0, 0],
    this.za = 0,
    this.Ca = 0,
    this.Oa = 0,
    this.Ka = 0,
    this.Qa = 0,
    this.ha = 0,
    this.ka = 0,
    this.ya = !1,
    this.ma = !1,
    this.Va = 0,
    this.Ma = [],
    this.Za = [],
    this.xa = !1,
    this.sn = !1,
    this.an = [480, 240, 120, 60, 0],
    this.nn = 2e3,
    this.en = 1.2,
    this.tn = 1.44,
    setTimeout(function() {
        a.ja = new BUJS.e(a.p)
    }, 0),
    this.La = new BUJS.R(this.p),
    this.La.Y(),
    this.un = new BUJS.da
}
,
BUJS.Ha.prototype.p = function(s) {
    var a = this;
    if (void 0 !== s) {
        var n = s.constructor.name;
        a.Pa.indexOf(s) < 0 && a.Pa.push(n),
        2 === a.Pa.length && a.in()
    }
}
,
BUJS.Ha.prototype.in = function() {
    gl_()
}
,
BUJS.Ha.prototype.s = function() {
    var s = this;
    s.cn(),
    s.rn(),
    null !== s.ja.o && window.requestAnimationFrame(gl_)
}
,
BUJS.Ha.prototype.rn = function() {
    var s = this;
    s.La.na(),
    0 !== bujs.a.ka && s.La.ta(s.A.N[bujs.a.ka - 1]),
    void 0 !== s.ja.m && null !== s.ja.m || bujs.B("Touch/click to start music");
    var a = s.bn()
      , n = {
        x: 5,
        y: 15
    };
    s.La.ea(n, a.toFixed(1)),
    s.La.ea({
        x: 5,
        y: s.La.P.X - 5
    }, s.ja.L().toFixed(2)),
    s.La.ua(s.Oa),
    s.La.ra(s.Oa),
    s.ya && s.La.fa(),
    s.pn(),
    s.La.ga(s.ja.L()),
    s.La.va(),
    s.jn(),
    s.La.oa(),
    s.La.ca()
}
,
BUJS.Ha.prototype.cn = function() {}
,
BUJS.Ha.prototype.bn = function() {
    var s = this
      , a = s.ja.L();
    return s.Wa++,
    0 === s.qa && (s.qa = a),
    a > s.qa + 1e3 && (s.Xa = s.Wa / (a - s.qa) * 1e3,
    s.qa = a,
    s.Wa = 0),
    s.Xa
}
,
BUJS.Ha.prototype.jn = function() {
    var s = this
      , a = s.ja.L()
      , n = Math.min(s.la + s.La.Rs.Cs, s.ja.g._.length);
    if (s.xa) {
        if (s.la >= 0)
            for (var e = s.la; e < n; e++)
                if (s.ja.g._[e].t < a + 5) {
                    s.un.Ra(s.ja.g._[e].n);
                    break
                }
    } else {
        if (s.la >= 0)
            for (e = s.la; e < n; e++)
                a > s.ja.g._[e].t + 2 * s.ja.h && (s.ja.g._[e]._a = !0,
                s.Ba = 4,
                s.Ua = a,
                s.ja.k(s.ja.u.r),
                s.fn(s.ja.g._[e].n, 4));
        s.la = -1;
        for (var t = 0; t < s.ja.g._.length; t++)
            if (!s.ja.g._[t]._a) {
                s.la = t;
                break
            }
    }
}
,
BUJS.Ha.prototype.$a = function(s) {
    var a = this
      , n = -1;
    if (0 !== s || a.xa)
        for (var e = a.ja.L(), t = a.la; t < a.la + 4 && !(a.la >= a.ja.g._.length || a.la < 0); t++) {
            var u = a.ja.g._[t]
              , i = u.n
              , c = e - u.t;
            if ((i === s || a.xa || a.sn) && (n = a.gn(c),
            a.fn(s, n),
            5 === i && a.Ma.push(new BUJS.Ta(a.La,e,a.La.Rs.$s,a.La.A.ts[0],(a.La.P.H - a.La.A.ts[0].width) / 2,a.La.P.X - a.La.Rs.Ws - a.La.A.ts[0].height / 2)),
            n >= 0 || a.xa)) {
                switch (i) {
                case 5:
                    a.Ma.push(new BUJS.Ta(a.La,e,a.La.Rs.$s,a.La.A.us[0],(a.La.P.H - a.La.A.us[0].width) / 2,a.La.P.X - a.La.Rs.Ws - a.La.A.us[0].height / 2))
                }
                if (4 !== n && 5 !== i) {
                    var r = !0
                      , b = 0;
                    switch (i) {
                    case 7:
                        b = a.La.Rs.Ys;
                        break;
                    case 4:
                        b = a.La.Rs.As;
                        break;
                    case 1:
                        b = a.La.Rs.Gs;
                        break;
                    case 9:
                        r = !1,
                        b = a.La.Rs.Ys;
                        break;
                    case 6:
                        r = !1,
                        b = a.La.Rs.As;
                        break;
                    case 3:
                        r = !1,
                        b = a.La.Rs.Gs
                    }
                    b = a.La.Rs.Fs + b + a.La.A.os[0].height / 2,
                    r ? a.Ma.push(new BUJS.Ta(a.La,e,a.La.Rs.$s,a.La.A.cs[0],a.La.Rs.Is - a.La.Rs.Hs + a.La.Rs.Es - a.La.Rs.Ms + a.La.Rs.Ps + a.La.A.os[0].width / 2 - a.La.A.cs[0].width / 2,b - a.La.A.cs[0].width / 2)) : a.Ma.push(new BUJS.Ta(a.La,e,a.La.Rs.$s,a.La.A.cs[0],a.La.P.H - (a.La.Rs.Is - a.La.Rs.Hs + a.La.Rs.Es - a.La.Rs.Ms + a.La.Rs.Ps + a.La.A.os[0].width / 2) - a.La.A.cs[0].width / 2,b - a.La.A.cs[0].height / 2))
                }
                5 === i ? a.ja.k(a.ja.u.b) : 0 === n ? a.ja.k(a.ja.u.i) : 4 === n ? a.ja.k(a.ja.u.r) : a.ja.k(a.ja.u.c),
                a.fn(i, n),
                u._a = !0,
                a.la = -1;
                for (var o = 0; o < a.ja.g._.length; o++)
                    if (void 0 === a.ja.g._[o]._a || !a.ja.g._[o]._a) {
                        a.la = o;
                        break
                    }
                a.Ba = n,
                a.Ua = e;
                break
            }
        }
}
,
BUJS.Ha.prototype.gn = function(s) {
    var a = this;
    if (a.xa)
        return 0;
    var n = a.ja.h;
    return s > 4 * n * 80 / 100 || s < 4 * -n ? -1 : (s < 0 && (s = -s),
    s <= 4 * n * 5 / 100 ? 0 : s <= 4 * n * 15 / 100 ? 1 : s <= 4 * n * 27 / 100 ? 2 : s <= 4 * n * 40 / 100 ? 3 : 4)
}
,
BUJS.Ha.prototype.pn = function() {
    for (var s = this, a = 0; a < s.Ma.length; a++)
        s.Ma[a].Ia(s.ja.L());
    for (a = s.Ma.length - 1; a >= 0; a--)
        s.Ma[a].Fa < 0 && s.Ma.splice(a, 1)
}
,
BUJS.Ha.prototype.fn = function(s, a) {
    var n = this
      , e = n.an[a];
    5 === s && (e = n.nn),
    n.Oa >= 400 ? e *= n.tn : n.Oa >= 100 && (e *= n.en),
    n.za += e,
    n.Na[a]++,
    4 !== a ? n.Oa++ : n.Oa = 0,
    0 === n.Ba && 0 === a ? n.Ca++ : n.Ca = 0
}
,
BUJS.prototype.ln = function() {
    var s = this;
    s._n(),
    s.B("Loading extra UI components"),
    $.get("template/modal.html", function(a) {
        $("#template-container").html(a),
        s.hn()
    }),
    s.d = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
}
,
BUJS.prototype.vn = function(s) {
    var a = document.querySelector(s)
      , n = document.importNode(a.content, !0);
    document.body.appendChild(n)
}
,
BUJS.prototype.Un = function() {
    var s = $("#login-modal");
    s.on("shown.bs.modal", function() {
        s.find("#username").focus()
    }),
    s.modal("show")
}
,
BUJS.prototype.hn = function() {
    var s = this;
    s.B("Loading songs"),
    $.get("notes/list.json", function(a) {
        s.l = a,
        s.Bn()
    })
}
,
BUJS.prototype.Bn = function() {
    var s = this;
    s.B(""),
    s.vn("#songlist-template");
    var a = $("#songlist-modal")
      , n = a.find("#songlist-container");
    for (var e in s.l) {
        var t = s.l[e]
          , u = document.createElement("li");
        u.setAttribute("class", "songListItem"),
        u.setAttribute("songid", e),
        u.innerText = "[" + t.bpm.toFixed(1) + "] " + t.singer + " " + t.name + " (" + t.slkauthor + ")",
        u.onclick = s.dn,
        n.append(u)
    }
    a.modal("show")
}
,
BUJS.prototype._n = function() {
    var s = document.getElementById("cvs");
    s.width = 980,
    s.height = 400
}
,
BUJS.prototype.dn = function() {
    var s = this.getAttribute("songid");
    bujs.a = new BUJS.Ha(s),
    $("#songlist-modal").modal("hide")
}
,
BUJS.prototype.B = function(s) {
    var a = document.getElementById("cvs")
      , n = a.getContext("2d")
      , e = a.width
      , t = a.height;
    n.fillStyle = "black",
    n.clearRect(0, 0, e, t),
    n.font = "12px Arial",
    n.fillStyle = "white",
    n.textAlign = "center",
    n.fillText(s, e / 2, t / 2)
}
,
bujs = new BUJS,
$(window).on("load", function() {
    bujs.ln()
});
