// ============================================
// CYBERDEVTECHART - MAIN APP SCRIPT
// by Liliana Salinas
// ============================================

// ============================================
// 1. CONFIGURACION  <-- lo unico que necesitas editar
// ============================================
const CONFIG = {
    // Tu correo. Aqui llegan los mensajes del formulario.
    email: 'creativa.cyberdevtechart@gmail.com',

    // Tu WhatsApp en formato internacional, sin + ni espacios.
    whatsapp: '573162682465',

    // Servicio de envio. FormSubmit es gratis y no necesita registro.
    // La PRIMERA vez que alguien envie el formulario, te llegara un correo
    // de FormSubmit pidiendo que confirmes. Haz clic y queda activo para siempre.
    formEndpoint: 'https://formsubmit.co/ajax/creativa.cyberdevtechart@gmail.com'
};

// ============================================
// 2. PLANTILLAS A LA VENTA
//    Para agregar una nueva, copia un bloque y cambia los datos.
// ============================================
const PLANTILLAS = [
    {
        id: 'farmagest',
        nombre: 'FarmaGest',
        categoria: 'Farmacias',
        descripcion: 'Sitio completo para farmacia: catálogo de productos, servicios, horarios y contacto directo por WhatsApp.',
        precio: '$800.000 COP',
        archivo: 'demo-farmacia.html',
        icono: 'fa-mortar-pestle',
        color: 'farmacia',
        incluye: ['Diseño responsive', 'Catálogo de productos', 'Botón de WhatsApp']
    },
    {
        id: 'tiendashop',
        nombre: 'TiendaShop',
        categoria: 'E-commerce',
        descripcion: 'Tienda online moderna con catálogo, carrito de compras y checkout listo para conectar tu pasarela de pagos.',
        precio: '$800.000 COP',
        archivo: 'tienda-shop.html',
        icono: 'fa-shopping-bag',
        color: 'tienda',
        incluye: ['Carrito de compras', 'Catálogo ilimitado', 'Panel de productos']
    },
    {
        id: 'adminpro',
        nombre: 'AdminPro Dashboard',
        categoria: 'Dashboards',
        descripcion: 'Panel de control con gráficas, métricas y tablas de datos para seguir las ventas de tu negocio.',
        precio: '$950.000 COP',
        archivo: 'admin-analytics.html',
        icono: 'fa-chart-line',
        color: 'dashboard',
        incluye: ['Gráficas interactivas', 'Tablas de datos', 'Reportes']
    },
    {
        id: 'creativeimage',
        nombre: 'CreativeImage App',
        categoria: 'Apps',
        descripcion: 'Herramienta web para crear y editar imágenes desde el navegador, ideal para contenido de redes sociales.',
        precio: '$500.000 COP',
        archivo: 'creative-image.html',
        icono: 'fa-wand-magic-sparkles',
        color: 'app',
        incluye: ['Editor Canvas', 'Filtros y textos', 'Descarga en PNG']
    },
    {
        id: 'ventaexpress',
        nombre: 'VentaExpress POS',
        categoria: 'Punto de Venta',
        descripcion: 'Mini sistema de punto de venta para tiendas y negocios: catálogo por categorías, ticket, métodos de pago y ventas del día.',
        precio: '$550.000 COP',
        archivo: 'punto-venta.html',
        icono: 'fa-cash-register',
        color: 'venta',
        incluye: ['Catálogo por categorías', 'Ticket con IVA automático', 'Reporte de ventas del día']
    }
];

// ============================================
// DATOS GUARDADOS (solo para el panel admin)
// ============================================
function safeParse(raw) {
    try {
        const v = JSON.parse(raw);
        return (v && typeof v === 'object') ? v : null;
    } catch (e) {
        return null;
    }
}

