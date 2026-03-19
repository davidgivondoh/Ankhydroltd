// ===== ANK HYDRO ADMIN PANEL — Core JavaScript =====

const AdminApp = {
  // ---------- DATA STORE (localStorage) ----------
  DB_KEYS: {
    auth: 'ank_admin_auth',
    services: 'ank_services',
    packages: 'ank_packages',
    projects: 'ank_projects',
    blog: 'ank_blog',
    quotes: 'ank_quotes',
    messages: 'ank_messages',
    testimonials: 'ank_testimonials',
    team: 'ank_team',
    faq: 'ank_faq',
    stats: 'ank_stats',
    settings: 'ank_settings',
    activity: 'ank_activity',
    password: 'ank_admin_password'
  },

  currentSection: 'dashboard',
  editingId: null,
  editingType: null,

  // ---------- INIT ----------
  init() {
    // Login page
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
      });
      return;
    }

    // Dashboard page — check auth
    if (!this.isAuthenticated()) {
      window.location.href = 'index.html';
      return;
    }

    this.seedDefaultData();
    this.setupNavigation();
    this.setupSidebar();
    this.setupLogout();
    this.setupStats();
    this.setupSettings();
    this.renderDashboard();
    this.renderAll();
  },

  // ---------- AUTH ----------
  handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('loginError');
    const btn = document.getElementById('loginBtn');
    const btnText = btn?.querySelector('.login-btn-text');
    const btnLoading = btn?.querySelector('.login-btn-loading');

    const storedPassword = localStorage.getItem(this.DB_KEYS.password) || 'admin123';

    // Show loading state
    if (btnText) btnText.style.display = 'none';
    if (btnLoading) btnLoading.style.display = 'inline-flex';
    if (btn) btn.disabled = true;
    errorEl.style.display = 'none';

    // Simulate brief auth delay for UX
    setTimeout(() => {
      if (email === 'admin@ankhydro.com' && password === storedPassword) {
        localStorage.setItem(this.DB_KEYS.auth, JSON.stringify({
          email,
          loggedIn: true,
          timestamp: Date.now()
        }));
        window.location.href = 'dashboard.html';
      } else {
        errorEl.textContent = 'Invalid email or password. Please try again.';
        errorEl.style.display = 'block';
        errorEl.style.background = '';
        errorEl.style.color = '';
        if (btnText) btnText.style.display = 'inline';
        if (btnLoading) btnLoading.style.display = 'none';
        if (btn) btn.disabled = false;
      }
    }, 600);
  },

  isAuthenticated() {
    const auth = JSON.parse(localStorage.getItem(this.DB_KEYS.auth) || 'null');
    if (!auth || !auth.loggedIn) return false;
    // Session timeout: 30 min
    if (Date.now() - auth.timestamp > 30 * 60 * 1000) {
      localStorage.removeItem(this.DB_KEYS.auth);
      return false;
    }
    // Refresh timestamp
    auth.timestamp = Date.now();
    localStorage.setItem(this.DB_KEYS.auth, JSON.stringify(auth));
    return true;
  },

  // ---------- SEED DEFAULT DATA ----------
  seedDefaultData() {
    if (!localStorage.getItem(this.DB_KEYS.services)) {
      this.save('services', [
        { id: 1, title: 'Solar Panel Sales & Installation', slug: 'solar-installation', category: 'Solar Energy', description: 'Professional solar system design, installation, and commissioning.', status: 'published', order: 1 },
        { id: 2, title: 'Hybrid Domestic Solar System', slug: 'hybrid-solar', category: 'Solar Energy', description: '5.12 kWh battery package with 550W panels and 3000W inverter.', status: 'published', order: 2 },
        { id: 3, title: 'Hydrological Survey Services', slug: 'hydrological-survey', category: 'Water/Borehole', description: 'Geophysical surveys to locate underground water before drilling.', status: 'published', order: 3 },
        { id: 4, title: 'Borehole Drilling Services', slug: 'borehole-drilling', category: 'Water/Borehole', description: 'Professional drilling, casing, development, and test pumping.', status: 'published', order: 4 },
        { id: 5, title: 'Borehole Rehabilitation & Equipping', slug: 'borehole-rehabilitation', category: 'Water/Borehole', description: 'Restoration and upgrade of existing boreholes.', status: 'published', order: 5 },
        { id: 6, title: 'Submersible Pump Sales & Installation', slug: 'pump-installation', category: 'Pumps', description: 'Electric and solar pump installation with correct sizing.', status: 'published', order: 6 },
        { id: 7, title: 'Drip & Overhead Irrigation', slug: 'irrigation', category: 'Irrigation', description: 'Farm irrigation systems with efficient water use.', status: 'published', order: 7 },
        { id: 8, title: 'Tank Tower Construction', slug: 'tank-tower', category: 'Infrastructure', description: 'Steel tower construction for water storage tanks.', status: 'published', order: 8 },
        { id: 9, title: 'Solar Structure Construction', slug: 'solar-structure', category: 'Infrastructure', description: 'Ground-mount and custom solar panel structures.', status: 'published', order: 9 }
      ]);
    }

    if (!localStorage.getItem(this.DB_KEYS.packages)) {
      this.save('packages', [
        { id: 1, name: 'Hybrid Domestic Solar Package', price: 360000, priceLabel: 'FROM KES 360,000', category: 'Solar', specs: '5.12 kWh Lithium Battery, 550W Panels, 3000ES kW Inverter, DC Disconnect, Changeover Switch', status: 'active', featured: true, order: 1 },
        { id: 2, name: 'Solar Pump 200W', price: 52000, priceLabel: 'FROM KES 52,000', category: 'Pumps', specs: '200W Pump, Controller, 340W Panels, 50M HDPE Pipe, Cables, Transport', status: 'active', featured: false, order: 2 },
        { id: 3, name: 'Solar Pump 500W', price: 86000, priceLabel: 'FROM KES 86,000', category: 'Pumps', specs: '500W Pump, Controller, 340W Panels, 50M HDPE Pipe, Cables, Transport', status: 'active', featured: false, order: 3 },
        { id: 4, name: 'Solar Pump 750W', price: 125000, priceLabel: 'FROM KES 125,000', category: 'Pumps', specs: '750W Pump, Controller, 340W Panels, 50M HDPE Pipe, Cables, Transport', status: 'active', featured: false, order: 4 },
        { id: 5, name: 'Solar Pump 1300W', price: 140000, priceLabel: 'FROM KES 140,000', category: 'Pumps', specs: '1300W Pump, Controller, 340W Panels, 50M HDPE Pipe, Cables, Transport', status: 'active', featured: true, order: 5 }
      ]);
    }

    if (!localStorage.getItem(this.DB_KEYS.testimonials)) {
      this.save('testimonials', [
        { id: 1, client: 'John M.', location: 'Kitui County', service: 'Borehole Drilling', text: 'ANK Hydro drilled our borehole and the water yield exceeded expectations. Professional team and great follow-up support.', rating: 5, status: 'published', order: 1 },
        { id: 2, client: 'Mary W.', location: 'Machakos County', service: 'Hybrid Solar', text: 'The hybrid solar system has completely changed our electricity situation. No more blackouts and our bills have dropped significantly.', rating: 5, status: 'published', order: 2 },
        { id: 3, client: 'Peter K.', location: 'Makueni County', service: 'Pump & Irrigation', text: 'They installed a solar-powered pump and set up drip irrigation. Our water costs dropped to zero and crop yield has improved.', rating: 5, status: 'published', order: 3 }
      ]);
    }

    if (!localStorage.getItem(this.DB_KEYS.team)) {
      this.save('team', [
        { id: 1, name: 'Technical Director', role: 'Solar & Water Systems', bio: 'Leading our technical team with years of experience in solar installation and borehole drilling.', status: 'active', order: 1 },
        { id: 2, name: 'Operations Manager', role: 'Project Delivery', bio: 'Ensuring every project is delivered on time, on budget, and to the highest quality.', status: 'active', order: 2 },
        { id: 3, name: 'Field Engineers', role: 'Installation & Maintenance', bio: 'Certified technicians handling installations, testing, and after-sales support.', status: 'active', order: 3 }
      ]);
    }

    if (!localStorage.getItem(this.DB_KEYS.faq)) {
      this.save('faq', [
        { id: 1, question: 'How much does it cost to drill a borehole in Kenya?', answer: 'Costs typically range from KES 3,500–6,000 per metre drilled.', category: 'Borehole & Water', status: 'published', order: 1 },
        { id: 2, question: 'What does the Hybrid Domestic Solar Package include?', answer: '5.12 kWh battery, 550W panels, 3000ES kW inverter, DC disconnect, changeover switch — from KES 360,000.', category: 'Solar Energy', status: 'published', order: 2 },
        { id: 3, question: 'Do you offer after-sales support?', answer: 'Yes, we provide 24/7 availability for breakdowns, servicing, and maintenance.', category: 'General', status: 'published', order: 3 }
      ]);
    }

    if (!localStorage.getItem(this.DB_KEYS.stats)) {
      this.save('stats', { boreholes: 150, solar: 200, clients: 500, counties: 15 });
    }

    if (!localStorage.getItem(this.DB_KEYS.settings)) {
      this.save('settings', {
        company: 'ANK HYDRO LIMITED',
        tagline: 'Power of technology, get it right for better tomorrow',
        phone: '+254 758 849 293',
        email: 'info@ankhydro.com',
        whatsapp: '+254 758 849 293',
        address: 'Kitui Town, PT Plaza, Room 4, Ground Floor',
        hours: 'Mon–Fri: 8AM–5PM, Sat: 8AM–1PM',
        facebook: '', instagram: '', tiktok: '', linkedin: '', youtube: '', twitter: '', ga: ''
      });
    }

    if (!localStorage.getItem(this.DB_KEYS.quotes)) this.save('quotes', []);
    if (!localStorage.getItem(this.DB_KEYS.messages)) this.save('messages', []);
    if (!localStorage.getItem(this.DB_KEYS.projects)) this.save('projects', []);
    if (!localStorage.getItem(this.DB_KEYS.blog)) this.save('blog', []);
    if (!localStorage.getItem(this.DB_KEYS.activity)) this.save('activity', []);
  },

  // ---------- STORAGE HELPERS ----------
  load(key) {
    return JSON.parse(localStorage.getItem(this.DB_KEYS[key]) || '[]');
  },
  save(key, data) {
    localStorage.setItem(this.DB_KEYS[key], JSON.stringify(data));
  },
  nextId(key) {
    const items = this.load(key);
    return items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
  },

  // ---------- NAVIGATION ----------
  setupNavigation() {
    document.querySelectorAll('.nav-item[data-section]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        this.navigateTo(section);
      });
    });
  },

  navigateTo(section) {
    this.currentSection = section;

    // Update nav active state
    document.querySelectorAll('.nav-item[data-section]').forEach(l => l.classList.remove('active'));
    document.querySelector(`.nav-item[data-section="${section}"]`)?.classList.add('active');

    // Show/hide sections
    document.querySelectorAll('.section-panel').forEach(p => p.style.display = 'none');
    const panel = document.getElementById(`section-${section}`);
    if (panel) panel.style.display = 'block';

    // Update title
    const titles = {
      dashboard: 'Dashboard', services: 'Services', packages: 'Packages',
      projects: 'Projects / Portfolio', blog: 'Blog Posts', quotes: 'Quote Requests',
      messages: 'Contact Messages', testimonials: 'Testimonials', team: 'Team Members',
      faq: 'FAQ Management', stats: 'Stats / Counters', settings: 'Site Settings'
    };
    document.getElementById('pageTitle').textContent = titles[section] || 'Dashboard';

    // Close mobile sidebar
    document.getElementById('sidebar')?.classList.remove('open');
  },

  setupSidebar() {
    const toggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    if (toggle && sidebar) {
      toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    }
  },

  setupLogout() {
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem(this.DB_KEYS.auth);
      window.location.href = 'index.html';
    });
  },

  // ---------- DASHBOARD ----------
  renderDashboard() {
    const quotes = this.load('quotes');
    const messages = this.load('messages');
    const blog = this.load('blog');
    const projects = this.load('projects');
    const services = this.load('services');
    const packages = this.load('packages');
    const testimonials = this.load('testimonials');
    const team = this.load('team');
    const faq = this.load('faq');

    // Main stat numbers
    this.setText('dashQuotes', quotes.length);
    this.setText('dashMessages', messages.length);
    this.setText('dashBlog', blog.length);
    this.setText('dashProjects', projects.length);

    // Trend badges
    const newQuotes = quotes.filter(q => q.status === 'New').length;
    const unreadMsgs = messages.filter(m => m.status === 'Unread').length;
    this.setText('quotesTrend', `${newQuotes} new`);
    this.setText('messagesTrend', `${unreadMsgs} unread`);

    // Sidebar badges
    this.updateBadge('quotesBadge', newQuotes);
    this.updateBadge('messagesBadge', unreadMsgs);

    // Quick stats panel
    this.setText('qsServices', services.length);
    this.setText('qsPackages', packages.length);
    this.setText('qsTestimonials', testimonials.length);
    this.setText('qsTeam', team.length);
    this.setText('qsFaq', faq.length);

    // Mini charts (simulated bar data based on item counts)
    this.renderMiniChart('quotesChart', this.generateChartData(quotes.length));
    this.renderMiniChart('messagesChart', this.generateChartData(messages.length));
    this.renderMiniChart('blogChart', this.generateChartData(blog.length));
    this.renderMiniChart('projectsChart', this.generateChartData(projects.length));

    // Activity feed
    const activity = this.load('activity').slice(-10).reverse();
    const feed = document.getElementById('recentActivity');
    if (feed) {
      if (activity.length === 0) {
        feed.innerHTML = '<p class="empty-state">No recent activity yet. Actions you take will appear here.</p>';
      } else {
        feed.innerHTML = activity.map(a => `
          <div class="activity-item">
            <div class="activity-icon">${a.icon || '📋'}</div>
            <span class="activity-text">${a.text}</span>
            <span class="activity-time">${this.timeAgo(a.timestamp)}</span>
          </div>
        `).join('');
      }
    }
  },

  setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  },

  generateChartData(total) {
    // Generate 7 bars simulating weekly data, last bar is tallest
    const bars = [];
    for (let i = 0; i < 7; i++) {
      const base = Math.max(1, total);
      bars.push(Math.round(Math.random() * base * 0.7 + base * 0.1));
    }
    bars[6] = Math.max(...bars, total); // Ensure last bar is tallest
    return bars;
  },

  renderMiniChart(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const max = Math.max(...data, 1);
    container.innerHTML = data.map(val => {
      const height = Math.max(4, (val / max) * 32);
      return `<div class="dash-mini-bar" style="height:${height}px;"></div>`;
    }).join('');
  },

  updateBadge(id, count) {
    const badge = document.getElementById(id);
    if (badge) {
      badge.textContent = count;
      badge.classList.toggle('show', count > 0);
    }
  },

  // ---------- RENDER ALL TABLES ----------
  renderAll() {
    this.renderServices();
    this.renderPackages();
    this.renderProjects();
    this.renderBlog();
    this.renderQuotes();
    this.renderMessages();
    this.renderTestimonials();
    this.renderTeam();
    this.renderFaq();
    this.loadStats();
    this.loadSettings();
  },

  renderServices() {
    const items = this.load('services').sort((a, b) => a.order - b.order);
    const tbody = document.getElementById('servicesTable');
    if (!tbody) return;
    tbody.innerHTML = items.map(s => `
      <tr>
        <td>${s.order}</td>
        <td><strong>${s.title}</strong></td>
        <td>${s.category}</td>
        <td><span class="status status-${s.status}">${s.status}</span></td>
        <td class="actions">
          <button class="btn-admin btn-admin-sm btn-admin-outline" onclick="AdminApp.editItem('service', ${s.id})">Edit</button>
          <button class="btn-admin btn-admin-sm btn-admin-danger" onclick="AdminApp.deleteItem('services', ${s.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  },

  renderPackages() {
    const items = this.load('packages').sort((a, b) => a.order - b.order);
    const tbody = document.getElementById('packagesTable');
    if (!tbody) return;
    tbody.innerHTML = items.map(p => `
      <tr>
        <td><strong>${p.name}</strong></td>
        <td>${p.priceLabel}</td>
        <td>${p.category}</td>
        <td><span class="status status-${p.status}">${p.status}</span></td>
        <td>${p.featured ? '⭐' : '—'}</td>
        <td class="actions">
          <button class="btn-admin btn-admin-sm btn-admin-outline" onclick="AdminApp.editItem('package', ${p.id})">Edit</button>
          <button class="btn-admin btn-admin-sm btn-admin-danger" onclick="AdminApp.deleteItem('packages', ${p.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  },

  renderProjects() {
    const items = this.load('projects');
    const tbody = document.getElementById('projectsTable');
    if (!tbody) return;
    if (items.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No projects added yet.</td></tr>';
      return;
    }
    tbody.innerHTML = items.map(p => `
      <tr>
        <td><strong>${p.title}</strong></td>
        <td>${p.location}</td>
        <td>${p.service}</td>
        <td>${p.date || '—'}</td>
        <td><span class="status status-${p.status}">${p.status}</span></td>
        <td class="actions">
          <button class="btn-admin btn-admin-sm btn-admin-outline" onclick="AdminApp.editItem('project', ${p.id})">Edit</button>
          <button class="btn-admin btn-admin-sm btn-admin-danger" onclick="AdminApp.deleteItem('projects', ${p.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  },

  renderBlog() {
    const items = this.load('blog');
    const tbody = document.getElementById('blogTable');
    if (!tbody) return;
    if (items.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No blog posts yet. Create your first post!</td></tr>';
      return;
    }
    tbody.innerHTML = items.map(b => `
      <tr>
        <td><strong>${b.title}</strong></td>
        <td>${b.category}</td>
        <td>${b.author || 'Admin'}</td>
        <td>${b.date}</td>
        <td><span class="status status-${b.status}">${b.status}</span></td>
        <td class="actions">
          <button class="btn-admin btn-admin-sm btn-admin-outline" onclick="AdminApp.editItem('blog', ${b.id})">Edit</button>
          <button class="btn-admin btn-admin-sm btn-admin-danger" onclick="AdminApp.deleteItem('blog', ${b.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  },

  renderQuotes() {
    const items = this.load('quotes');
    const tbody = document.getElementById('quotesTable');
    const empty = document.getElementById('quotesEmpty');
    if (!tbody) return;
    if (items.length === 0) {
      tbody.innerHTML = '';
      if (empty) empty.style.display = 'block';
      return;
    }
    if (empty) empty.style.display = 'none';
    tbody.innerHTML = items.map(q => `
      <tr>
        <td>${q.date}</td>
        <td><strong>${q.name}</strong></td>
        <td><a href="tel:${q.phone}">${q.phone}</a></td>
        <td>${q.service}</td>
        <td>${q.package || '—'}</td>
        <td>
          <select class="status-select" onchange="AdminApp.updateStatus('quotes', ${q.id}, this.value)">
            ${['New','Contacted','In Progress','Quoted','Converted','Closed'].map(s =>
              `<option value="${s}" ${q.status === s ? 'selected' : ''}>${s}</option>`
            ).join('')}
          </select>
        </td>
        <td class="actions">
          <button class="btn-admin btn-admin-sm btn-admin-outline" onclick="AdminApp.viewDetail('quote', ${q.id})">View</button>
          <button class="btn-admin btn-admin-sm btn-admin-danger" onclick="AdminApp.deleteItem('quotes', ${q.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  },

  renderMessages() {
    const items = this.load('messages');
    const tbody = document.getElementById('messagesTable');
    const empty = document.getElementById('messagesEmpty');
    if (!tbody) return;
    if (items.length === 0) {
      tbody.innerHTML = '';
      if (empty) empty.style.display = 'block';
      return;
    }
    if (empty) empty.style.display = 'none';
    tbody.innerHTML = items.map(m => `
      <tr>
        <td>${m.date}</td>
        <td><strong>${m.name}</strong></td>
        <td><a href="mailto:${m.email}">${m.email}</a></td>
        <td><a href="tel:${m.phone}">${m.phone}</a></td>
        <td>
          <select class="status-select" onchange="AdminApp.updateStatus('messages', ${m.id}, this.value)">
            ${['Unread','Read','Replied'].map(s =>
              `<option value="${s}" ${m.status === s ? 'selected' : ''}>${s}</option>`
            ).join('')}
          </select>
        </td>
        <td class="actions">
          <button class="btn-admin btn-admin-sm btn-admin-outline" onclick="AdminApp.viewDetail('message', ${m.id})">View</button>
          <button class="btn-admin btn-admin-sm btn-admin-danger" onclick="AdminApp.deleteItem('messages', ${m.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  },

  renderTestimonials() {
    const items = this.load('testimonials').sort((a, b) => a.order - b.order);
    const tbody = document.getElementById('testimonialsTable');
    if (!tbody) return;
    tbody.innerHTML = items.map(t => `
      <tr>
        <td><strong>${t.client}</strong></td>
        <td>${t.location}</td>
        <td>${t.service}</td>
        <td>${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</td>
        <td><span class="status status-${t.status}">${t.status}</span></td>
        <td class="actions">
          <button class="btn-admin btn-admin-sm btn-admin-outline" onclick="AdminApp.editItem('testimonial', ${t.id})">Edit</button>
          <button class="btn-admin btn-admin-sm btn-admin-danger" onclick="AdminApp.deleteItem('testimonials', ${t.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  },

  renderTeam() {
    const items = this.load('team').sort((a, b) => a.order - b.order);
    const tbody = document.getElementById('teamTable');
    if (!tbody) return;
    tbody.innerHTML = items.map(t => `
      <tr>
        <td><strong>${t.name}</strong></td>
        <td>${t.role}</td>
        <td><span class="status status-${t.status}">${t.status}</span></td>
        <td class="actions">
          <button class="btn-admin btn-admin-sm btn-admin-outline" onclick="AdminApp.editItem('team', ${t.id})">Edit</button>
          <button class="btn-admin btn-admin-sm btn-admin-danger" onclick="AdminApp.deleteItem('team', ${t.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  },

  renderFaq() {
    const items = this.load('faq').sort((a, b) => a.order - b.order);
    const tbody = document.getElementById('faqTable');
    if (!tbody) return;
    tbody.innerHTML = items.map(f => `
      <tr>
        <td>${f.order}</td>
        <td><strong>${f.question}</strong></td>
        <td>${f.category}</td>
        <td><span class="status status-${f.status}">${f.status}</span></td>
        <td class="actions">
          <button class="btn-admin btn-admin-sm btn-admin-outline" onclick="AdminApp.editItem('faq', ${f.id})">Edit</button>
          <button class="btn-admin btn-admin-sm btn-admin-danger" onclick="AdminApp.deleteItem('faq', ${f.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  },

  // ---------- MODAL FORMS ----------
  openModal(type, item = null) {
    this.editingType = type;
    this.editingId = item ? item.id : null;

    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    const saveBtn = document.getElementById('modalSaveBtn');

    title.textContent = item ? `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}` : `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    saveBtn.onclick = () => this.saveModal();

    const forms = {
      service: () => `
        <div class="form-group"><label>Service Title</label><input type="text" id="m-title" value="${item?.title || ''}" /></div>
        <div class="form-row">
          <div class="form-group"><label>Category</label><select id="m-category"><option>Solar Energy</option><option>Water/Borehole</option><option>Pumps</option><option>Irrigation</option><option>Infrastructure</option></select></div>
          <div class="form-group"><label>Display Order</label><input type="number" id="m-order" value="${item?.order || ''}" /></div>
        </div>
        <div class="form-group"><label>Short Description</label><textarea id="m-description">${item?.description || ''}</textarea></div>
        <div class="form-group"><label>Status</label><select id="m-status"><option>published</option><option>draft</option></select></div>
      `,
      package: () => `
        <div class="form-group"><label>Package Name</label><input type="text" id="m-name" value="${item?.name || ''}" /></div>
        <div class="form-row">
          <div class="form-group"><label>Price (KES)</label><input type="number" id="m-price" value="${item?.price || ''}" /></div>
          <div class="form-group"><label>Price Label</label><input type="text" id="m-priceLabel" value="${item?.priceLabel || ''}" placeholder="FROM KES 360,000" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Category</label><select id="m-category"><option>Solar</option><option>Pumps</option><option>Irrigation</option><option>Infrastructure</option></select></div>
          <div class="form-group"><label>Display Order</label><input type="number" id="m-order" value="${item?.order || ''}" /></div>
        </div>
        <div class="form-group"><label>Specifications (comma-separated)</label><textarea id="m-specs">${item?.specs || ''}</textarea></div>
        <div class="form-row">
          <div class="form-group"><label>Status</label><select id="m-status"><option>active</option><option>inactive</option><option>coming soon</option></select></div>
          <div class="form-group"><label>Featured</label><select id="m-featured"><option value="false">No</option><option value="true">Yes</option></select></div>
        </div>
      `,
      project: () => `
        <div class="form-group"><label>Project Title</label><input type="text" id="m-title" value="${item?.title || ''}" /></div>
        <div class="form-row">
          <div class="form-group"><label>Location (County)</label><input type="text" id="m-location" value="${item?.location || ''}" /></div>
          <div class="form-group"><label>Service Type</label><select id="m-service"><option>Solar Installation</option><option>Hybrid Solar</option><option>Borehole Drilling</option><option>Borehole Rehabilitation</option><option>Pump Installation</option><option>Irrigation</option><option>Tank Tower</option><option>Solar Structure</option></select></div>
        </div>
        <div class="form-group"><label>Description</label><textarea id="m-description">${item?.description || ''}</textarea></div>
        <div class="form-row">
          <div class="form-group"><label>Date Completed</label><input type="date" id="m-date" value="${item?.date || ''}" /></div>
          <div class="form-group"><label>Status</label><select id="m-status"><option>published</option><option>draft</option></select></div>
        </div>
        <div class="form-group"><label>Client Name</label><input type="text" id="m-client" value="${item?.client || ''}" /></div>
        <div class="form-group"><label>Client Testimonial</label><textarea id="m-testimonial">${item?.testimonial || ''}</textarea></div>
      `,
      blog: () => `
        <div class="form-group"><label>Post Title</label><input type="text" id="m-title" value="${item?.title || ''}" /></div>
        <div class="form-row">
          <div class="form-group"><label>Category</label><select id="m-category"><option>Solar Energy Guide</option><option>Borehole Drilling Tips</option><option>Irrigation & Farming</option><option>Water Conservation</option><option>Company News</option><option>Product Reviews</option></select></div>
          <div class="form-group"><label>Author</label><input type="text" id="m-author" value="${item?.author || 'Admin'}" /></div>
        </div>
        <div class="form-group"><label>Content</label><textarea id="m-content" style="min-height:200px;">${item?.content || ''}</textarea></div>
        <div class="form-row">
          <div class="form-group"><label>Date</label><input type="date" id="m-date" value="${item?.date || new Date().toISOString().split('T')[0]}" /></div>
          <div class="form-group"><label>Status</label><select id="m-status"><option>published</option><option>draft</option><option>scheduled</option></select></div>
        </div>
        <div class="form-group"><label>Tags (comma-separated)</label><input type="text" id="m-tags" value="${item?.tags || ''}" /></div>
      `,
      testimonial: () => `
        <div class="form-row">
          <div class="form-group"><label>Client Name</label><input type="text" id="m-client" value="${item?.client || ''}" /></div>
          <div class="form-group"><label>Location</label><input type="text" id="m-location" value="${item?.location || ''}" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Service Received</label><input type="text" id="m-service" value="${item?.service || ''}" /></div>
          <div class="form-group"><label>Rating (1-5)</label><input type="number" id="m-rating" min="1" max="5" value="${item?.rating || 5}" /></div>
        </div>
        <div class="form-group"><label>Testimonial Text</label><textarea id="m-text">${item?.text || ''}</textarea></div>
        <div class="form-row">
          <div class="form-group"><label>Display Order</label><input type="number" id="m-order" value="${item?.order || ''}" /></div>
          <div class="form-group"><label>Status</label><select id="m-status"><option>published</option><option>draft</option></select></div>
        </div>
      `,
      team: () => `
        <div class="form-row">
          <div class="form-group"><label>Name</label><input type="text" id="m-name" value="${item?.name || ''}" /></div>
          <div class="form-group"><label>Role / Title</label><input type="text" id="m-role" value="${item?.role || ''}" /></div>
        </div>
        <div class="form-group"><label>Bio</label><textarea id="m-bio">${item?.bio || ''}</textarea></div>
        <div class="form-row">
          <div class="form-group"><label>Display Order</label><input type="number" id="m-order" value="${item?.order || ''}" /></div>
          <div class="form-group"><label>Status</label><select id="m-status"><option>active</option><option>inactive</option></select></div>
        </div>
      `,
      faq: () => `
        <div class="form-group"><label>Question</label><input type="text" id="m-question" value="${item?.question || ''}" /></div>
        <div class="form-group"><label>Answer</label><textarea id="m-answer" style="min-height:150px;">${item?.answer || ''}</textarea></div>
        <div class="form-row">
          <div class="form-group"><label>Category</label><select id="m-category"><option>Borehole & Water</option><option>Solar Energy</option><option>Pumps & Irrigation</option><option>General</option></select></div>
          <div class="form-group"><label>Display Order</label><input type="number" id="m-order" value="${item?.order || ''}" /></div>
        </div>
        <div class="form-group"><label>Status</label><select id="m-status"><option>published</option><option>draft</option></select></div>
      `
    };

    body.innerHTML = forms[type] ? forms[type]() : '';

    // Set select values for editing
    if (item) {
      const setVal = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.value = val; };
      setVal('m-category', item.category);
      setVal('m-status', item.status);
      setVal('m-featured', String(item.featured));
      setVal('m-service', item.service);
    }

    document.getElementById('modalOverlay').classList.add('open');
  },

  closeModal() {
    document.getElementById('modalOverlay').classList.remove('open');
    this.editingId = null;
    this.editingType = null;
  },

  saveModal() {
    const type = this.editingType;
    const val = (id) => document.getElementById(id)?.value?.trim() || '';

    const keyMap = {
      service: 'services', package: 'packages', project: 'projects',
      blog: 'blog', testimonial: 'testimonials', team: 'team', faq: 'faq'
    };
    const storeKey = keyMap[type];
    const items = this.load(storeKey);

    let item;
    if (this.editingId) {
      item = items.find(i => i.id === this.editingId);
    } else {
      item = { id: this.nextId(storeKey) };
      items.push(item);
    }

    // Populate fields based on type
    switch (type) {
      case 'service':
        item.title = val('m-title');
        item.slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        item.category = val('m-category');
        item.description = val('m-description');
        item.status = val('m-status');
        item.order = parseInt(val('m-order')) || item.order || items.length;
        break;
      case 'package':
        item.name = val('m-name');
        item.price = parseInt(val('m-price')) || 0;
        item.priceLabel = val('m-priceLabel');
        item.category = val('m-category');
        item.specs = val('m-specs');
        item.status = val('m-status');
        item.featured = val('m-featured') === 'true';
        item.order = parseInt(val('m-order')) || item.order || items.length;
        break;
      case 'project':
        item.title = val('m-title');
        item.location = val('m-location');
        item.service = val('m-service');
        item.description = val('m-description');
        item.date = val('m-date');
        item.status = val('m-status');
        item.client = val('m-client');
        item.testimonial = val('m-testimonial');
        break;
      case 'blog':
        item.title = val('m-title');
        item.slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        item.category = val('m-category');
        item.author = val('m-author');
        item.content = val('m-content');
        item.date = val('m-date');
        item.status = val('m-status');
        item.tags = val('m-tags');
        break;
      case 'testimonial':
        item.client = val('m-client');
        item.location = val('m-location');
        item.service = val('m-service');
        item.rating = parseInt(val('m-rating')) || 5;
        item.text = val('m-text');
        item.status = val('m-status');
        item.order = parseInt(val('m-order')) || item.order || items.length;
        break;
      case 'team':
        item.name = val('m-name');
        item.role = val('m-role');
        item.bio = val('m-bio');
        item.status = val('m-status');
        item.order = parseInt(val('m-order')) || item.order || items.length;
        break;
      case 'faq':
        item.question = val('m-question');
        item.answer = val('m-answer');
        item.category = val('m-category');
        item.status = val('m-status');
        item.order = parseInt(val('m-order')) || item.order || items.length;
        break;
    }

    this.save(storeKey, items);
    this.logActivity(this.editingId ? `Updated ${type}: ${item.title || item.name || item.client || item.question}` : `Added new ${type}: ${item.title || item.name || item.client || item.question}`, '📋');
    this.closeModal();
    this.renderAll();
    this.renderDashboard();
    this.toast('Saved successfully!', 'success');
  },

  editItem(type, id) {
    const keyMap = {
      service: 'services', package: 'packages', project: 'projects',
      blog: 'blog', testimonial: 'testimonials', team: 'team', faq: 'faq'
    };
    const items = this.load(keyMap[type]);
    const item = items.find(i => i.id === id);
    if (item) this.openModal(type, item);
  },

  deleteItem(storeKey, id) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    let items = this.load(storeKey);
    const item = items.find(i => i.id === id);
    items = items.filter(i => i.id !== id);
    this.save(storeKey, items);
    this.logActivity(`Deleted item from ${storeKey}`, '🗑️');
    this.renderAll();
    this.renderDashboard();
    this.toast('Item deleted.', 'success');
  },

  updateStatus(storeKey, id, newStatus) {
    const items = this.load(storeKey);
    const item = items.find(i => i.id === id);
    if (item) {
      item.status = newStatus;
      this.save(storeKey, items);
      this.logActivity(`Updated ${storeKey} status to "${newStatus}" for ${item.name || item.title || 'item'}`, '🔄');
      this.renderDashboard();
    }
  },

  // ---------- DETAIL VIEW ----------
  viewDetail(type, id) {
    const storeKey = type === 'quote' ? 'quotes' : 'messages';
    const items = this.load(storeKey);
    const item = items.find(i => i.id === id);
    if (!item) return;

    const title = document.getElementById('detailTitle');
    const body = document.getElementById('detailBody');

    if (type === 'quote') {
      title.textContent = `Quote Request — ${item.name}`;
      body.innerHTML = `
        <div class="detail-grid">
          <div class="detail-item"><label>Name</label><span>${item.name}</span></div>
          <div class="detail-item"><label>Phone</label><span><a href="tel:${item.phone}">${item.phone}</a></span></div>
          <div class="detail-item"><label>Email</label><span><a href="mailto:${item.email}">${item.email}</a></span></div>
          <div class="detail-item"><label>Location</label><span>${item.location || '—'}</span></div>
          <div class="detail-item"><label>Service</label><span>${item.service}</span></div>
          <div class="detail-item"><label>Package</label><span>${item.package || '—'}</span></div>
          <div class="detail-item"><label>Contact Method</label><span>${item.contactMethod || '—'}</span></div>
          <div class="detail-item"><label>Date</label><span>${item.date}</span></div>
          <div class="detail-item detail-full"><label>Description</label><span>${item.description || '—'}</span></div>
        </div>
        <div class="detail-notes">
          <label style="font-weight:600;font-size:.85rem;display:block;margin-bottom:.35rem;">Internal Notes</label>
          <textarea id="detail-notes" placeholder="Add internal notes...">${item.notes || ''}</textarea>
          <button class="btn-admin btn-admin-sm btn-admin-primary" style="margin-top:.5rem;" onclick="AdminApp.saveNotes('quotes', ${id})">Save Notes</button>
        </div>
      `;
    } else {
      title.textContent = `Message — ${item.name}`;
      // Mark as read
      if (item.status === 'Unread') {
        item.status = 'Read';
        this.save(storeKey, items);
        this.renderMessages();
        this.renderDashboard();
      }
      body.innerHTML = `
        <div class="detail-grid">
          <div class="detail-item"><label>Name</label><span>${item.name}</span></div>
          <div class="detail-item"><label>Phone</label><span><a href="tel:${item.phone}">${item.phone}</a></span></div>
          <div class="detail-item"><label>Email</label><span><a href="mailto:${item.email}">${item.email}</a></span></div>
          <div class="detail-item"><label>Date</label><span>${item.date}</span></div>
          <div class="detail-item"><label>Service Interest</label><span>${item.service || '—'}</span></div>
          <div class="detail-item detail-full"><label>Message</label><span>${item.message}</span></div>
        </div>
      `;
    }

    document.getElementById('detailOverlay').classList.add('open');
  },

  closeDetail() {
    document.getElementById('detailOverlay').classList.remove('open');
  },

  saveNotes(storeKey, id) {
    const items = this.load(storeKey);
    const item = items.find(i => i.id === id);
    if (item) {
      item.notes = document.getElementById('detail-notes')?.value || '';
      this.save(storeKey, items);
      this.toast('Notes saved!', 'success');
    }
  },

  // ---------- STATS ----------
  setupStats() {
    document.getElementById('saveStatsBtn')?.addEventListener('click', () => {
      const stats = {
        boreholes: parseInt(document.getElementById('stat-boreholes')?.value) || 0,
        solar: parseInt(document.getElementById('stat-solar')?.value) || 0,
        clients: parseInt(document.getElementById('stat-clients')?.value) || 0,
        counties: parseInt(document.getElementById('stat-counties')?.value) || 0
      };
      this.save('stats', stats);
      this.logActivity('Updated homepage stats', '📈');
      this.toast('Stats saved!', 'success');
    });
  },

  loadStats() {
    const stats = this.load('stats');
    if (stats && !Array.isArray(stats)) {
      const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
      set('stat-boreholes', stats.boreholes);
      set('stat-solar', stats.solar);
      set('stat-clients', stats.clients);
      set('stat-counties', stats.counties);
    }
  },

  // ---------- SETTINGS ----------
  setupSettings() {
    document.getElementById('saveSettingsBtn')?.addEventListener('click', () => {
      const val = (id) => document.getElementById(id)?.value || '';
      const settings = {
        company: val('set-company'), tagline: val('set-tagline'),
        phone: val('set-phone'), email: val('set-email'),
        whatsapp: val('set-whatsapp'), address: val('set-address'),
        hours: val('set-hours'), facebook: val('set-facebook'),
        instagram: val('set-instagram'), tiktok: val('set-tiktok'),
        linkedin: val('set-linkedin'), youtube: val('set-youtube'),
        twitter: val('set-twitter'), ga: val('set-ga')
      };
      this.save('settings', settings);
      this.logActivity('Updated site settings', '🔧');
      this.toast('Settings saved!', 'success');
    });

    document.getElementById('changePasswordBtn')?.addEventListener('click', () => {
      const newPw = document.getElementById('newPassword')?.value;
      const confirmPw = document.getElementById('confirmPassword')?.value;
      if (!newPw || newPw.length < 6) return this.toast('Password must be at least 6 characters.', 'error');
      if (newPw !== confirmPw) return this.toast('Passwords do not match.', 'error');
      localStorage.setItem(this.DB_KEYS.password, newPw);
      document.getElementById('newPassword').value = '';
      document.getElementById('confirmPassword').value = '';
      this.toast('Password updated!', 'success');
    });
  },

  loadSettings() {
    const settings = this.load('settings');
    if (settings && !Array.isArray(settings)) {
      const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
      set('set-company', settings.company); set('set-tagline', settings.tagline);
      set('set-phone', settings.phone); set('set-email', settings.email);
      set('set-whatsapp', settings.whatsapp); set('set-address', settings.address);
      set('set-hours', settings.hours); set('set-facebook', settings.facebook);
      set('set-instagram', settings.instagram); set('set-tiktok', settings.tiktok);
      set('set-linkedin', settings.linkedin); set('set-youtube', settings.youtube);
      set('set-twitter', settings.twitter); set('set-ga', settings.ga);
    }
  },

  // ---------- EXPORT CSV ----------
  exportCSV(storeKey) {
    const items = this.load(storeKey);
    if (items.length === 0) return this.toast('No data to export.', 'error');

    const headers = Object.keys(items[0]);
    const csv = [
      headers.join(','),
      ...items.map(item => headers.map(h => `"${String(item[h] || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ankhydro-${storeKey}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    this.toast('CSV exported!', 'success');
  },

  // ---------- ACTIVITY LOG ----------
  logActivity(text, icon = '📋') {
    const activity = this.load('activity');
    activity.push({ text, icon, timestamp: Date.now() });
    // Keep last 50
    if (activity.length > 50) activity.splice(0, activity.length - 50);
    this.save('activity', activity);
  },

  timeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  },

  // ---------- TOAST ----------
  toast(message, type = '') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => AdminApp.init());
