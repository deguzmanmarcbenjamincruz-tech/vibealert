// ---------------- FIREBASE SETUP ----------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// ---------------- CONFIG ----------------
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://vibe-alert-4e3ae-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const readingsRef = ref(db, "sensor-readings"); // store readings by timestamp

// ---------------- STATUS RULES ----------------
function getStatus(magnitude) {
  if (magnitude < 0.5) return "NORMAL";
  else if (magnitude < 2.0) return "WARNING";
  else return "DANGER";
}

// ---------------- CHART SETUP ----------------
const ctx = document.getElementById("vibrationChart").getContext("2d");
const vibrationChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      label: "Vibration Magnitude",
      data: [],
      borderColor: "#2563eb",
      backgroundColor: "rgba(37, 99, 235, 0.2)",
      fill: true,
      tension: 0.2
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: { title: { display: true, text: "Time" } },
      y: { title: { display: true, text: "Magnitude" }, beginAtZero: true }
    }
  }
});

// ---------------- UPDATE DASHBOARD ----------------
function updateDashboard(latest) {
  const { magnitude, timestamp } = latest;

  document.getElementById("timestamp").textContent =
    new Date(timestamp * 1000).toLocaleString();
  document.getElementById("magnitude").textContent = magnitude.toFixed(2);

  const status = getStatus(magnitude);
  const statusEl = document.getElementById("vibrationStatus");
  statusEl.textContent = status;
  statusEl.style.color =
    status === "DANGER" ? "#dc2626" :
    status === "WARNING" ? "#ca8a04" :
    "#16a34a";
}

// ---------------- FETCH AND UPDATE GRAPH ----------------
onValue(readingsRef, snapshot => {
  const data = snapshot.val();
  if (!data) return;

  const timestamps = Object.keys(data).sort();
  const magnitudes = timestamps.map(ts => data[ts].magnitude);

  vibrationChart.data.labels = timestamps.map(ts => {
    const d = new Date(ts * 1000);
    return d.toLocaleTimeString();
  });
  vibrationChart.data.datasets[0].data = magnitudes;
  vibrationChart.update();

  // Update dashboard with latest reading
  const lastTs = timestamps[timestamps.length - 1];
  updateDashboard({ magnitude: data[lastTs].magnitude, timestamp: parseInt(lastTs) });
});
