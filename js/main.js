document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. Custom Cursor Engine
    // -------------------------------------------------------------
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    const follower = document.createElement('div');
    follower.className = 'custom-cursor-follower';
    document.body.appendChild(cursor);
    document.body.appendChild(follower);

    let mouseX = -100, mouseY = -100;
    let followerX = -100, followerY = -100;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
    });

    function animateCursor() {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        follower.style.left = `${followerX}px`;
        follower.style.top = `${followerY}px`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverables = document.querySelectorAll('a, button, .expertise-card, .portfolio-card, .btn');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // -------------------------------------------------------------
    // 2. Global Background Canvas (Tech Grid & Orbiting Particles)
    // -------------------------------------------------------------
    const bgCanvas = document.createElement('canvas');
    bgCanvas.id = 'bgCanvas';
    document.body.prepend(bgCanvas);
    const ctx = bgCanvas.getContext('2d');

    let width, height;
    let particles = [];
    let gridNodes = [];

    function resizeBgCanvas() {
        width = bgCanvas.width = window.innerWidth;
        height = bgCanvas.height = window.innerHeight;
        initParticles();
    }

    function initParticles() {
        particles = [];
        const count = Math.floor((width * height) / 25000);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.5 + 0.1,
                color: Math.random() > 0.4 ? '#00E5FF' : '#0066FF'
            });
        }
    }

    window.addEventListener('resize', resizeBgCanvas);
    resizeBgCanvas();

    function drawBgCanvas() {
        ctx.clearRect(0, 0, width, height);

        // Tech Grid Lines
        const gridSize = 80;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
        ctx.lineWidth = 1;

        // Draw vertical grid lines
        for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        // Draw horizontal grid lines
        for (let y = 0; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Mouse Parallax Influence
        const targetOffsetX = (mouseX - width / 2) * 0.02;
        const targetOffsetY = (mouseY - height / 2) * 0.02;

        // Draw particles
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x + targetOffsetX, p.y + targetOffsetY, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.shadowBlur = 8;
            ctx.shadowColor = p.color;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1.0;
        });

        requestAnimationFrame(drawBgCanvas);
    }
    drawBgCanvas();

    // -------------------------------------------------------------
    // 3. Interactive Expertise Canvas Visualizer
    // -------------------------------------------------------------
    const expCanvas = document.getElementById('expertiseCanvas');
    if (expCanvas) {
        const expCtx = expCanvas.getContext('2d');
        let activeIndex = 0;
        let expWidth, expHeight;
        let angle = 0;

        function resizeExpCanvas() {
            expWidth = expCanvas.width = expCanvas.parentElement.clientWidth;
            expHeight = expCanvas.height = expCanvas.parentElement.clientHeight;
        }

        window.addEventListener('resize', resizeExpCanvas);
        resizeExpCanvas();

        const expertiseCards = document.querySelectorAll('.expertise-card');
        const tagEl = document.querySelector('.expertise-visual__tag');
        const labelEl = document.querySelector('.expertise-visual__label');

        const expData = [
            { tag: "01 / INGÉNIERIE", label: "Architecture & Code Sur-Mesure" },
            { tag: "02 / MOBILITÉ", label: "Applications Natives & Hybrides Fluidifiées" },
            { tag: "03 / MODERNISATION", label: "Digitalisation Profonde des Processus" },
            { tag: "04 / CLOUD", label: "Infrastructures Haute Disponibilité & DevOps" },
            { tag: "05 / SÉCURITÉ", label: "Audit Rigoureux & Protection des Données" },
            { tag: "06 / INTELLIGENCE", label: "Valorisation de Données & Modèles Métiers" }
        ];

        expertiseCards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                expertiseCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                activeIndex = index;
                if (tagEl && labelEl && expData[index]) {
                    tagEl.textContent = expData[index].tag;
                    labelEl.textContent = expData[index].label;
                }
            });
        });

        function renderExpCanvas() {
            expCtx.clearRect(0, 0, expWidth, expHeight);
            angle += 0.015;

            const cx = expWidth / 2;
            const cy = expHeight / 2;

            expCtx.save();
            expCtx.translate(cx, cy);

            if (activeIndex === 0) {
                // Software Code Network
                expCtx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
                expCtx.lineWidth = 1.5;
                for (let i = 0; i < 6; i++) {
                    const r = 40 + i * 25;
                    expCtx.beginPath();
                    expCtx.arc(0, 0, r, angle * (i % 2 === 0 ? 1 : -1), angle * (i % 2 === 0 ? 1 : -1) + Math.PI * 1.4);
                    expCtx.stroke();
                }
            } else if (activeIndex === 1) {
                // Mobile Mesh Wave
                expCtx.fillStyle = '#00E5FF';
                for (let x = -120; x <= 120; x += 30) {
                    for (let y = -120; y <= 120; y += 30) {
                        const dist = Math.sqrt(x * x + y * y);
                        const wave = Math.sin(dist * 0.05 - angle * 2) * 12;
                        expCtx.beginPath();
                        expCtx.arc(x, y + wave, 2.5, 0, Math.PI * 2);
                        expCtx.fill();
                    }
                }
            } else if (activeIndex === 2) {
                // Matrix Flow Grid
                expCtx.strokeStyle = 'rgba(0, 102, 255, 0.5)';
                expCtx.lineWidth = 1;
                for (let i = -100; i <= 100; i += 20) {
                    expCtx.beginPath();
                    expCtx.moveTo(i, -120);
                    expCtx.lineTo(i + Math.cos(angle + i) * 30, 120);
                    expCtx.stroke();
                }
            } else if (activeIndex === 3) {
                // Cloud Nodes Orbit
                expCtx.strokeStyle = 'rgba(0, 229, 255, 0.6)';
                expCtx.beginPath();
                expCtx.arc(0, 0, 90, 0, Math.PI * 2);
                expCtx.stroke();

                for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
                    const nx = Math.cos(a + angle) * 90;
                    const ny = Math.sin(a + angle) * 90;
                    expCtx.beginPath();
                    expCtx.arc(nx, ny, 6, 0, Math.PI * 2);
                    expCtx.fillStyle = '#00E5FF';
                    expCtx.fill();
                }
            } else if (activeIndex === 4) {
                // Cyber Shield Hexagon
                expCtx.strokeStyle = 'rgba(0, 229, 255, 0.7)';
                expCtx.lineWidth = 2;
                expCtx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const rad = (Math.PI / 3) * i + angle * 0.5;
                    const x = Math.cos(rad) * 80;
                    const y = Math.sin(rad) * 80;
                    if (i === 0) expCtx.moveTo(x, y);
                    else expCtx.lineTo(x, y);
                }
                expCtx.closePath();
                expCtx.stroke();
            } else {
                // AI Data Spheres
                for (let i = 0; i < 24; i++) {
                    const rad = (Math.PI / 12) * i + angle;
                    const r = 50 + Math.sin(angle * 3 + i) * 35;
                    const x = Math.cos(rad) * r;
                    const y = Math.sin(rad) * r;
                    expCtx.beginPath();
                    expCtx.arc(x, y, 3, 0, Math.PI * 2);
                    expCtx.fillStyle = i % 2 === 0 ? '#00E5FF' : '#0066FF';
                    expCtx.fill();
                }
            }

            expCtx.restore();
            requestAnimationFrame(renderExpCanvas);
        }
        renderExpCanvas();
    }

    // -------------------------------------------------------------
    // 4. Header Glass Scroll & Navigation State
    // -------------------------------------------------------------
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.header__nav .nav__link, .mobile-menu .nav__link');
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPath.includes(linkPath) && linkPath !== 'index.html' && linkPath !== '/') {
            link.classList.add('active');
        } else if ((currentPath.endsWith('/') || currentPath.endsWith('index.html')) && (linkPath === 'index.html' || linkPath === '/')) {
            link.classList.add('active');
        }
    });

    // -------------------------------------------------------------
    // 5. Mobile Menu Toggle
    // -------------------------------------------------------------
    const menuBtn = document.querySelector('.header__menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('is-open');
            if (isOpen) {
                mobileMenu.classList.remove('is-open');
                document.body.classList.remove('menu-open');
                menuBtn.textContent = '☰';
            } else {
                mobileMenu.classList.add('is-open');
                document.body.classList.add('menu-open');
                menuBtn.innerHTML = '&times;';
            }
        });
    }

    // -------------------------------------------------------------
    // 6. Scroll Reveal Observer
    // -------------------------------------------------------------
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // -------------------------------------------------------------
    // 7. Contact Form Handling (Simulation)
    // -------------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Transmission en cours...';
            btn.disabled = true;
            btn.style.opacity = '0.7';

            setTimeout(() => {
                contactForm.innerHTML = `
                    <div style="text-align: center; padding: var(--spacing-lg) 0; color: var(--color-white);">
                        <div style="font-size: 3rem; color: var(--color-primary-light); margin-bottom: 1rem;">✓</div>
                        <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Message transmis avec succès</h3>
                        <p style="color: var(--color-text-dim); line-height: 1.6;">Merci de nous avoir contactés. Un ingénieur KREOVA reviendra vers vous sous 24h ouvrées.</p>
                    </div>
                `;
            }, 1200);
        });
    }
});

