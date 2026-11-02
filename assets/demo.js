// One-word demo. Never autoplays; plays the sentence once on tap at 250 WPM, then rests on the last word.
// Without JS the static word stays and the button stays hidden.
(function () {
  var root = document.querySelector("[data-demo]");
  if (!root) return;
  var word = root.querySelector(".word");
  var btn = root.querySelector("button");
  var words = (root.getAttribute("data-text") || "").split(/\s+/).filter(Boolean);
  var WPM = 250; // fixed; must stay at or below 350 (free cap) and is never shown
  var MS = Math.round(60000 / Math.min(WPM, 350));
  var timer = null;
  var i = 0;

  // Same ORP rule as lib/rsvp.ts orpIndexForLength
  function orp(len) { return len <= 1 ? 0 : len <= 5 ? 1 : len <= 9 ? 2 : len <= 13 ? 3 : 4; }
  function show(w) {
    var c = Array.from(w);
    var k = orp(c.length);
    word.innerHTML = "";
    [["b", c.slice(0, k).join("")], ["p", c[k] || ""], ["a", c.slice(k + 1).join("")]].forEach(function (part) {
      var s = document.createElement("span");
      s.className = part[0];
      s.textContent = part[1];
      word.appendChild(s);
    });
  }
  function stop(rest) {
    clearTimeout(timer);
    timer = null;
    btn.textContent = rest ? "Start again" : "Start";
  }
  function tick() {
    if (i >= words.length) { stop(true); return; }
    var w = words[i++];
    show(w);
    timer = setTimeout(tick, MS); // even timing, same as the app reader (RSVP_TIMING multipliers are 1)
  }
  btn.addEventListener("click", function () {
    if (timer) { stop(false); return; }
    if (i >= words.length) i = 0;
    btn.textContent = "Pause";
    tick();
  });
  btn.hidden = false;
})();
