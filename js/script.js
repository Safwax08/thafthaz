import * as THREE from 'three';

document.addEventListener('DOMContentLoaded', () => {
    // --- Digital Plexus 3D Background Logic ---
    function initPlexusBackground() {
        const container = document.getElementById('bg-3d-animation');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // --- Helper: Create Texture from Text/Symbol ---
        function createSymbolTexture(symbol) {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'rgba(0,0,0,0)';
            ctx.fillRect(0,0,64,64);
            ctx.font = 'bold 40px Poppins';
            ctx.fillStyle = '#64ffda';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(symbol, 32, 32);
            return new THREE.CanvasTexture(canvas);
        }

        const symbols = ['$', '[', ']', '{', '}', '1', '0', '*'];
        const symbolGroups = [];

        // Create scattered symbols
        symbols.forEach(symbol => {
            const texture = createSymbolTexture(symbol);
            const count = 40;
            const posArray = new Float32Array(count * 3);
            for (let i = 0; i < count * 3; i++) {
                posArray[i] = (Math.random() - 0.5) * 20;
            }
            const geom = new THREE.BufferGeometry();
            geom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            const mat = new THREE.PointsMaterial({
                size: 0.3,
                map: texture,
                transparent: true,
                opacity: 0.4,
                blending: THREE.AdditiveBlending
            });
            const points = new THREE.Points(geom, mat);
            scene.add(points);
            symbolGroups.push(points);
        });

        // --- Central Plexus Sphere ---
        const sphereRadius = 4;
        const sphereGeom = new THREE.IcosahedronGeometry(sphereRadius, 1);
        const edges = new THREE.EdgesGeometry(sphereGeom);
        const wireframeMat = new THREE.LineBasicMaterial({ color: 0x1a1a2e, transparent: true, opacity: 0.3 });
        const plexusLines = new THREE.LineSegments(edges, wireframeMat);
        
        // Sphere Nodes (Glowing dots)
        const nodeMat = new THREE.PointsMaterial({
            size: 0.15,
            color: 0x00d2ff,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        const plexusNodes = new THREE.Points(sphereGeom, nodeMat);

        const plexusGroup = new THREE.Group();
        plexusGroup.add(plexusLines);
        plexusGroup.add(plexusNodes);
        scene.add(plexusGroup);

        camera.position.z = 8;

        // Mouse Interactivity
        let mouseX = 0;
        let mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) / 100;
            mouseY = (e.clientY - window.innerHeight / 2) / 100;
        });

        // Animation Loop
        function animate() {
            requestAnimationFrame(animate);

            // Rotate Plexus Sphere
            plexusGroup.rotation.y += 0.002;
            plexusGroup.rotation.x += 0.001;

            // Sway based on mouse
            plexusGroup.position.x += (mouseX - plexusGroup.position.x) * 0.05;
            plexusGroup.position.y += (-mouseY - plexusGroup.position.y) * 0.05;

            // Animate Symbols
            symbolGroups.forEach((group, index) => {
                group.rotation.y += 0.001 * (index + 1) * 0.1;
                group.position.x += (mouseX * 0.2 - group.position.x) * 0.02;
            });

            renderer.render(scene, camera);
        }

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        animate();
    }

    initPlexusBackground();

    // --- Dark Mode Logic (Permanent Dark) ---
    const body = document.body;
    body.classList.add('dark-mode');
    body.classList.remove('light-mode');

    // --- Instagram Dropdown Logic ---
    const instaTrigger = document.getElementById('insta-trigger');
    const instaDropdown = document.getElementById('insta-dropdown');

    if (instaTrigger && instaDropdown) {
        instaTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            instaDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking anywhere else
        document.addEventListener('click', (e) => {
            if (!instaTrigger.contains(e.target) && !instaDropdown.contains(e.target)) {
                instaDropdown.classList.remove('active');
            }
        });
    }


    const cursor = document.querySelector('.cursor');
    const cursor2 = document.querySelector('.cursor2');

    document.addEventListener('mousemove', function (e) {
        cursor.style.cssText = cursor2.style.cssText = "left: " + e.clientX + "px; top: " + e.clientY + "px;";
    });

    // Hover Effects
    const clickableElements = document.querySelectorAll('a, button, .skill-card, .project-card');

    clickableElements.forEach(el => {
        el.addEventListener('mouseover', () => {
            cursor.classList.add('expand');
            cursor2.classList.add('expand');
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('expand');
            cursor2.classList.remove('expand');
        });
    });

    // Graphic Design gallery loader + lightbox (auto from manifest)
    function setupGdLightbox() {
        let gdLightbox = document.querySelector('.gd-lightbox');
        if (!gdLightbox) {
            gdLightbox = document.createElement('div');
            gdLightbox.className = 'gd-lightbox';
            gdLightbox.innerHTML = `
      <div>
        <img class="gd-lightbox-img" src="" alt="">
        <div class="gd-lightbox-caption"></div>
      </div>
    `;
            document.body.appendChild(gdLightbox);
        }

        const lbImg = gdLightbox.querySelector('.gd-lightbox-img');
        const lbCap = gdLightbox.querySelector('.gd-lightbox-caption');

        function openGdLightbox(img) {
            lbImg.src = img.src;
            lbImg.alt = img.alt || '';
            lbCap.textContent = img.dataset.caption || img.alt || '';
            gdLightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            lbImg.focus && lbImg.focus();
        }

        // Expose a simple utility to open the lightbox by src (used by full gallery)
        window.openGdLightbox = function(src, alt, caption) {
            lbImg.src = src;
            lbImg.alt = alt || '';
            lbCap.textContent = caption || alt || '';
            gdLightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const gdThumbs = document.querySelectorAll('.gd-thumb');
        gdThumbs.forEach(img => {
            img.setAttribute('tabindex', '0');
            img.addEventListener('click', () => openGdLightbox(img));
            img.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openGdLightbox(img);
                }
            });
        });

        gdLightbox.addEventListener('click', (e) => {
            if (e.target === gdLightbox || e.target === lbImg) {
                gdLightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                gdLightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    function loadGdGallery(container) {
        const manifestPath = container.dataset.manifest || 'assets/images/graphic-manifest.json';
        fetch(manifestPath).then(res => {
            if (!res.ok) throw new Error('Manifest not found');
            return res.json();
        }).then(files => {
            container.innerHTML = '';
            files.forEach(p => {
                // skip profile.jpg if present
                const lower = p.toLowerCase();
                if (lower.includes('profile')) return;
                const img = document.createElement('img');
                img.src = p;
                img.alt = p.split('/').pop().replace(/[-_]/g, ' ');
                img.className = 'gd-thumb';
                img.loading = 'lazy';
                img.dataset.caption = img.alt;
                container.appendChild(img);
            });
            setupGdLightbox();
        }).catch(err => {
            container.innerHTML = '<div class="gd-loading" style="color:var(--color-text-muted);">No images found</div>';
            console.warn('GD gallery load failed:', err);
        });
    }

    const gdContainers = document.querySelectorAll('.gd-gallery');
    gdContainers.forEach(c => loadGdGallery(c));

    // Video gallery loader + modal
    function loadVdGallery(container) {
        const manifestPath = container.dataset.manifest || 'assets/videos-manifest.json';
        fetch(manifestPath).then(res => {
            if (!res.ok) throw new Error('Video manifest not found');
            return res.json();
        }).then(files => {
            container.innerHTML = '';
            files.forEach(p => {
                const lower = p.toLowerCase();
                if (!/\.(mp4|mov|webm|ogg)$/i.test(lower)) return;
                const wrap = document.createElement('div');
                wrap.className = 'vd-thumb';
                const vid = document.createElement('video');
                vid.src = p;
                vid.muted = true;
                vid.playsInline = true;
                vid.preload = 'metadata';
                // try to autoplay muted for preview (may be blocked on some browsers)
                vid.autoplay = true;
                vid.loop = true;
                vid.setAttribute('aria-hidden','true');
                wrap.appendChild(vid);
                const label = document.createElement('div');
                label.className = 'vd-label';
                label.textContent = p.split('/').pop();
                wrap.appendChild(label);
                container.appendChild(wrap);

                wrap.addEventListener('click', () => {
                    openVdPlayer(p, label.textContent);
                });
            });
        }).catch(err => {
            container.innerHTML = '<div class="vd-loading" style="color:var(--color-text-muted);">No videos found</div>';
            console.warn('VD gallery load failed:', err);
        });
    }

    const vdContainers = document.querySelectorAll('.vd-gallery');
    vdContainers.forEach(c => loadVdGallery(c));

    function openVdPlayer(src, caption) {
        let modal = document.querySelector('.vd-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'vd-modal';
            modal.innerHTML = `
      <div class="vd-player">
        <video controls playsinline class="vd-player-video"></video>
        <div class="vd-player-caption"></div>
      </div>
    `;
            document.body.appendChild(modal);
        }

        const player = modal.querySelector('.vd-player-video');
        const cap = modal.querySelector('.vd-player-caption');
        player.src = src;
        cap.textContent = caption || '';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        player.play().catch(() => {});

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
                player.pause();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.classList.remove('active');
                document.body.style.overflow = '';
                player.pause();
            }
        });
    }

    function openVdFullGallery(manifestPath) {
        const mp = manifestPath || 'assets/videos-manifest.json';
        fetch(mp).then(res => res.json()).then(files => {
            let modal = document.querySelector('.vd-fullgallery');
            if (!modal) {
                modal = document.createElement('div');
                modal.className = 'vd-fullgallery';
                modal.innerHTML = `
        <div class="vd-fullwrap">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:1rem; margin-bottom:1rem;">
            <h3 style="margin:0">Video Editing — All Work</h3>
            <button class="vd-fullclose" aria-label="Close videos">✕</button>
          </div>
          <div class="vd-fullgrid"></div>
        </div>
      `;
                document.body.appendChild(modal);
            }

            const grid = modal.querySelector('.vd-fullgrid');
            grid.innerHTML = '';
            files.forEach(p => {
                if (!/\.(mp4|mov|webm|ogg)$/i.test(p.toLowerCase())) return;
                const wrap = document.createElement('div');
                wrap.className = 'vd-fullitem';
                const vid = document.createElement('video');
                vid.src = p;
                vid.setAttribute('preload','metadata');
                vid.muted = true;
                vid.playsInline = true;
                vid.loop = true;
                wrap.appendChild(vid);
                grid.appendChild(wrap);

                vid.addEventListener('click', () => {
                    openVdPlayer(p, p.split('/').pop());
                });
            });

            modal.querySelector('.vd-fullclose').addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }).catch(err => {
            console.warn('Failed to open video gallery', err);
            alert('Unable to load video gallery at the moment.');
        });
    }

    const projectVideo = document.querySelector('.project-video');
    if (projectVideo) {
        projectVideo.addEventListener('click', () => {
            const manifest = document.querySelector('.vd-gallery')?.dataset.manifest || 'assets/videos-manifest.json';
            openVdFullGallery(manifest);
        });
        projectVideo.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const manifest = document.querySelector('.vd-gallery')?.dataset.manifest || 'assets/videos-manifest.json';
                openVdFullGallery(manifest);
            }
        });
    }

    // Full gallery modal (opens when the Graphic Design card is clicked)
    function openGdFullGallery(manifestPath) {
        const mp = manifestPath || 'assets/images/graphic-manifest.json';
        fetch(mp).then(res => res.json()).then(files => {
            let modal = document.querySelector('.gd-fullgallery');
            if (!modal) {
                modal = document.createElement('div');
                modal.className = 'gd-fullgallery';
                modal.innerHTML = `
        <div class="gd-fullwrap">
          <div class="gd-fullheader">
            <h3>Graphic Design — All Work</h3>
            <button class="gd-fullclose" aria-label="Close gallery">✕</button>
          </div>
          <div class="gd-note">Click an image to view larger</div>
          <div class="gd-fullgrid"></div>
        </div>
      `;
                document.body.appendChild(modal);
            }

            const grid = modal.querySelector('.gd-fullgrid');
            grid.innerHTML = '';
            files.forEach(p => {
                if (p.toLowerCase().includes('profile')) return;
                const item = document.createElement('div');
                item.className = 'gd-fullitem';
                const img = document.createElement('img');
                img.src = p;
                img.alt = p.split('/').pop().replace(/[-_]/g, ' ');
                img.dataset.caption = img.alt;
                item.appendChild(img);
                grid.appendChild(item);
                img.addEventListener('click', () => {
                    if (window.openGdLightbox) window.openGdLightbox(img.src, img.alt, img.dataset.caption);
                });
            });

            const closeBtn = modal.querySelector('.gd-fullclose');
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }).catch(err => {
            console.warn('Failed to open full gallery', err);
            alert('Unable to load gallery at the moment.');
        });
    }

    // Attach click handler to the Graphic Design project card
    const projectGraphic = document.querySelector('.project-graphic');
    if (projectGraphic) {
        projectGraphic.addEventListener('click', () => {
            const manifest = document.querySelector('.gd-gallery')?.dataset.manifest || 'assets/images/graphic-manifest.json';
            openGdFullGallery(manifest);
        });
        projectGraphic.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const manifest = document.querySelector('.gd-gallery')?.dataset.manifest || 'assets/images/graphic-manifest.json';
                openGdFullGallery(manifest);
            }
        });
    }

    // --- Hover Video Preview Logic ---
    const videoCard = document.querySelector('.project-card[data-hover-video]');
    const previewVideo = document.getElementById('hover-preview-video');

    if (videoCard && previewVideo) {
        videoCard.addEventListener('mouseenter', () => {
            videoCard.classList.add('playing-video');
            previewVideo.play().catch(err => {
                console.warn('Auto-play blocked or failed', err);
            });
        });

        videoCard.addEventListener('mouseleave', () => {
            videoCard.classList.remove('playing-video');
            previewVideo.pause();
            previewVideo.currentTime = 0; // Reset to start
        });
    }

});
