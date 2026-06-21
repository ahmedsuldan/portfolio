/* =====================================================
   MAIN.JS — site-wide interactivity
   ===================================================== */

/* ---- Page loader ---- */
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) setTimeout(() => loader.classList.add('hidden'), 400);
});

/* ---- Mobile nav toggle ---- */
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('mobile-open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('mobile-open')));
}

/* ---- Typing role effect ---- */
const roleEl = document.getElementById('hero-role-text');
if (roleEl) {
  const roles = JSON.parse(roleEl.dataset.roles || '["Software Engineer"]');
  let r = 0, c = 0, deleting = false;

  function tick() {
    const current = roles[r];
    if (!deleting) {
      c++;
      roleEl.textContent = current.slice(0, c);
      if (c === current.length) { deleting = true; setTimeout(tick, 1500); return; }
    } else {
      c--;
      roleEl.textContent = current.slice(0, c);
      if (c === 0) { deleting = false; r = (r + 1) % roles.length; }
    }
    setTimeout(tick, deleting ? 40 : 80);
  }
  tick();
}

/* ---- Scroll reveal ---- */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

/* ---- Skill bar fill on scroll ---- */
const skillBars = document.querySelectorAll('.skill-bar-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.dataset.level + '%';
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
skillBars.forEach(el => skillObserver.observe(el));

/* ---- Project filter ---- */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.display = show ? '' : 'none';
    });
  });
});

/* ---- Navbar scroll shadow ---- */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.style.boxShadow = window.scrollY > 10 ? '0 8px 30px rgba(0,0,0,0.35)' : 'none';
});

/* ---- Contact form -> Supabase ---- */
const contactForm = document.getElementById('contact-form');
if (contactForm && typeof sb !== 'undefined') {
  const msgBox = document.getElementById('contact-msg');
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const name = document.getElementById('c-name').value.trim();
    const email = document.getElementById('c-email').value.trim();
    const message = document.getElementById('c-message').value.trim();

    if (!name || !email || !message) {
      msgBox.textContent = 'Fadlan buuxi dhammaan goobaha.';
      msgBox.className = 'form-msg show error';
      return;
    }

    btn.classList.add('loading');
    btn.disabled = true;

    try {
      const { error } = await sb.from('contact_messages').insert([{ name, email, message }]);
      if (error) throw error;
      msgBox.textContent = 'Mahadsanid! Fariintaadii waa la helay, dhowaan waan kula soo xiriiri doonaa.';
      msgBox.className = 'form-msg show success';
      contactForm.reset();
    } catch (err) {
      msgBox.textContent = 'Khalad ayaa dhacay. Fadlan isku day mar kale.';
      msgBox.className = 'form-msg show error';
    } finally {
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  });
}

/* ---- Auth-aware nav (show Login or Logout) ---- */
async function refreshAuthNav() {
  const authSlot = document.getElementById('nav-auth-slot');
  if (!authSlot || typeof sb === 'undefined') return;
  const { data: { session } } = await sb.auth.getSession();
  if (session) {
    authSlot.innerHTML = `<button class="btn btn-outline btn-sm" id="logout-btn">Ka bax</button>`;
    document.getElementById('logout-btn').addEventListener('click', async () => {
      await sb.auth.signOut();
      window.location.reload();
    });
  } else {
    authSlot.innerHTML = `<a href="login.html" class="btn btn-outline btn-sm">Login</a>`;
  }
}
if (typeof sb !== 'undefined') refreshAuthNav();

/* ---- Current year ---- */
document.querySelectorAll('.current-year').forEach(el => el.textContent = new Date().getFullYear());