function loadSiteData() {
    const data = safeParse(localStorage.getItem('cyberdev_data'));
    if (!data || !data.contact) return; // <-- antes esto rompia toda la pagina

    const set = (id, value) => {
        const el = document.getElementById(id);
        if (el && value) el.textContent = value;
    };

    set('displayCountry', data.contact.country);
    set('heroDescription', data.contact.description);
    set('adminStatus', data.contact.status);

    const emailEl = document.querySelector('#displayEmail a') || document.getElementById('displayEmail');
    if (emailEl && data.contact.email) {
        emailEl.textContent = data.contact.email;
        if (emailEl.tagName === 'A') emailEl.href = 'mailto:' + data.contact.email;
    }
    const phoneEl = document.querySelector('#displayPhone a') || document.getElementById('displayPhone');
    if (phoneEl && data.contact.phone) {
        phoneEl.textContent = data.contact.phone;
        if (phoneEl.tagName === 'A') {
            phoneEl.href = 'https://wa.me/' + data.contact.phone.replace(/[^\d]/g, '');
        }
    }
}

// ============================================
// PLANTILLAS: RENDER + VISTA PREVIA BLOQUEADA
// ============================================
function renderTemplates() {
    const grid = document.getElementById('templatesGrid');
    if (!grid) return;

    grid.innerHTML = PLANTILLAS.map(p => `
        <div class="col-md-6 col-lg-3">
            <article class="template-card reveal">
                <div class="template-thumb ${p.color}">
                    <i class="fas ${p.icono}"></i>
                    <span class="template-badge"><i class="fas fa-lock"></i> Vista previa</span>
                </div>
                <div class="template-body">
                    <span class="template-cat">${p.categoria}</span>
                    <h5>${p.nombre}</h5>
                    <p>${p.descripcion}</p>
                    <ul class="template-includes">
                        ${p.incluye.map(i => `<li><i class="fas fa-check"></i> ${i}</li>`).join('')}
                    </ul>
                    <div class="template-foot">
                        <span class="template-price">${p.precio}</span>
                        <button class="btn btn-template" onclick="openPreview('${p.id}')">
                            <i class="fas fa-eye"></i> Ver
                        </button>
                    </div>
                </div>
            </article>
        </div>
    `).join('');

    initReveal();
}

function openPreview(id) {
    const p = PLANTILLAS.find(t => t.id === id);
    if (!p) return;

    const modal = document.getElementById('previewModal');
    document.getElementById('previewTitle').textContent = p.nombre;
    document.getElementById('previewPrice').textContent = p.categoria + ' · ' + p.precio;
    document.getElementById('previewFrame').src = p.archivo;
    document.getElementById('previewOpen').href = p.archivo;

    const texto = encodeURIComponent(
        'Hola Liliana, vi la plantilla "' + p.nombre + '" (' + p.precio + ') en tu portafolio y me interesa. ¿Me cuentas más?'
    );
    document.getElementById('previewBuy').href = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + texto;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closePreview() {
    const modal = document.getElementById('previewModal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.getElementById('previewFrame').src = 'about:blank';
    document.body.style.overflow = '';
}

function initPreviewModal() {
    const modal = document.getElementById('previewModal');
    if (!modal) return;
    modal.addEventListener('click', e => { if (e.target === modal) closePreview(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closePreview(); });
}

// ============================================
// PARTICULAS
// ============================================
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = window.innerWidth < 768 ? 15 : 25;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 15 + 5;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        container.appendChild(particle);
    }
}

// ============================================
// SCROLL REVEAL
// ============================================
function revealOnScroll() {
    const windowHeight = window.innerHeight;
    document.querySelectorAll('.reveal').forEach(el => {
        if (el.getBoundingClientRect().top < windowHeight - 80) {
            el.classList.add('active');
        }
    });
}

function initReveal() {
    window.removeEventListener('scroll', revealOnScroll);
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
}

// ============================================
// NAVBAR
// ============================================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    window.addEventListener('scroll', function () {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length < 2) return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });

            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const toggler = document.querySelector('.navbar-toggler');
                if (toggler) toggler.click();
            }
        });
    });
}

