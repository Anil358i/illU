import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, query } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDTxyr3zJGsyfmdztvfFz8aw9XSyPCNeQM",
  authDomain: "illU-ai.firebaseapp.com",
  projectId: "illU-ai",
  storageBucket: "illU-ai.firebasestorage.app",
  messagingSenderId: "7053398074",
  appId: "1:7053398074:web:13dc18b49402d95107a503"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ── VERIFIED LISTINGS PAGE: Load live host count ──
async function loadVerifiedHostCount() {
  try {
    const q = query(collection(db, "properties"));
    const snapshot = await getDocs(q);
    const uniqueHosts = new Set();
    snapshot.forEach(doc => {
      if (doc.data().userId) uniqueHosts.add(doc.data().userId);
    });
    const el = document.getElementById('hostCount');
    if (el) el.textContent = uniqueHosts.size;
  } catch (error) {
    console.error("Metrics execution fault:", error);
  }
}

// ── VERIFIED LISTINGS PAGE: Submit abuse report ──
async function submitReport(event) {
  const btn = event.target;
  const email = document.getElementById('reportEmail').value.trim();
  const reason = document.getElementById('reportReason').value;
  const details = document.getElementById('reportDetails').value.trim();
  const successMsg = document.getElementById('successMsg');
  const errorMsg = document.getElementById('errorMsg');

  if (!email || !reason) {
    if (errorMsg) {
      errorMsg.textContent = '⚠ Please enter the host email and select a reason.';
      errorMsg.style.display = 'block';
    }
    return;
  }

  try {
    btn.disabled = true;
    await addDoc(collection(db, "reports"), {
      hostEmail: email,
      reason: reason,
      details: details,
      reportedAt: new Date(),
      status: 'pending'
    });
    if (successMsg) successMsg.style.display = 'block';
    if (errorMsg) errorMsg.style.display = 'none';
  } catch (error) {
    console.error("Report submit error:", error);
    if (errorMsg) {
      errorMsg.textContent = '⚠ Could not submit report. Please try again.';
      errorMsg.style.display = 'block';
    }
  } finally {
    btn.disabled = false;
  }
}

// ── SAVE MONEY PAGE: Savings calculator ──
function initializeSavingsCalculator() {
  const inputRent   = document.getElementById('totalRent');
  const inputRooms  = document.getElementById('rooms');
  const inputWeekly = document.getElementById('roomRent');

  // Only runs if we're on the savings page (these IDs exist)
  if (!inputRent || !inputRooms || !inputWeekly) return;

  const calculate = () => {
    const totalRent  = parseFloat(inputRent.value)  || 0;
    const rooms      = parseInt(inputRooms.value)    || 1;
    const roomRent   = parseFloat(inputWeekly.value) || 0;

    // 4.33 = average weeks per month
    const monthlyIncome      = Math.round(rooms * roomRent * 4.33);
    const netCost            = Math.max(0, Math.round(totalRent - monthlyIncome));
    const yearSave           = monthlyIncome * 12;
    const coveragePercentage = totalRent > 0
      ? Math.min(100, Math.round((monthlyIncome / totalRent) * 100))
      : 0;

    document.getElementById('income').textContent     = '£' + monthlyIncome.toLocaleString();
    document.getElementById('youPay').textContent     = '£' + netCost.toLocaleString();
    document.getElementById('yearSave').textContent   = '£' + yearSave.toLocaleString();
    document.getElementById('tipRooms').textContent   = rooms;
    document.getElementById('tipRent').textContent    = roomRent;
    document.getElementById('tipPercent').textContent = coveragePercentage;
    document.getElementById('roomVal').textContent    = rooms + (rooms > 1 ? ' rooms' : ' room');
  };

  inputRent.addEventListener('input', calculate);
  inputRooms.addEventListener('input', calculate);
  inputWeekly.addEventListener('input', calculate);

  // Run once immediately so results show on page load
  calculate();
}
/*savings*/
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Savings Calculator — illU AI</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="sav-topbar">
    <div class="sav-brand">illU AI</div>
    <a href="index.html" class="sav-home-btn">Back to home</a>
  </header>

  <div class="sav-page">
    <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800" class="sav-hero-img" alt="Save money">

    <h1 class="sav-title">How much could you save?</h1>
    <p class="sav-subtitle">Rent a 3-bed house, fill the spare rooms, and let your tenants cover most of your rent. Use the calculator below.</p>

    <div class="sav-calc-card">
      <p class="sav-calc-label">Your monthly rent (£)</p>
      <input type="number" class="sav-calc-input" id="totalRent" value="2000">

      <p class="sav-calc-label">Number of spare rooms you'll rent out</p>
      <div class="sav-slider-wrap">
        <input type="range" min="1" max="4" value="2" id="rooms" class="sav-slider">
        <div class="sav-slider-meta">
          <span class="sav-meta-label">1 room</span>
          <span class="sav-slider-val" id="roomVal">2 rooms</span>
          <span class="sav-meta-label">4 rooms</span>
        </div>
      </div>

      <p class="sav-calc-label">Weekly rent per room (£)</p>
      <input type="number" class="sav-calc-input" id="roomRent" value="150">

      <div class="sav-result-grid">
        <div class="sav-result-box">
          <p class="sav-r-label">Monthly income</p>
          <p class="sav-r-val" id="income">£--</p>
        </div>
        <div class="sav-result-box sav-highlight">
          <p class="sav-r-label">You pay</p>
          <p class="sav-r-val" id="youPay">£--</p>
        </div>
        <div class="sav-result-box sav-dynamic-dark">
          <p class="sav-r-label">You save per year</p>
          <p class="sav-r-val" id="yearSave">£--</p>
        </div>
      </div>

      <div class="sav-tip">
        <svg class="sav-tip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"></path>
          <line x1="9" y1="18" x2="15" y2="18"></line>
          <line x1="10" y1="22" x2="14" y2="22"></line>
        </svg>
        <p>With <span id="tipRooms">--</span> rooms at £<span id="tipRent">--</span>/week, your tenants cover <span id="tipPercent">--</span>% of your rent — you keep the rest.</p>
      </div>
    </div>
  </div>

  <script src="script.js"></script>
</body>
</html>
