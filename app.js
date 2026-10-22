(() => {
  const STORAGE_KEY = "mon-hydratation-v1";
  const $ = (id) => document.getElementById(id);
  const todayKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  };
  const defaultState = () => ({ date: todayKey(), entries: [], goal: 3000, glassSize: 200 });
  let state = loadState();
  let toastTimer;
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const saved = JSON.parse(raw);
      if (saved.date !== todayKey()) return { ...defaultState(), goal: saved.goal || 3000, glassSize: saved.glassSize || 200 };
      return {
        date: saved.date, entries: Array.isArray(saved.entries) ? saved.entries : [],
        goal: [3000,3500,4000].includes(saved.goal) ? saved.goal : 3000,
        glassSize: [200,250,300,500].includes(saved.glassSize) ? saved.glassSize : 200
      };
    } catch (_) { return defaultState(); }
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (_) { showToast("Impossible d’enregistrer sur cet appareil."); }
  }
  function fmtLitres(ml) {
    return (ml / 1000).toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 2 });
  }
  function fmtDate() {
    return new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  }
  function showToast(message) {
    const el = $("toast"); el.textContent = message; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 1900);
  }
  function render() {
    const total = state.entries.reduce((sum, e) => sum + e.ml, 0);
    const pct = Math.min(100, Math.round(total / state.goal * 100));
    const remaining = Math.max(0, state.goal - total);
    $("todayLabel").textContent = fmtDate();
    $("consumedLitres").textContent = fmtLitres(total);
    $("goalLitres").textContent = fmtLitres(state.goal);
    $("percent").textContent = `${pct}%`;
    $("progressFill").style.width = `${pct}%`;
    $("progressBar").setAttribute("aria-valuenow", String(pct));
    $("remainingText").textContent = remaining ? `${fmtLitres(remaining)} L restants` : "Objectif atteint 🎉";
    $("glassSummary").textContent = `${state.entries.length} verre${state.entries.length === 1 ? "" : "s"}`;
    $("glassSize").value = String(state.glassSize);
    $("addButtonDetail").textContent = `Ajouter ${state.glassSize} ml`;
    $("undoGlass").disabled = state.entries.length === 0;
    $("historyCount").textContent = String(state.entries.length);
    document.querySelectorAll("[data-goal]").forEach(btn => {
      const active = Number(btn.dataset.goal) === state.goal;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
    const history = $("glassHistory");
    if (!state.entries.length) {
      history.innerHTML = '<p class="empty-state">Tes verres apparaîtront ici. À toi de jouer !</p>';
    } else {
      history.innerHTML = state.entries.slice().reverse().map((entry, i) => {
        const index = state.entries.length - i;
        const time = new Date(entry.time).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
        return `<div class="glass-item" title="Verre ${index}, ajouté à ${time}"><span class="drop" aria-hidden="true">💧</span><span class="ml">${entry.ml} ml</span></div>`;
      }).join("");
    }
  }
  function addWater(ml) {
    state.entries.push({ ml, time: new Date().toISOString() });
    save(); render();
    const total = state.entries.reduce((sum, e) => sum + e.ml, 0);
    showToast(total >= state.goal ? "Objectif atteint — bravo !" : `+${ml} ml ajoutés`);
  }
  $("addGlass").addEventListener("click", () => addWater(state.glassSize));
  $("addBottle").addEventListener("click", () => addWater(500));
  $("undoGlass").addEventListener("click", () => {
    if (!state.entries.length) return;
    state.entries.pop(); save(); render(); showToast("Dernier verre annulé");
  });
  $("glassSize").addEventListener("change", (event) => {
    state.glassSize = Number(event.target.value); save(); render();
  });
  document.querySelectorAll("[data-goal]").forEach(btn => btn.addEventListener("click", () => {
    state.goal = Number(btn.dataset.goal); save(); render(); showToast(`Objectif réglé sur ${fmtLitres(state.goal)} L`);
  }));
  $("resetDay").addEventListener("click", () => {
    if (!state.entries.length) { showToast("Le compteur est déjà à zéro"); return; }
    if (window.confirm("Effacer tous les verres enregistrés pour aujourd’hui ?")) {
      state.entries = []; save(); render(); showToast("Compteur réinitialisé");
    }
  });
  // If the app stays open past midnight, switch to a fresh daily log.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && state.date !== todayKey()) {
      state = { ...defaultState(), goal: state.goal, glassSize: state.glassSize };
      save(); render();
    }
  });
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
  }
  render();
})();