// Determine vibration status based on magnitude
function getStatus(magnitude) {
  if (magnitude < 2.0) {
    return "NORMAL";
  } else if (magnitude < 4.0) {
    return "WARNING";
  } else {
    return "DANGER";
  }
}

// Update dashboard values
function updateDashboard(data) {
  document.getElementById("timestamp").textContent = data.timestamp;
  document.getElementById("magnitude").textContent = data.magnitude.toFixed(2);

  const status = getStatus(data.magnitude);
  const statusEl = document.getElementById("vibrationStatus");
  statusEl.textContent = status;

  // Change color based on status
  if (status === "NORMAL") {
    statusEl.style.color = "#16a34a"; // green
  } else if (status === "WARNING") {
    statusEl.style.color = "#ca8a04"; // yellow
  } else if (status === "DANGER") {
    statusEl.style.color = "#dc2626"; // red
  }
}

/*
  TEMPORARY TEST DATA
  --------------------------------
  This simulates incoming device data.
  DELETE this block when real data
  from Firebase / server / device
  is connected.
*/
updateDashboard({
  timestamp: new Date().toLocaleString(),
  magnitude: 3.5
});