// ============================================
// FORMULARIO DE CONTACTO (envio real por correo)
// ============================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const feedback = document.getElementById('formFeedback');

    function showFeedback(tipo, texto) {
        if (!feedback) return;
        feedback.className = 'form-feedback show ' + tipo;
        feedback.innerHTML = texto;
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const datos = {
            nombre: form.querySelector('#cfName').value.trim(),
            email: form.querySelector('#cfEmail').value.trim(),
            telefono: form.querySelector('#cfPhone').value.trim(),
            tipo: form.querySelector('#cfType').value,
            mensaje: form.querySelector('#cfMessage').value.trim()
        };

        if (!datos.nombre || !datos.email || !datos.tipo || !datos.mensaje) {
            showFeedback('error', '<i class="fas fa-circle-exclamation"></i> Completa los campos obligatorios.');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) {
            showFeedback('error', '<i class="fas fa-circle-exclamation"></i> Revisa tu correo, parece incompleto.');
            return;
        }

        const btn = form.querySelector('.btn-submit');
        const originalHTML = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';

        try {
            const res = await fetch(CONFIG.formEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    _subject: 'Nuevo mensaje del portafolio: ' + datos.tipo,
                    _template: 'table',
                    Nombre: datos.nombre,
                    Correo: datos.email,
                    WhatsApp: datos.telefono || 'No indicado',
                    'Tipo de proyecto': datos.tipo,
                    Mensaje: datos.mensaje
                })
            });

            if (!res.ok) throw new Error('Respuesta ' + res.status);

            guardarCopiaLocal(datos);
            form.reset();
            btn.innerHTML = '<i class="fas fa-check me-2"></i>¡Mensaje enviado!';
            btn.style.background = '#00b894';
            showFeedback('ok', '<i class="fas fa-circle-check"></i> Recibí tu mensaje. Te respondo en menos de 24 horas.');

        } catch (err) {
            console.error('Error al enviar:', err);
            btn.innerHTML = originalHTML;
            const texto = encodeURIComponent(
                'Hola Liliana, soy ' + datos.nombre + '. Me interesa: ' + datos.tipo + '. ' + datos.mensaje
            );
            showFeedback('error',
                '<i class="fas fa-circle-exclamation"></i> No se pudo enviar el correo. ' +
                '<a href="https://wa.me/' + CONFIG.whatsapp + '?text=' + texto + '" target="_blank" rel="noopener">' +
                'Escríbeme por WhatsApp</a> y lo resolvemos al instante.');
        } finally {
            btn.disabled = false;
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
            }, 4000);
        }
    });
}

// Guarda una copia en este navegador para verla en el panel admin
function guardarCopiaLocal(datos) {
    const appData = safeParse(localStorage.getItem('cyberdev_data')) || {};
    if (!Array.isArray(appData.messages)) appData.messages = [];
    appData.messages.unshift({
        name: datos.nombre,
        email: datos.email,
        phone: datos.telefono,
        type: datos.tipo,
        message: datos.mensaje,
        date: new Date().toLocaleString('es-CO')
    });
    if (appData.messages.length > 100) appData.messages.length = 100;
    try {
        localStorage.setItem('cyberdev_data', JSON.stringify(appData));
    } catch (e) {
        console.warn('No se pudo guardar la copia local.');
    }
}

// ============================================
// AÑO
// ============================================
function updateYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// ============================================
// CONTADORES ANIMADOS
// ============================================
function animateCounters() {
    document.querySelectorAll('.stat-item h3').forEach(counter => {
        const target = counter.textContent;
        const numMatch = target.match(/[\d.]+/);
        if (!numMatch) return;

        const numTarget = parseFloat(numMatch[0]);
        const suffix = target.replace(/[\d.]+/, '');
        const isK = suffix.includes('K');
        const finalValue = isK ? numTarget * 1000 : numTarget;

        let current = 0;
        const increment = finalValue / 60;
        const timer = setInterval(() => {
            current += increment;
            if (current >= finalValue) {
                current = finalValue;
                clearInterval(timer);
            }
            counter.textContent = isK
                ? (current / 1000).toFixed(1) + 'K'
                : Math.floor(current) + suffix;
        }, 30);
    });
}

// ============================================
// LOADER
// ============================================
function removeLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }, 600);
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    try { loadSiteData(); } catch (e) { console.warn(e); }
    renderTemplates();
    initPreviewModal();
    createParticles();
    initReveal();
    initNavbar();
    initSmoothScroll();
    initContactForm();
    updateYear();
    removeLoader();
    setTimeout(animateCounters, 800);
});
