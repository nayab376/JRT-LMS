// ===== JRT LMS — Frontend API Helper =====

const API = {
  async post(url, data) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async get(url) {
    const res = await fetch(url, { credentials: 'include' });
    return res.json();
  }
};

function showError(boxId, msg) {
  const box = document.getElementById(boxId);
  if (!box) return;
  box.textContent = msg;
  box.style.display = 'block';
  setTimeout(() => box.style.display = 'none', 4000);
}

function showSuccess(boxId, msg) {
  const box = document.getElementById(boxId);
  if (!box) return;
  box.textContent = msg;
  box.style.display = 'block';
}

function setLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  if (loading) {
    btn.disabled = true;
    btn.dataset.original = btn.textContent;
    btn.innerHTML = '<span class="spinner"></span> Please wait...';
  } else {
    btn.disabled = false;
    btn.textContent = btn.dataset.original || 'Submit';
  }
}

// OTP auto-focus
function setupOTP() {
  const boxes = document.querySelectorAll('.otp-box');
  boxes.forEach((box, i) => {
    box.addEventListener('input', () => {
      if (box.value && i < boxes.length - 1) boxes[i + 1].focus();
    });
    box.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && !box.value && i > 0) boxes[i - 1].focus();
    });
  });
}

document.addEventListener('DOMContentLoaded', setupOTP);
