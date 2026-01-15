const API_URL = "https://techy-api.vercel.app/api/json";

const els = {
  phrase: document.getElementById("phrase"),
  btn: document.getElementById("btnRefresh"),
  statusText: document.getElementById("statusText"),
  errorBox: document.getElementById("errorBox"),
  badgeDot: document.querySelector(".badge-dot"),
  badgeText: document.getElementById("badgeText"),
  metaSource: document.getElementById("metaSource"),
  metaStatus: document.getElementById("metaStatus"),
  metaLength: document.getElementById("metaLength"),
  metaWords: document.getElementById("metaWords"),
  metaTime: document.getElementById("metaTime"),
};

function setLoading(isLoading) {
  els.btn.disabled = isLoading;
  if (isLoading) {
    els.statusText.textContent = "Status: se încarcă...";
    els.badgeText.textContent = "Loading";
    els.badgeDot.style.background = "#f1c40f"; // galben
  } else {
    els.statusText.textContent = "Status: gata";
    els.badgeText.textContent = "Ready";
    els.badgeDot.style.background = "#2ecc71"; // verde
  }
}

function showError(message) {
  els.errorBox.hidden = false;
  els.errorBox.textContent = message;
  els.metaStatus.textContent = "Eroare";
  els.badgeText.textContent = "Error";
  els.badgeDot.style.background = "#e74c3c"; // roșu
}

function clearError() {
  els.errorBox.hidden = true;
  els.errorBox.textContent = "";
}

function computeWordCount(text) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function setMetadata({ ok, message }) {
  const now = new Date();
  els.metaSource.textContent = "Techy API";
  els.metaStatus.textContent = ok ? "OK" : "Eroare";
  els.metaLength.textContent = message.length.toString();
  els.metaWords.textContent = computeWordCount(message).toString();
  els.metaTime.textContent = now.toLocaleString();
}

async function fetchTechyPhrase() {
  console.log("[Techy] Cerere trimisă către API:", API_URL);

  const response = await fetch(API_URL, { method: "GET" });
  console.log("[Techy] Răspuns primit. HTTP status:", response.status);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} (${response.statusText})`);
  }

  const data = await response.json();
  console.log("[Techy] JSON primit:", data);

  if (!data || typeof data.message !== "string") {
    throw new Error("Răspuns invalid: lipsește câmpul 'message'.");
  }

  return data.message;
}

async function loadPhrase() {
  clearError();
  setLoading(true);

  try {
    console.log("[Techy] Încep încărcarea frazei...");
    const message = await fetchTechyPhrase();

    console.log("[Techy] Afișez fraza în UI.");
    els.phrase.textContent = message;

    setMetadata({ ok: true, message });
    console.log("[Techy] Metadate actualizate cu succes.");
  } catch (err) {
    console.error("[Techy] Eroare la încărcare:", err);

    const uiMsg =
      "Nu am putut încărca fraza. Verifică conexiunea la internet sau încearcă din nou.";
    showError(`${uiMsg} (Detalii: ${err.message})`);

    // dacă e eroare, păstrăm în tabel valori safe
    setMetadata({ ok: false, message: "" });
  } finally {
    setLoading(false);
    console.log("[Techy] Încărcare finalizată.");
  }
}

els.btn.addEventListener("click", () => {
  console.log("[Techy] Click pe buton -> refresh frază.");
  loadPhrase();
});

// opțional: încarcă automat o frază la deschiderea paginii
loadPhrase();
