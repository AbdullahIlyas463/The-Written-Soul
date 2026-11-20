/* The Written Soul — site behaviour.
   You normally never need to edit this file to add a story (use stories.js). */
(function () {
  var $ = function (s) { return document.querySelector(s); };
  var grid = $("#grid"), search = $("#search"), filtersEl = $("#filters");
  var STORIES = window.STORIES || [];
  var cat = "All", idx = 0, lang = "english", sizeStep = 1;
  var sizes = [16, 18, 20];

  // Safe storage helpers (storage can be blocked in some browsers)
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  function esc(t) {
    return String(t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // Escape first, then turn *italic* and **bold** markers into tags (story text is otherwise untouched)
  function rich(t) {
    return esc(t)
      .replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>");
  }
  function plain(t) { return String(t).replace(/\*/g, ""); }
  function pad(n) { return String(n).padStart(2, "0"); }
  function hasUrdu(s) { return Array.isArray(s.urdu) && s.urdu.length > 0; }

  /* ---------- category filter buttons are built from the stories ---------- */
  function buildFilters() {
    var cats = ["All"];
    STORIES.forEach(function (s) { if (s.category && cats.indexOf(s.category) < 0) cats.push(s.category); });
    filtersEl.innerHTML = cats.map(function (c) {
      return '<button type="button" data-cat="' + esc(c) + '"' + (c === cat ? ' class="active"' : "") + ">" + (c === "All" ? "All stories" : esc(c)) + "</button>";
    }).join("");
  }

  /* ---------- story cards ---------- */
  function render() {
    var q = search.value.trim().toLowerCase();
    var arr = STORIES.map(function (s, i) { return Object.assign({}, s, { i: i }); }).filter(function (s) {
      var hay = [s.title, s.urduTitle, s.genre, s.category, s.quote].join(" ").toLowerCase();
      return (cat === "All" || s.category === cat) && hay.indexOf(q) >= 0;
    });
    var html = arr.map(function (s) {
      return '<article class="card" tabindex="0" role="button" data-i="' + s.i + '" aria-label="Read ' + esc(s.title) + '">' +
        '<div class="cover cv-' + esc(s.cover || "default") + '"><small>Story ' + pad(s.i + 1) + '</small><span class="sym">' + esc(s.symbol || "✦") + '</span></div>' +
        '<div class="card-content">' +
        '<div class="meta"><span>' + esc(s.category || "") + " · " + esc(s.genre || "") + "</span><span>" + esc(s.readingTime || "") + "</span></div>" +
        "<h3>" + esc(s.title) + "</h3>" +
        (s.urduTitle ? '<div class="urdu">' + esc(s.urduTitle) + "</div>" : "") +
        '<p class="blurb">“' + esc(plain(s.quote || "")) + "”</p>" +
        '<div class="card-bottom"><span>' + (hasUrdu(s) ? "English &amp; اردو" : "English") + "</span><b>Read story ↗</b></div>" +
        "</div></article>";
    }).join("");
    if (cat === "All" && !q) {
      html += '<div class="card soon"><div class="soon-inner"><span>✦</span><h3>More stories<br>are on the way</h3><p>New tales are added here as they are written.</p></div></div>';
    }
    grid.innerHTML = html;
    $("#count").textContent = pad(arr.length) + (arr.length === 1 ? " story" : " stories");
    $("#empty").hidden = arr.length > 0;
    grid.querySelectorAll(".card[data-i]").forEach(function (c) {
      c.onclick = function () { openStory(+c.dataset.i); };
      c.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openStory(+c.dataset.i); } };
    });
  }

  /* ---------- reader ---------- */
  function openStory(i, keepHash) {
    idx = i;
    var s = STORIES[i];
    lang = "english";
    if (!Array.isArray(s.english) || !s.english.length) lang = hasUrdu(s) ? "urdu" : "english";
    $("#title").textContent = s.title;
    var ut = $("#utitle"); ut.textContent = s.urduTitle || ""; ut.hidden = !s.urduTitle;
    $("#meta").textContent = [s.category, s.genre, s.readingTime].filter(Boolean).join(" / ").toUpperCase();
    $("#langs").hidden = !(hasUrdu(s) && Array.isArray(s.english) && s.english.length);
    draw();
    var r = $("#reader");
    r.classList.add("open"); r.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    $("#reader article").scrollTop = 0;
    if (!keepHash && s.id) { try { history.replaceState(null, "", "#story=" + s.id); } catch (e) {} }
  }
  function draw() {
    var s = STORIES[idx];
    document.querySelectorAll("#langs button").forEach(function (b) { b.classList.toggle("active", b.dataset.lang === lang); });
    var b = $("#body");
    b.className = lang === "urdu" ? "urdu" : "";
    b.setAttribute("lang", lang === "urdu" ? "ur" : "en");
    b.setAttribute("dir", lang === "urdu" ? "rtl" : "ltr");
    b.innerHTML = (s[lang] || []).map(function (p) { return "<p>" + rich(p) + "</p>"; }).join("");
    var qt = lang === "urdu" && s.urduQuote ? s.urduQuote : s.quote;
    var qe = $("#quote");
    qe.textContent = qt ? "“" + plain(qt) + "”" : "";
    qe.hidden = !qt;
    qe.className = lang === "urdu" ? "urdu" : "";
    qe.setAttribute("dir", lang === "urdu" ? "rtl" : "ltr");
  }
  function closeReader() {
    var r = $("#reader");
    r.classList.remove("open"); r.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {}
  }

  /* ---------- events ---------- */
  filtersEl.onclick = function (e) {
    var b = e.target.closest("button[data-cat]");
    if (!b) return;
    cat = b.dataset.cat;
    filtersEl.querySelectorAll("button").forEach(function (x) { x.classList.toggle("active", x === b); });
    render();
  };
  search.oninput = render;
  document.querySelectorAll("#langs button").forEach(function (b) {
    b.onclick = function () { lang = b.dataset.lang; draw(); };
  });
  $("#back").onclick = closeReader;
  $("#shade").onclick = closeReader;
  $("#prev").onclick = function () { openStory((idx + STORIES.length - 1) % STORIES.length); };
  $("#next").onclick = function () { openStory((idx + 1) % STORIES.length); };
  $("#theme").onclick = function () {
    var dark = document.body.classList.toggle("dark");
    save("tws-theme", dark ? "dark" : "light");
  };
  $("#font").onclick = function () {
    sizeStep = (sizeStep + 1) % sizes.length;
    $("#reader").style.setProperty("--read", sizes[sizeStep] + "px");
    save("tws-size", String(sizeStep));
  };
  document.addEventListener("keydown", function (e) {
    if (!$("#reader").classList.contains("open")) return;
    if (e.key === "Escape") closeReader();
  });

  /* ---------- start up ---------- */
  var t = load("tws-theme");
  // Night mode is the default; a visitor who picks light mode keeps that choice.
  if (t !== "light") document.body.classList.add("dark");
  var sz = parseInt(load("tws-size"), 10);
  if (sz >= 0 && sz < sizes.length) { sizeStep = sz; $("#reader").style.setProperty("--read", sizes[sz] + "px"); }
  $("#heroCount").textContent = pad(STORIES.length) + (STORIES.length === 1 ? " story" : " stories");
  buildFilters();
  render();
  var m = location.hash.match(/^#story=(.+)$/);
  if (m) {
    var found = STORIES.findIndex(function (s) { return s.id === decodeURIComponent(m[1]); });
    if (found >= 0) openStory(found, true);
  }
})();
