import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, query } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Central Firebase Config (Shared by all feature cards)
const firebaseConfig = {
  apiKey: "AIzaSyDTxyr3zJGsyfmdztvfFz8aw9XSyPCNeQM",
  authDomain: "nestmate-ai.firebaseapp.com",
  projectId: "nestmate-ai",
  storageBucket: "nestmate-ai.firebasestorage.app",
  messagingSenderId: "7053398074",
  appId: "1:7053398074:web:13dc18b49402d95107a503"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ─────────────────────────────────────────────────────────
// FEATURE CARD 1: Real Homes, Real Hosts (verified.html)
// ─────────────────────────────────────────────────────────

async function loadVerifiedHostCount() {
  try {
    const q = query(collection(db, "properties"));
    const snapshot = await getDocs(q);
    const uniqueHosts = new Set();
    snapshot.forEach(doc => {
      if(doc.data().userId) uniqueHosts.add(doc.data().userId);
    });
    const el = document.getElementById('hostCount');
    if (el) el.textContent = uniqueHosts.size;
  } catch (error) {
    console.error("Metrics error:", error);
  }
}

async function submitReport(event) {
  const btn = event.target;
  const email = document.getElementById('reportEmail').value.trim();
  const reason = document.getElementById('reportReason').value;
  const details = document.getElementById('reportDetails').value.trim();
  const successMsg = document.getElementById('successMsg');
  const errorMsg = document.getElementById('errorMsg');

  if (!email || !reason) {
    errorMsg.textContent = '⚠ Please enter the host email and select a reason.';
    errorMsg.style.display = 'block';
    return;
  }

  try {
    btn.classList.add('loading');
    btn.disabled = true;
    await addDoc(collection(db, "reports"), {
      hostEmail: email,
      reason: reason,
      details: details,
      reportedAt: new Date(),
      status: 'pending'
    });
    document.getElementById('reportEmail').value = '';
    document.getElementById('reportReason').value = '';
    document.getElementById('reportDetails').value = '';
    successMsg.style.display = 'block';
    setTimeout(() => { successMsg.style.display = 'none'; }, 4000);
  } catch (error) {
    errorMsg.textContent = '⚠ Error submitting report.';
    errorMsg.style.display = 'block';
  } finally {
    btn.classList.remove('loading');
    btn.disabled = false;
  }
}

// ─────────────────────────────────────────────────────────
// FUTURE FEATURE CARDS (Cards 2, 3, and 4)
// ─────────────────────────────────────────────────────────
function initCardTwo() {
  // Your code for the second feature card goes here later!
}

function initCardThree() {
  // Your code for the third feature card goes here later!
}


// ─────────────────────────────────────────────────────────
// CENTRAL ROUTER (Prevents crashes by checking elements)
// ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  
  // Check if we are on the Card 1 (Verified) Page
  const submitBtn = document.getElementById('submitReportBtn');
  if (submitBtn) {
    loadVerifiedHostCount();
    submitBtn.addEventListener('click', submitReport);
  }

  // Check if we are on the Card 2 Page
  const cardTwoElement = document.getElementById('cardTwoUniqueId');
  if (cardTwoElement) {
    initCardTwo();
  }
  
});
