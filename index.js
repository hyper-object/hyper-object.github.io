document.addEventListener('DOMContentLoaded', () => {

    // --- Three.js Hyperspectral Cube Visualization ---
    const container = document.getElementById('threejs-container');
    if (container) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        const group = new THREE.Group();
        const numPlanes = 30; // 61 is too many, 30 gives a good visual effect
        const planeSize = 5;
        const spacing = 0.05;

        for (let i = 0; i < numPlanes; i++) {
            const geometry = new THREE.PlaneGeometry(planeSize, planeSize);
            
            // Create a color gradient from violet to red (simulating 400nm to 700nm+)
            const hue = 0.7 - (i / numPlanes) * 0.7;
            const color = new THREE.Color().setHSL(hue, 0.9, 0.55);

            const material = new THREE.MeshBasicMaterial({
                color: color,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.25
            });

            const plane = new THREE.Mesh(geometry, material);
            plane.position.z = (i - numPlanes / 2) * spacing;
            group.add(plane);
        }
        
        scene.add(group);
        camera.position.z = 4;
        camera.position.y = 1;
        camera.lookAt(scene.position);


        // group.rotation.x = 1.1;
        function animate() {
            requestAnimationFrame(animate);

            group.rotation.y += 0.002;
            // if(group.rotation.x < 1.7){
            //     group.rotation.x += 0.001;
            // }
            // else{
            //     group.rotation.x -= 0.001;
            // }
            group.rotation.x += 0.001;
            
            renderer.render(scene, camera);
        }

        window.hcGroup = group; // Expose group for debugging

    

        // const clock = new THREE.Clock();

        // function animate() {
        //     requestAnimationFrame(animate)

        //     const t = clock.getElapsedTime()

        //     // oscillate Y between -π/4 and +π/4
        //     const maxY = Math.PI / 8
        //     group.rotation.y = Math.sin(t * 0.8) * maxY

        //     // oscillate X more slowly between -π/8 and +π/8
        //     const maxX = Math.PI / 16
        //     group.rotation.x = Math.sin(t * 0.4) * maxX

        //     renderer.render(scene, camera)
        // }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        window.addEventListener('resize', onWindowResize, false);
        
        animate();
    }


    // --- Scroll Animations ---
    const scrollElements = document.querySelectorAll('.animate-on-scroll');

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('is-visible');
    };

    const hideScrollElement = (element) => {
        element.classList.remove('is-visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            } 
            // Optional: uncomment to make elements disappear when scrolled past
            // else {
            //     hideScrollElement(el);
            // }
        })
    }

    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
    
    // Initial check on load
    handleScrollAnimation();


    







});


/* ─── Build the spectral cube loader ───────────────────────── */
(function () {
  const NUM_SLICES = 30;               // use 61 if you want the full stack
  const loaderBox  = document.getElementById('spectral-loader');
  if (!loaderBox) return;

  /* create the coloured slices */
  for (let i = 0; i < NUM_SLICES; i++) {
    const slice = document.createElement('div');
    slice.classList.add('slice');

    // Violet (260°) → Red (0°) hue sweep
    const hue = 260 - (i / NUM_SLICES) * 260;
    slice.style.backgroundColor = `hsl(${hue}, 80%, 55%)`;

    // cascade the fill animation
    slice.style.animationDelay = `${i * 0.04}s`;
    loaderBox.appendChild(slice);
  }

  window.addEventListener('load', () => {
    const overlay = document.getElementById('loading-overlay');
    setTimeout(() => overlay.classList.add('hidden'),
               NUM_SLICES * 40 + 300);   // ms
  });
})();



/* ─── Share-link modal logic ───────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

    const shareBtn        = document.getElementById('shareBtn');
    const shareModal      = document.getElementById('shareModal');
    const shareModalClose = document.getElementById('shareModalClose');
    const shareLinkInput  = document.getElementById('shareLink');
    const copyLinkBtn     = document.getElementById('copyLinkBtn');

    if (shareBtn && shareModal) {

        /* open modal */
        shareBtn.addEventListener('click', () => {
            shareLinkInput.value = window.location.href;
            shareModal.classList.add('open');
            shareLinkInput.select();
        });

        /* close modal (× button or backdrop click) */
        shareModalClose.addEventListener('click', () => {
            shareModal.classList.remove('open');
        });
        shareModal.addEventListener('click', (e) => {
            if (e.target === shareModal) shareModal.classList.remove('open');
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') shareModal.classList.remove('open');
        });

        /* copy link */
        copyLinkBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(shareLinkInput.value).then(() => {
                copyLinkBtn.textContent = 'Copied!';
                setTimeout(() => copyLinkBtn.textContent = 'Copy', 2000);
            });
        });
    }

});




document.querySelectorAll('.faq-item .faq-question').forEach(q => {
    q.addEventListener('click', () => {
        const item = q.parentElement;
        item.classList.toggle('open');
    });
});