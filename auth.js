/* =====================================================
   AUTH.JS — Login & Register logic (Supabase)
   ===================================================== */

function showFieldError(input, message) {
  input.classList.add('invalid');
  const err = input.parentElement.querySelector('.field-error');
  if (err) { err.textContent = message; err.classList.add('show'); }
}
function clearFieldError(input) {
  input.classList.remove('invalid');
  const err = input.parentElement.querySelector('.field-error');
  if (err) err.classList.remove('show');
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function showToast(message, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast ${type}`;
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => toast.classList.remove('show'), 3500);
}
function setLoading(btn, loading) {
  btn.classList.toggle('loading', loading);
  btn.disabled = loading;
}

/* ---------------- REGISTER ---------------- */
const registerForm = document.getElementById('register-form');
if (registerForm) {
  const nameInput = document.getElementById('reg-name');
  const emailInput = document.getElementById('reg-email');
  const passInput = document.getElementById('reg-password');
  const confirmInput = document.getElementById('reg-confirm');
  const strengthFill = document.querySelector('.password-strength-fill');

  passInput.addEventListener('input', () => {
    const val = passInput.value;
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    const colors = ['#ff5c7a', '#ff5c7a', '#ffb84d', '#00e0c7', '#00e0c7'];
    const widths = [10, 25, 55, 80, 100];
    if (strengthFill) {
      strengthFill.style.width = widths[score] + '%';
      strengthFill.style.background = colors[score];
    }
  });

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    [nameInput, emailInput, passInput, confirmInput].forEach(clearFieldError);

    if (nameInput.value.trim().length < 2) {
      showFieldError(nameInput, 'Fadlan geli magacaaga oo saxda ah.');
      valid = false;
    }
    if (!isValidEmail(emailInput.value.trim())) {
      showFieldError(emailInput, 'Email-ka ma saxna.');
      valid = false;
    }
    if (passInput.value.length < 8) {
      showFieldError(passInput, 'Password-ku waa inuu noqdaa ugu yaraan 8 xaraf.');
      valid = false;
    }
    if (confirmInput.value !== passInput.value) {
      showFieldError(confirmInput, 'Password-yadu isma waafaqsana.');
      valid = false;
    }
    if (!valid) return;

    const btn = registerForm.querySelector('button[type="submit"]');
    setLoading(btn, true);

    try {
      const { data, error } = await sb.auth.signUp({
        email: emailInput.value.trim(),
        password: passInput.value,
        options: { data: { full_name: nameInput.value.trim() } }
      });
      if (error) throw error;

      // Store extra profile info in our own "profiles" table
      if (data.user) {
        await sb.from('profiles').insert([
          { id: data.user.id, full_name: nameInput.value.trim(), email: emailInput.value.trim() }
        ]);
      }

      showToast('Akoonkaaga si guul leh ayaa loo abuuray! Fadlan email-kaaga hubi.', 'success');
      setTimeout(() => { window.location.href = 'login.html'; }, 1800);
    } catch (err) {
      showToast(err.message || 'Khalad ayaa dhacay. Isku day mar kale.', 'error');
    } finally {
      setLoading(btn, false);
    }
  });
}

/* ---------------- LOGIN ---------------- */
const loginForm = document.getElementById('login-form');
if (loginForm) {
  const emailInput = document.getElementById('login-email');
  const passInput = document.getElementById('login-password');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;
    [emailInput, passInput].forEach(clearFieldError);

    if (!isValidEmail(emailInput.value.trim())) {
      showFieldError(emailInput, 'Email-ka ma saxna.');
      valid = false;
    }
    if (passInput.value.length < 1) {
      showFieldError(passInput, 'Fadlan geli password-kaaga.');
      valid = false;
    }
    if (!valid) return;

    const btn = loginForm.querySelector('button[type="submit"]');
    setLoading(btn, true);

    try {
      const { error } = await sb.auth.signInWithPassword({
        email: emailInput.value.trim(),
        password: passInput.value
      });
      if (error) throw error;

      showToast('Ku soo dhowow! Waad soo gashay.', 'success');
      setTimeout(() => { window.location.href = 'index.html'; }, 1200);
    } catch (err) {
      showToast(err.message === 'Invalid login credentials'
        ? 'Email ama password khalad ah.'
        : (err.message || 'Khalad ayaa dhacay.'), 'error');
    } finally {
      setLoading(btn, false);
    }
  });
}

/* ---------------- Password show/hide ---------------- */
document.querySelectorAll('.toggle-password').forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const input = toggle.previousElementSibling;
    if (input.type === 'password') {
      input.type = 'text';
      toggle.textContent = '🙈';
    } else {
      input.type = 'password';
      toggle.textContent = '👁️';
    }
  });
});
