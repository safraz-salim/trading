import { db, auth } from "./firebase.js";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// ===== Initialize Live Forex Chart =====
function initLiveChart() {
  if (!document.getElementById("liveChart")) return;

  new TradingView.widget({
    width: "100%",
    height: 400,
    symbol: "FX:EURUSD",  // change to any Forex pair
    interval: "15",
    timezone: "Etc/UTC",
    theme: "dark",
    style: "1",
    locale: "en",
    toolbar_bg: "#1f1f1f",
    enable_publishing: false,
    allow_symbol_change: true,
    container_id: "liveChart"
  });
}

// ===== Initialize Live Chat =====
function initLiveChat() {
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");

  if (!chatForm || !chatInput || !chatMessages) return;

  const chatRef = collection(db, "liveChat");
  const chatQuery = query(chatRef, orderBy("timestamp", "asc"));

  // Listen for new messages
  onSnapshot(chatQuery, (snapshot) => {
    chatMessages.innerHTML = "";
    snapshot.forEach(doc => {
      const message = doc.data();
      const p = document.createElement("p");

      if (message.user === (auth.currentUser.displayName || "Trader")) {
        p.classList.add("my-message");
      } else {
        p.classList.add("other-message");
      }

      p.textContent = `${message.user}: ${message.text}`;
      chatMessages.appendChild(p);
    });

    chatMessages.scrollTo({
      top: chatMessages.scrollHeight,
      behavior: "smooth"
    });
  });

  // Send message
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    try {
      await addDoc(chatRef, {
        user: auth.currentUser.displayName || "Trader",
        text,
        timestamp: serverTimestamp()
      });
      chatInput.value = "";
    } catch (err) {
      console.error("Error sending message:", err);
    }
  });
}

// ===== Initialize Both When DOM is Ready =====
document.addEventListener("DOMContentLoaded", () => {
  initLiveChart();
  initLiveChat();
});

function updateMarketSession() {
  const nowUTC = new Date().getUTCHours();

  const asia = document.querySelector(".session.asia");
  const london = document.querySelector(".session.london");
  const newyork = document.querySelector(".session.newyork");

  asia.classList.remove("active");
  london.classList.remove("active");
  newyork.classList.remove("active");

  // Asia: 00–08 UTC
  if (nowUTC >= 0 && nowUTC < 8) {
    asia.classList.add("active");
  }
  // London: 08–16 UTC
  else if (nowUTC >= 8 && nowUTC < 16) {
    london.classList.add("active");
  }
  // New York: 13–21 UTC
  else if (nowUTC >= 13 && nowUTC < 21) {
    newyork.classList.add("active");
  }
}

updateMarketSession();
setInterval(updateMarketSession, 60 * 1000);


// Example: Simulated volume data (replace with live TV data later)
const volumeData = [
  { pair: "EUR/USD", volume: 120 },
  { pair: "GBP/USD", volume: 90 },
  { pair: "USD/JPY", volume: 60 },
  { pair: "AUD/USD", volume: 40 },
  { pair: "USD/CAD", volume: 30 },
  { pair: "NZD/USD", volume: 20 }
];

const heatmap = document.getElementById("volumeHeatmap");

volumeData.forEach(item => {
  const bar = document.createElement("div");
  bar.classList.add("volume-bar");

  // Set height based on volume (max 100px)
  const height = Math.min(item.volume, 120);
  bar.style.height = height + "px";

  // Color by intensity
  if (item.volume > 80) bar.classList.add("high");
  else if (item.volume > 50) bar.classList.add("medium");
  else bar.classList.add("low");

  bar.title = `${item.pair}: ${item.volume}`;
  heatmap.appendChild(bar);
});
