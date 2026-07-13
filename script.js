const loader = document.getElementById('loader');
    const progress = document.getElementById('progress');
    const year = document.getElementById('year');
    const scrollbar = document.getElementById('scrollbar');
    const cursor = document.getElementById('cursor');
    const header = document.getElementById('header');
    const topBtn = document.getElementById('topBtn');
    year.textContent = new Date().getFullYear();

    window.addEventListener('load', () => {
      let p = 0;
      const timer = setInterval(() => {
        p += 8;
        progress.style.width = Math.min(p, 100) + '%';
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(() => loader.classList.add('hidden'), 180);
        }
      }, 45);
    });

    const updateScroll = () => {
      const h = document.documentElement;
      const top = h.scrollTop || document.body.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      scrollbar.style.width = `${(top / max) * 100}%`;
    };
    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();

    topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    document.querySelectorAll('.faq-item .faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        item.classList.toggle('open');
      });
    });

    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('show');
      });
    }, { threshold: 0.14 });

    document.querySelectorAll('.reveal').forEach(el => {
      if (!el.classList.contains('show')) revealObserver.observe(el);
    });

    const countObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.count || 0);
        let start = 0;
        const duration = 1200;
        const startTime = performance.now();
        const tick = now => {
          const t = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(start + (target - start) * eased) + (target === 49 ? '' : (target === 100 ? '%' : '+'));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

    const sections = [...document.querySelectorAll('section[id]')];
    const navLinks = [...document.querySelectorAll('.nav-links a')];
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { threshold: 0.5 });
    sections.forEach(s => sectionObserver.observe(s));

    const tiltTargets = document.querySelectorAll('[data-tilt]');
    tiltTargets.forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        card.style.setProperty('--rx', x + '%');
        card.style.setProperty('--ry', y + '%');
        const rotateY = (x - 50) / 12;
        const rotateX = (50 - y) / 12;
card.style.transform =
`translateY(-180px)
perspective(1000px)
rotateX(${rotateX}deg)
rotateY(${rotateY}deg)
scale(1.01)`;      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
        card.style.setProperty('--rx', '50%');
        card.style.setProperty('--ry', '50%');
      });
    });

    const magnets = document.querySelectorAll('.magnetic');
    magnets.forEach(el => {
      let rect;
      el.addEventListener('pointermove', e => {
        rect = rect || el.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        el.style.transform = `translate3d(${dx * 0.07}px, ${dy * 0.07}px, 0)`;
        el.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
        el.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%');
      });
      el.addEventListener('pointerleave', () => {
        rect = null;
        el.style.transform = '';
      });
    });

    window.addEventListener('pointermove', e => {
      cursor.style.transform = `translate3d(${e.clientX - 12}px, ${e.clientY - 12}px, 0)`;
    }, { passive: true });
    document.querySelectorAll('a, button, .magnetic-card, .section-card').forEach(el => {
      el.addEventListener('pointerenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('pointerleave', () => cursor.classList.remove('is-hover'));
    });

    const topSection = document.getElementById('top');
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const id = link.getAttribute('href');
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    const mobileMenu = document.getElementById('mobileMenu');
    const burger = document.getElementById('burger');
    const closeMenu = document.getElementById('closeMenu');
    const mobileBackdrop = document.getElementById('mobileBackdrop');

    const toggleMenu = (open) => {
      mobileMenu.classList.toggle('open', open);
      mobileMenu.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => toggleMenu(true));
    closeMenu.addEventListener('click', () => toggleMenu(false));
    mobileBackdrop.addEventListener('click', () => toggleMenu(false));
    mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => toggleMenu(false)));
    window.addEventListener('keydown', e => { if (e.key === 'Escape') toggleMenu(false); });
    const form = document.getElementById("reservationForm");
const status = document.getElementById("form-status");

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    status.textContent = "Slanje...";
    status.style.color = "#d6b36a";

    const formData = new FormData(form);

    try {

        const response = await fetch("https://formspree.io/f/mdaqoeoj", {
            method: "POST",
            body: formData,
            headers: {
                "Accept": "application/json"
            }
        });

        if (response.ok) {

            status.textContent = "✅ Rezervacija je uspješno poslana!";
            status.style.color = "#6EE7B7";

            form.reset();

        } else {

            status.textContent = "❌ Došlo je do greške. Pokušajte ponovo.";
            status.style.color = "#ff6b6b";

        }

    } catch (error) {

        status.textContent = "❌ Greška pri povezivanju sa serverom.";
        status.style.color = "#ff6b6b";

    }

});
const footer=document.querySelector(".footer-premium");

footer.addEventListener("mousemove",(e)=>{

const rect=footer.getBoundingClientRect();

footer.style.setProperty("--x",(e.clientX-rect.left)+"px");

footer.style.setProperty("--y",(e.clientY-rect.top)+"px");

});

document.getElementById("backToTop").onclick=()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

};