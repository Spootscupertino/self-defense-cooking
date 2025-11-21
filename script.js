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
			// Open the default mail client via mailto
			window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
		});
	}
    
	// No more spinning or flipping for Chef Chilla; he sits still and breathes gently.

	// Parallax: subtle background and character movement following mouse
	const dojoBg = document.getElementById('dojo-bg');
	const particlesRoot = document.getElementById('particles');
	const maxBg = 10; // px
	const maxChar = 12; // px
	function onPointer(e) {
		const w = window.innerWidth;
		const h = window.innerHeight;
		const x = (e.clientX / w) - 0.5; // -0.5 .. 0.5
		const y = (e.clientY / h) - 0.5;
		if (dojoBg) dojoBg.style.transform = `translate(${ -x * maxBg }px, ${ -y * (maxBg/2) }px) scale(1.02)`;
		if (pacingWrap) pacingWrap.style.transform = `translate(${ x * maxChar }px, ${ y * (maxChar/3) }px)`;
	}
	window.addEventListener('pointermove', onPointer);

	// Particles: generate subtle dust motes
	if (particlesRoot) {
		const count = 18;
		for (let i=0;i<count;i++){
			const p = document.createElement('div');
			p.className = 'particle';
			const left = Math.random() * 100;
			const size = 2 + Math.random()*8;
			p.style.left = `${left}%`;
			p.style.width = `${size}px`;
			p.style.height = `${size}px`;
			p.style.bottom = `${5 + Math.random()*30}%`;
			const dur = 6 + Math.random()*10;
			const delay = Math.random()*-dur;
			p.style.animationDuration = `${dur}s`;
			p.style.animationDelay = `${delay}s`;
			p.style.opacity = (0.02 + Math.random()*0.06).toString();
			particlesRoot.appendChild(p);
		}

		// Ambient audio: water trickle
		// Place an audio file at assets/water_trickle.mp3 (short loop). The code will try to play it
		// only after a user gesture or when the user toggles the button.
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
				ambientAudio.volume = 0.0; // start muted for fade-in
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
			try {
				await audio.play();
			} catch (err) {
				// Some browsers require a user gesture. We'll wait for next gesture.
				// Nothing else to do here.
			}
			// fade to gentle level
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

		// user gesture convenience: if user clicked anywhere and pref is on, start audio
		function tryStartIfPref() {
			if (localStorage.getItem(AUDIO_KEY) === 'on' || preferred) {
				createAudio();
				const playPromise = ambientAudio && ambientAudio.play();
				if (playPromise && playPromise.then) playPromise.catch(()=>{}).then(()=>{ fadeAudio(0.16, 900); });
				if (audioToggle) { audioToggle.classList.add('on'); audioToggle.setAttribute('aria-pressed','true'); }
			}
		}

		// Button click toggles audio
		if (audioToggle) {
			// reflect saved state
			if (localStorage.getItem(AUDIO_KEY) === 'on' || preferred) audioToggle.classList.add('on');
			audioToggle.addEventListener('click', function (e) {
				e.preventDefault();
				if (audioToggle.classList.contains('on')) {
					turnAudioOff();
				} else {
					// ensure we have audio element and start it (user gesture present)
					createAudio();
					const p = ambientAudio && ambientAudio.play();
					if (p && p.catch) p.catch(()=>{}).then(()=> fadeAudio(0.16, 900));
					audioToggle.classList.add('on'); audioToggle.setAttribute('aria-pressed','true');
					localStorage.setItem(AUDIO_KEY, 'on');
				}
			});
		}

		// Start ambient audio on first user pointerdown if pref is on
		window.addEventListener('pointerdown', function onceStart() {
			tryStartIfPref();
			window.removeEventListener('pointerdown', onceStart);
		});
	}

	// Gentle idle breathing: a slow scale on the pacing-inner to make meditation feel alive
	const pacingInner = document.querySelector('.pacing-inner');
	if (pacingInner) {
		pacingInner.style.animation += ', idle-breath 5.6s ease-in-out infinite';
	}

	// Add idle-breath keyframes dynamically for compatibility
	const styleSheet = document.createElement('style');
	styleSheet.textContent = `@keyframes idle-breath { 0%{transform: translateY(0) scale(1);} 50%{transform: translateY(-2px) scale(1.01);} 100%{transform: translateY(0) scale(1);} }`;
	document.head.appendChild(styleSheet);

	// --- Tweak panel wiring: allow live adjustments of title using CSS variables ---
	const root = document.documentElement;
	const elTitleTop = document.getElementById('title-top');
	const elTitleSize = document.getElementById('title-size');
	const elBreathDuration = document.getElementById('breath-duration');
	const elInhaleIntensity = document.getElementById('inhale-intensity');
	const elExhaleHold = document.getElementById('exhale-hold');
	const elTranslate = document.getElementById('chef-translateY');
	const elScale = document.getElementById('chef-scale');
	const elOffset = document.getElementById('chef-offsetX');
	const valTitleTop = document.getElementById('val-titleTop');
	const valTitleSize = document.getElementById('val-titleSize');
	const valBreathDuration = document.getElementById('val-breathDuration');
	const valInhaleIntensity = document.getElementById('val-inhaleIntensity');
	const valExhaleHold = document.getElementById('val-exhaleHold');
	const valTranslate = document.getElementById('val-translateY');
	const valScale = document.getElementById('val-scale');
	const valOffset = document.getElementById('val-offsetX');
	const btnReset = document.getElementById('title-reset');
	const btnHide = document.getElementById('title-hide');

	const dojoContainer = document.getElementById('dojo-container');
	const heroStage = document.querySelector('.hero-stage');

	function updateVars() {
		if (elTitleTop) root.style.setProperty('--title-top', elTitleTop.value + 'px');
		if (elTitleSize) root.style.setProperty('--title-size', elTitleSize.value + 'rem');
		if (elBreathDuration) root.style.setProperty('--breath-duration', elBreathDuration.value + 's');
		if (elInhaleIntensity) root.style.setProperty('--inhale-opacity', elInhaleIntensity.value);
		if (elTranslate) root.style.setProperty('--chef-translate-y', elTranslate.value + 'px');
		if (elScale) root.style.setProperty('--chef-scale', elScale.value);
		if (elOffset) root.style.setProperty('--chef-offset-x', elOffset.value + 'px');
		
		if (valTitleTop) valTitleTop.textContent = (elTitleTop ? elTitleTop.value : '157') + 'px';
		if (valTitleSize) valTitleSize.textContent = (elTitleSize ? elTitleSize.value : '1.1') + 'rem';
		if (valBreathDuration) valBreathDuration.textContent = (elBreathDuration ? elBreathDuration.value : '4.5') + 's';
		if (valInhaleIntensity) valInhaleIntensity.textContent = (elInhaleIntensity ? parseFloat(elInhaleIntensity.value).toFixed(1) : '2.0');
		if (valExhaleHold) valExhaleHold.textContent = (elExhaleHold ? elExhaleHold.value : '1.4') + 's';
		if (valTranslate) valTranslate.textContent = (elTranslate ? elTranslate.value : '100') + 'px';
		if (valScale) valScale.textContent = (elScale ? elScale.value : '1.36') + '×';
		if (valOffset) valOffset.textContent = (elOffset ? elOffset.value : '0') + 'px';
	}

	if (elTitleTop) elTitleTop.addEventListener('input', updateVars);
	if (elTitleSize) elTitleSize.addEventListener('input', updateVars);
	if (elBreathDuration) elBreathDuration.addEventListener('input', updateVars);
	if (elInhaleIntensity) elInhaleIntensity.addEventListener('input', updateVars);
	if (elExhaleHold) elExhaleHold.addEventListener('input', updateVars);
	if (elTranslate) elTranslate.addEventListener('input', updateVars);
	if (elScale) elScale.addEventListener('input', updateVars);
	if (elOffset) elOffset.addEventListener('input', updateVars);

	if (btnReset) btnReset.addEventListener('click', function () {
		if (elTitleTop) elTitleTop.value = 157;
		if (elTitleSize) elTitleSize.value = 1.1;
		if (elBreathDuration) elBreathDuration.value = 4.5;
		if (elInhaleIntensity) elInhaleIntensity.value = 2.0;
		if (elExhaleHold) elExhaleHold.value = 1.4;
		if (elTranslate) elTranslate.value = 100;
		if (elScale) elScale.value = 2.3;
		if (elOffset) elOffset.value = 0;
		updateVars();
	});

	if (btnHide) btnHide.addEventListener('click', function () {
		const panel = document.getElementById('tweak-panel');
		if (!panel) return;
		const hidden = panel.getAttribute('aria-hidden') === 'true';
		panel.setAttribute('aria-hidden', hidden ? 'false' : 'true');
		panel.style.display = hidden ? 'block' : 'none';
		btnHide.textContent = hidden ? 'Hide' : 'Show';
	});

	// initialize
	updateVars();

	// --- Slow auto-rotation camera movement ---
	let autoRotateAngle = 0;
	const autoRotateSpeed = 0.015; // degrees per frame - slower
	const autoRotateMax = 6; // max percentage in either direction
	let autoRotateDirection = 1;

	function autoRotate() {
		autoRotateAngle += autoRotateSpeed * autoRotateDirection;
		
		// Reverse direction at limits
		if (autoRotateAngle >= autoRotateMax) {
			autoRotateDirection = -1;
		} else if (autoRotateAngle <= -autoRotateMax) {
			autoRotateDirection = 1;
		}
		
		// Apply rotation
		const rotateY = autoRotateAngle * 0.8;
		const translateX = autoRotateAngle * 0.3;
		
		// Fixed zoom at 1.0
		const currentZoom = 1.0;
		const currentY = 0;
		
		if (dojoContainer) {
			dojoContainer.style.transition = 'none';
			dojoContainer.style.transform = `translateZ(0) scale(${currentZoom}) rotateY(${rotateY}deg) translate(${translateX}%, ${currentY}%)`;
		}
		if (heroStage) {
			heroStage.style.transition = 'none';
			heroStage.style.transform = `translateZ(0) scale(${currentZoom}) rotateY(${rotateY}deg) translate(${translateX}%, ${currentY}%)`;
		}
		
		requestAnimationFrame(autoRotate);
	}
	
	autoRotate();
});
