// ===== ANK HYDRO — Site Data Connector =====
// Reads admin panel data from localStorage and updates the live website

(function() {
  'use strict';

  const SiteData = {
    load(key) {
      try {
        return JSON.parse(localStorage.getItem('ank_' + key) || 'null');
      } catch { return null; }
    },

    init() {
      this.applySettings();
      this.applyStats();
      this.applyTestimonials();
      this.applyTeam();
      this.applyFaq();
      this.applyBlog();
      this.applyPackages();
    },

    // ---------- SETTINGS (phone, email, social links, WhatsApp) ----------
    applySettings() {
      const s = this.load('settings');
      if (!s) return;

      // Phone numbers in header and footer
      if (s.phone) {
        const phoneNum = s.phone.replace(/\s/g, '');
        document.querySelectorAll('.header-phone').forEach(el => {
          el.href = 'tel:' + phoneNum;
          const svg = el.querySelector('svg');
          el.textContent = '';
          if (svg) el.prepend(svg);
          el.append(s.phone);
        });
        document.querySelectorAll('.hero-phone').forEach(el => {
          el.href = 'tel:' + phoneNum;
          const svg = el.querySelector('svg');
          el.textContent = '';
          if (svg) el.prepend(svg);
          el.append(' Call Us: ' + s.phone);
        });
        document.querySelectorAll('.cta-phone').forEach(el => {
          el.href = 'tel:' + phoneNum;
          const svg = el.querySelector('svg');
          el.textContent = '';
          if (svg) el.prepend(svg);
          el.append(' ' + s.phone);
        });
        // Footer phone links
        document.querySelectorAll('.footer-contact-item a[href^="tel:"]').forEach(el => {
          el.href = 'tel:' + phoneNum;
          el.textContent = s.phone;
        });
      }

      // Email
      if (s.email) {
        document.querySelectorAll('.footer-contact-item a[href^="mailto:"]').forEach(el => {
          el.href = 'mailto:' + s.email;
          el.textContent = s.email;
        });
      }

      // Address
      if (s.address) {
        document.querySelectorAll('.footer-contact-item span').forEach(el => {
          if (el.textContent.includes('Kitui') || el.textContent.includes('Plaza') || el.textContent.includes('Room')) {
            el.textContent = s.address;
          }
        });
      }

      // WhatsApp float button and links
      if (s.whatsapp) {
        const waNum = s.whatsapp.replace(/[^0-9]/g, '');
        document.querySelectorAll('.whatsapp-float').forEach(el => {
          el.href = 'https://wa.me/' + waNum + '?text=' + encodeURIComponent("Hi ANK Hydro, I'm interested in your services.");
        });
      }

      // Social media links
      const socialMap = {
        facebook: 'Facebook',
        instagram: 'Instagram',
        tiktok: 'TikTok',
        linkedin: 'LinkedIn',
        youtube: 'YouTube',
        twitter: 'Twitter'
      };
      Object.entries(socialMap).forEach(([key, label]) => {
        if (s[key]) {
          document.querySelectorAll('.footer-social a[aria-label="' + label + '"]').forEach(el => {
            el.href = s[key];
            el.target = '_blank';
            el.rel = 'noopener';
          });
        }
      });

      // Company name in footer
      if (s.company) {
        document.querySelectorAll('.footer-brand h3').forEach(el => {
          el.textContent = s.company;
        });
      }

      // Tagline
      if (s.tagline) {
        document.querySelectorAll('.footer-brand > p').forEach(el => {
          if (el.textContent.includes('Power of technology') || el.textContent.includes('better tomorrow')) {
            el.textContent = s.tagline;
          }
        });
      }
    },

    // ---------- STATS / COUNTERS ----------
    applyStats() {
      const stats = this.load('stats');
      if (!stats) return;

      const mapping = {
        'Boreholes Drilled': stats.boreholes,
        'Solar Installs': stats.solar,
        'Solar Systems Installed': stats.solar,
        'Happy Clients': stats.clients,
        'Counties Served': stats.counties
      };

      document.querySelectorAll('[data-count]').forEach(el => {
        const label = el.closest('.hero-stat, .stat-item');
        if (!label) return;
        const labelText = label.querySelector('.stat-label');
        if (!labelText) return;
        const text = labelText.textContent.trim();
        if (mapping[text] !== undefined && mapping[text] !== null) {
          el.setAttribute('data-count', mapping[text]);
        }
      });
    },

    // ---------- TESTIMONIALS ----------
    applyTestimonials() {
      const testimonials = this.load('testimonials');
      if (!testimonials || !Array.isArray(testimonials)) return;

      const published = testimonials
        .filter(t => t.status === 'published')
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      if (published.length === 0) return;

      // Find testimonials container on homepage
      const containers = document.querySelectorAll('.testimonial-card');
      if (containers.length === 0) return;

      const parent = containers[0].parentElement;
      if (!parent) return;

      // Clear existing testimonials
      parent.innerHTML = '';

      published.forEach(t => {
        const initials = t.client ? t.client.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '??';
        const stars = '<svg width="14" height="14"><use href="icons.svg#icon-star"/></svg>'.repeat(t.rating || 5);

        const card = document.createElement('div');
        card.className = 'testimonial-card fade-up visible';
        card.innerHTML = `
          <div class="testimonial-stars">${stars}</div>
          <p class="testimonial-text">${this.escapeHtml(t.text)}</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar">${initials}</div>
            <div class="testimonial-info">
              <strong>${this.escapeHtml(t.client)}</strong>
              <span>${this.escapeHtml(t.location || '')}${t.service ? ' — ' + this.escapeHtml(t.service) : ''}</span>
            </div>
          </div>
        `;
        parent.appendChild(card);
      });
    },

    // ---------- TEAM ----------
    applyTeam() {
      const team = this.load('team');
      if (!team || !Array.isArray(team)) return;

      const active = team
        .filter(t => t.status === 'active')
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      if (active.length === 0) return;

      const containers = document.querySelectorAll('.team-card');
      if (containers.length === 0) return;

      const parent = containers[0].parentElement;
      if (!parent) return;

      parent.innerHTML = '';

      active.forEach(t => {
        const card = document.createElement('div');
        card.className = 'team-card fade-up visible';
        card.innerHTML = `
          <div class="team-avatar">👤</div>
          <h3>${this.escapeHtml(t.name)}</h3>
          <p class="team-role">${this.escapeHtml(t.role)}</p>
          <p>${this.escapeHtml(t.bio || '')}</p>
        `;
        parent.appendChild(card);
      });
    },

    // ---------- FAQ ----------
    applyFaq() {
      const faq = this.load('faq');
      if (!faq || !Array.isArray(faq)) return;

      const published = faq
        .filter(f => f.status === 'published')
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      // Only override if admin has added NEW items beyond the defaults (3)
      if (published.length <= 3) return;

      const container = document.querySelector('.faq-item')?.closest('.container');
      if (!container) return;

      // Group by category
      const groups = {};
      published.forEach(f => {
        const cat = f.category || 'General';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(f);
      });

      // Clear existing FAQ content (keep the container)
      container.innerHTML = '';

      Object.entries(groups).forEach(([category, items]) => {
        const heading = document.createElement('h2');
        heading.style.cssText = 'font-size:1.2rem;margin:2rem 0 1rem;color:var(--cyan);';
        heading.textContent = category;
        container.appendChild(heading);

        items.forEach(item => {
          const faqEl = document.createElement('div');
          faqEl.className = 'faq-item fade-up visible';
          faqEl.innerHTML = `
            <button class="faq-question">${this.escapeHtml(item.question)} <span class="faq-icon">+</span></button>
            <div class="faq-answer"><div class="faq-answer-inner">${this.escapeHtml(item.answer)}</div></div>
          `;

          // Attach click handler
          const question = faqEl.querySelector('.faq-question');
          const answer = faqEl.querySelector('.faq-answer');
          question.addEventListener('click', () => {
            const isActive = faqEl.classList.contains('active');
            container.querySelectorAll('.faq-item').forEach(other => {
              other.classList.remove('active');
              const a = other.querySelector('.faq-answer');
              if (a) a.style.maxHeight = null;
            });
            if (!isActive) {
              faqEl.classList.add('active');
              answer.style.maxHeight = answer.scrollHeight + 'px';
            }
          });

          container.appendChild(faqEl);
        });
      });
    },

    // ---------- BLOG ----------
    applyBlog() {
      const blog = this.load('blog');
      if (!blog || !Array.isArray(blog)) return;

      const published = blog
        .filter(b => b.status === 'published')
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

      if (published.length === 0) return;

      // Blog page — replace entire grid
      const blogGrid = document.querySelector('.blog-card')?.closest('.grid-3');
      if (!blogGrid || !document.querySelector('.page-hero')) return;
      // Only apply on blog.html page
      const pageTitle = document.title;
      if (!pageTitle.includes('Blog')) return;

      blogGrid.innerHTML = '';

      published.forEach(post => {
        const card = document.createElement('article');
        card.className = 'blog-card fade-up visible';

        const iconMap = {
          'Solar Energy': '☀️', 'Solar Energy Guide': '☀️',
          'Borehole': '💧', 'Borehole Drilling Tips': '💧', 'Borehole & Water': '💧',
          'Irrigation': '🌱', 'Irrigation & Farming': '🌱',
          'Water Conservation': '⛏️',
          'Company News': '💡'
        };
        const icon = iconMap[post.category] || '📝';

        card.innerHTML = `
          <div class="blog-thumb">${icon}</div>
          <div class="blog-body">
            <p class="blog-category">${this.escapeHtml(post.category || 'General')}</p>
            <h3>${this.escapeHtml(post.title)}</h3>
            <p>${this.escapeHtml((post.content || '').substring(0, 150))}${(post.content || '').length > 150 ? '...' : ''}</p>
            <p class="blog-meta">${post.date || ''} &middot; ${this.escapeHtml(post.author || 'ANK Hydro')}</p>
          </div>
        `;
        blogGrid.appendChild(card);
      });
    },

    // ---------- PACKAGES ----------
    applyPackages() {
      const packages = this.load('packages');
      if (!packages || !Array.isArray(packages)) return;

      const active = packages
        .filter(p => p.status === 'active')
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      if (active.length === 0) return;

      // Only apply on packages.html
      if (!document.title.includes('Package')) return;

      const container = document.querySelector('.package-card')?.closest('.grid-3');
      if (!container) return;

      container.innerHTML = '';

      active.forEach(pkg => {
        const card = document.createElement('article');
        card.className = 'package-card fade-up visible' + (pkg.featured ? ' featured' : '');

        const specs = (pkg.specs || '').split(',').map(s => s.trim()).filter(Boolean);
        const specsList = specs.map(s => `<li>${this.escapeHtml(s)}</li>`).join('');

        const price = pkg.price ? 'KES ' + Number(pkg.price).toLocaleString() : '';
        const slug = (pkg.name || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        card.innerHTML = `
          <h3>${this.escapeHtml(pkg.name)}</h3>
          <div class="package-price">${price} <small>FROM</small></div>
          <ul class="package-specs">${specsList}</ul>
          <a class="btn ${pkg.featured ? 'btn-primary' : 'btn-cyan'}" href="quote.html?package=${slug}" style="width:100%;justify-content:center;">Get a Quote</a>
        `;
        container.appendChild(card);
      });
    },

    // ---------- UTILITY ----------
    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text || '';
      return div.innerHTML;
    }
  };

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SiteData.init());
  } else {
    SiteData.init();
  }
})();
