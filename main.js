// ===== ANK HYDRO LIMITED — Main JavaScript =====

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Mobile Menu Toggle ----------
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // ---------- Back to Top Button ----------
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Scroll Fade-Up Animations ----------
  const fadeElements = document.querySelectorAll('.fade-up');

  if (fadeElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
  }

  // ---------- Counter Animation ----------
  const counters = document.querySelectorAll('[data-count]');

  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          animateCounter(el, target);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el, target) {
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current.toLocaleString() + '+';

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ---------- FAQ Accordion ----------
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all others
        faqItems.forEach(other => {
          other.classList.remove('active');
          const otherAnswer = other.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        });

        // Toggle current
        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  // ---------- Form Handling ----------
  const contactForm = document.getElementById('contactForm');
  const quoteForm = document.getElementById('quoteForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveToAdmin('messages', contactForm);
      showSuccess(contactForm, 'contactSuccess');
    });
  }

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveToAdmin('quotes', quoteForm);
      showSuccess(quoteForm, 'quoteSuccess');
    });
  }

  function saveToAdmin(type, form) {
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => { data[key] = value; });

    const storeKey = type === 'quotes' ? 'ank_quotes' : 'ank_messages';
    const items = JSON.parse(localStorage.getItem(storeKey) || '[]');
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    if (type === 'quotes') {
      items.push({
        id: items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1,
        date: dateStr,
        name: data.name || '',
        phone: data.phone || '',
        email: data.email || '',
        location: data.location || '',
        service: data.service || '',
        package: data.package || '',
        description: data.description || '',
        contactMethod: data.contact_method || 'Phone',
        status: 'New',
        notes: ''
      });
    } else {
      items.push({
        id: items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1,
        date: dateStr,
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        service: data.service || '',
        message: data.message || '',
        status: 'Unread'
      });
    }

    localStorage.setItem(storeKey, JSON.stringify(items));

    // Also log activity
    const activity = JSON.parse(localStorage.getItem('ank_activity') || '[]');
    activity.push({
      text: type === 'quotes' ? `New quote request from ${data.name}` : `New message from ${data.name}`,
      icon: type === 'quotes' ? '📩' : '💬',
      timestamp: Date.now()
    });
    localStorage.setItem('ank_activity', JSON.stringify(activity));

    // Also open WhatsApp
    let message = 'New inquiry from ANK Hydro website:\n\n';
    for (const [key, value] of Object.entries(data)) {
      if (value) {
        message += `*${key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}:* ${value}\n`;
      }
    }
    const waUrl = `https://wa.me/254758849293?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  }

  function showSuccess(form, successId) {
    form.style.display = 'none';
    const success = document.getElementById(successId);
    if (success) success.style.display = 'block';
  }

  // ---------- URL Parameter Pre-fill (for quote form) ----------
  if (quoteForm) {
    const params = new URLSearchParams(window.location.search);

    const serviceParam = params.get('service');
    const packageParam = params.get('package');

    if (serviceParam) {
      const serviceMap = {
        'solar-installation': 'Solar Panel Installation',
        'hybrid-solar': 'Hybrid Domestic Solar',
        'hydrological-survey': 'Hydrological Survey',
        'borehole-drilling': 'Borehole Drilling',
        'borehole-rehabilitation': 'Borehole Rehabilitation',
        'pump-installation': 'Pump Installation',
        'irrigation': 'Irrigation Systems',
        'tank-tower': 'Tank Tower Construction',
        'solar-structure': 'Solar Structure'
      };

      const serviceSelect = document.getElementById('quote-service');
      if (serviceSelect && serviceMap[serviceParam]) {
        serviceSelect.value = serviceMap[serviceParam];
      }
    }

    if (packageParam) {
      const packageMap = {
        'hybrid-solar': 'Hybrid Solar KES 360K',
        'pump-200w': '200W Pump KES 52K',
        'pump-500w': '500W Pump KES 86K',
        'pump-750w': '750W Pump KES 125K',
        'pump-1300w': '1300W Pump KES 140K'
      };

      const packageSelect = document.getElementById('quote-package');
      if (packageSelect && packageMap[packageParam]) {
        packageSelect.value = packageMap[packageParam];
      }
    }
  }

  // ---------- Sticky Header Shadow on Scroll ----------
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,.25)';
      } else {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,.2)';
      }
    });
  }

  // ---------- Lazy Image Load Animation ----------
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'));
    }
  });

});
