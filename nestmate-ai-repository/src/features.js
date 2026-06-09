import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, query } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// --- CARD 1 FEATURE CODE ---
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
    console.error("Metrics execution fault:", error);
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
    if(successMsg) successMsg.style.display = 'block';
  } catch (error) {
    if(errorMsg) errorMsg.style.display = 'block';
  } finally {
    btn.disabled = false;
  }
}

// --- CENTRAL FEATURE ROUTER ROUTINES ---
document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.getElementById('submitReportBtn');
  if (submitBtn) {
    loadVerifiedHostCount();
    submitBtn.addEventListener('click', submitReport);
  }
});
