// Fresh dojo has no animations.
// This file also contains a tiny handler to open the user's mail client
// with the message from the contact box.

document.addEventListener('DOMContentLoaded', function () {
	const form = document.getElementById('contact-form');
	const textarea = document.getElementById('contact-message');
	if (form && textarea) {
		form.addEventListener('submit', function (e) {
			e.preventDefault();
			const email = 'eric@selfdefensecooking.com';
			const subject = encodeURIComponent('Inquiry from Self Defense Cooking');
			const body = encodeURIComponent(textarea.value || '');
			window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
		});
	}

    // --- 3D Skybox Interaction ---
    const cube = document.querySelector('.cube');
    let lon = 0, lat = 0; // Start facing "front"
    let onPointerDownPointerX = 0, onPointerDownPointerY = 0;
    let onPointerDownLon = 0, onPointerDownLat = 0;
    let isUserInteracting = false;
    let autoRotateSpeed = 0.02; // Gentle drift

    function onPointerDown(event) {
        // Ignore interactions on the chef button or other UI elements
        if (event.target.closest('a, button, input, textarea, .chef-button')) {
            return;
        }
        isUserInteracting = true;
        const clientX = event.clientX || (event.touches ? event.touches[0].clientX : 0);
        const clientY = event.clientY || (event.touches ? event.touches[0].clientY : 0);
        onPointerDownPointerX = clientX;
        onPointerDownPointerY = clientY;
        onPointerDownLon = lon;
        onPointerDownLat = lat;
    }

    function onPointerMove(event) {
        if (!isUserInteracting) return;
        const clientX = event.clientX || (event.touches ? event.touches[0].clientX : 0);
        const clientY = event.clientY || (event.touches ? event.touches[0].clientY : 0);
        
        lon = (onPointerDownPointerX - clientX) * 0.15 + onPointerDownLon;
        lat = (clientY - onPointerDownPointerY) * 0.15 + onPointerDownLat;
    }

    function onPointerUp() {
        isUserInteracting = false;
    }

    document.addEventListener('mousedown', onPointerDown, false);
    document.addEventListener('mousemove', onPointerMove, false);
    document.addEventListener('mouseup', onPointerUp, false);
    
    document.addEventListener('touchstart', onPointerDown, { passive: false });
    document.addEventListener('touchmove', (e) => { if(isUserInteracting) e.preventDefault(); onPointerMove(e); }, { passive: false });
    document.addEventListener('touchend', onPointerUp, false);

    // Force-enable interaction on the chef button by stopping propagation
    // This ensures the 3D rotation logic (attached to document) never sees these events
    const chefButton = document.getElementById('chef-button');
    if (chefButton) {
        const stopProp = (e) => e.stopPropagation();
        
        // Stop propagation for interaction events so the scene doesn't rotate
        ['mousedown', 'touchstart', 'touchmove', 'touchend'].forEach(evt => 
            chefButton.addEventListener(evt, stopProp, { passive: false })
        );

        // Explicitly handle click to ensure navigation works reliably
        chefButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Don't rotate scene
            console.log('Chef button clicked, navigating to:', chefButton.href);
            window.location.href = chefButton.href;
        });
    }

    function animate() {
        requestAnimationFrame(animate);
        // Auto-rotation removed
        // if (!isUserInteracting) {
        //     lon += autoRotateSpeed;
        // }
        lat = Math.max(-85, Math.min(85, lat));
        if (cube) {
            cube.style.transform = `rotateX(${lat}deg) rotateY(${-lon}deg)`;
        }
    }
    animate();

	// --- Ambient Audio Logic ---
	const audioToggle = document.getElementById('audio-toggle');
	let ambientAudio = null;
	const AUDIO_KEY = 'sdc_ambient_audio';
	const preferred = localStorage.getItem(AUDIO_KEY) === 'on';

	function createAudio() {
		if (ambientAudio) return ambientAudio;
		try {
			ambientAudio = new Audio('assets/water_trickle.mp3');
			ambientAudio.loop = true;
			ambientAudio.preload = 'none';
			ambientAudio.volume = 0.0; 
		} catch (e) {
			console.warn('Ambient audio not available', e);
			ambientAudio = null;
		}
		return ambientAudio;
	}

	function fadeAudio(toVolume, duration = 700) {
		const audio = ambientAudio;
		if (!audio) return Promise.resolve();
		const from = audio.volume;
		const start = performance.now();
		return new Promise((resolve) => {
			function tick(now) {
				const t = Math.min(1, (now - start) / duration);
				audio.volume = from + (toVolume - from) * t;
				if (t < 1) requestAnimationFrame(tick);
				else resolve();
			}
			requestAnimationFrame(tick);
		});
	}

	async function turnAudioOn() {
		const audio = createAudio();
		if (!audio) return;
		try { await audio.play(); } catch (err) {}
		await fadeAudio(0.16, 900);
		if (audioToggle) { audioToggle.classList.add('on'); audioToggle.setAttribute('aria-pressed','true'); }
		localStorage.setItem(AUDIO_KEY, 'on');
	}

	async function turnAudioOff() {
		if (!ambientAudio) { ambientAudio = createAudio(); }
		if (!ambientAudio) { if (audioToggle) audioToggle.classList.remove('on'); localStorage.setItem(AUDIO_KEY, 'off'); return; }
		await fadeAudio(0.0, 600);
		ambientAudio.pause();
		ambientAudio.currentTime = 0;
		if (audioToggle) { audioToggle.classList.remove('on'); audioToggle.setAttribute('aria-pressed','false'); }
		localStorage.setItem(AUDIO_KEY, 'off');
	}

	function tryStartIfPref() {
		if (localStorage.getItem(AUDIO_KEY) === 'on' || preferred) {
			createAudio();
			const playPromise = ambientAudio && ambientAudio.play();
			if (playPromise && playPromise.then) playPromise.catch(()=>{}).then(()=>{ fadeAudio(0.16, 900); });
			if (audioToggle) { audioToggle.classList.add('on'); audioToggle.setAttribute('aria-pressed','true'); }
		}
	}

	if (audioToggle) {
		if (localStorage.getItem(AUDIO_KEY) === 'on' || preferred) audioToggle.classList.add('on');
		audioToggle.addEventListener('click', function (e) {
			e.preventDefault();
			if (audioToggle.classList.contains('on')) {
				turnAudioOff();
			} else {
				createAudio();
				const p = ambientAudio && ambientAudio.play();
				if (p && p.catch) p.catch(()=>{}).then(()=> fadeAudio(0.16, 900));
				audioToggle.classList.add('on'); audioToggle.setAttribute('aria-pressed','true');
				localStorage.setItem(AUDIO_KEY, 'on');
			}
		});
	}

	window.addEventListener('pointerdown', function onceStart() {
		tryStartIfPref();
		window.removeEventListener('pointerdown', onceStart);
	});
});
