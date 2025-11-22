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
	const pacingWrap = document.querySelector('.pacing-wrap');
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

	// --- Tweak panel wiring: allow live adjustments of title using CSS variables ---
	const root = document.documentElement;
	const elTitleTop = document.getElementById('title-top');
	const elTitleSize = document.getElementById('title-size');
	const elTranslate = document.getElementById('chef-translateY');
	const elScale = document.getElementById('chef-scale');
	const elOffset = document.getElementById('chef-offsetX');
	const elChest = document.getElementById('chef-chest');
	const elStomach = document.getElementById('chef-stomach');
	const elMouth = document.getElementById('chef-mouth');
	const valTitleTop = document.getElementById('val-titleTop');
	const valTitleSize = document.getElementById('val-titleSize');
	const valTranslate = document.getElementById('val-translateY');
	const valScale = document.getElementById('val-scale');
	const valOffset = document.getElementById('val-offsetX');
	const valChest = document.getElementById('val-chest');
	const valStomach = document.getElementById('val-stomach');
	const valMouth = document.getElementById('val-mouth');
	const btnReset = document.getElementById('title-reset');
	const btnSavePose = document.getElementById('pose-save');
	const btnClearPose = document.getElementById('pose-clear');
	const btnHide = document.getElementById('title-hide');
    const tweakPanel = document.getElementById('tweak-panel');

	const dojoContainer = document.getElementById('dojo-container');
	const heroStage = document.querySelector('.hero-stage');
	const cameraYawInput = document.getElementById('camera-yaw');
	const cameraPitchInput = document.getElementById('camera-pitch');
	const cameraSpeedInput = document.getElementById('camera-speed');
	const valCameraYaw = document.getElementById('val-cameraYaw');
	const valCameraPitch = document.getElementById('val-cameraPitch');
	const valCameraSpeed = document.getElementById('val-cameraSpeed');

	function clamp(val, min, max) {
		return Math.min(Math.max(val, min), max);
	}

	function toNumber(value, fallback) {
		const num = parseFloat(value);
		return Number.isFinite(num) ? num : fallback;
	}

	function updateVars() {
		const titleTopVal = elTitleTop ? clamp(toNumber(elTitleTop.value, 157), 20, 500) : 157;
		const titleSizeVal = elTitleSize ? clamp(toNumber(elTitleSize.value, 1.1), 1, 5) : 1.1;
		const translateVal = elTranslate ? clamp(toNumber(elTranslate.value, -60), -500, 300) : -60;
		const scaleVal = elScale ? clamp(toNumber(elScale.value, 0.7), 0.1, 3) : 0.7;
		const offsetVal = elOffset ? clamp(toNumber(elOffset.value, -133), -300, 300) : -133;
		const chestVal = elChest ? clamp(toNumber(elChest.value, 0.6), 0.2, 1.5) : 0.6;
		const stomachVal = elStomach ? clamp(toNumber(elStomach.value, 50), 50, 70) : 50;
		const mouthVal = elMouth ? clamp(toNumber(elMouth.value, 0.1), 0, 1) : 0.1;

		if (elTitleTop) elTitleTop.value = titleTopVal;
		if (elTitleSize) elTitleSize.value = titleSizeVal;
		if (elTranslate) elTranslate.value = translateVal;
		if (elScale) elScale.value = scaleVal;
		if (elOffset) elOffset.value = offsetVal;
		if (elChest) elChest.value = chestVal;
		if (elStomach) elStomach.value = stomachVal;
		if (elMouth) elMouth.value = mouthVal;

		root.style.setProperty('--title-top', `${titleTopVal}px`);
		root.style.setProperty('--title-size', `${titleSizeVal}rem`);
		root.style.setProperty('--chef-translate-y', `${translateVal}px`);
		root.style.setProperty('--chef-scale', String(scaleVal));
		root.style.setProperty('--chef-offset-x', `${offsetVal}px`);
		root.style.setProperty('--chef-inhale-intensity', String(chestVal));
		root.style.setProperty('--chef-breath-mask-cut', `${stomachVal}%`);
		root.style.setProperty('--chef-mouth-open', String(mouthVal));
		
		if (valTitleTop) valTitleTop.textContent = (elTitleTop ? elTitleTop.value : '157') + 'px';
		if (valTitleSize) valTitleSize.textContent = (elTitleSize ? elTitleSize.value : '1.1') + 'rem';
		if (valTranslate) valTranslate.textContent = `${translateVal}px`;
		if (valScale) valScale.textContent = `${scaleVal.toFixed(2)}×`;
		if (valOffset) valOffset.textContent = `${offsetVal}px`;
		if (valChest) valChest.textContent = `${Math.round(chestVal * 100)}%`;
		if (valStomach) valStomach.textContent = `${stomachVal}%`;
		if (valMouth) valMouth.textContent = `${Math.round(mouthVal * 100)}%`;
	}

	const POSE_STORAGE_KEY = 'sdc_chef_pose';

	function persistPose() {
		if (!window.localStorage) return;
		const payload = {
			titleTop: elTitleTop ? elTitleTop.value : undefined,
			titleSize: elTitleSize ? elTitleSize.value : undefined,
			translateY: elTranslate ? elTranslate.value : undefined,
			scale: elScale ? elScale.value : undefined,
			offsetX: elOffset ? elOffset.value : undefined,
			chest: elChest ? elChest.value : undefined,
			stomach: elStomach ? elStomach.value : undefined,
			mouth: elMouth ? elMouth.value : undefined
		};
		try {
			localStorage.setItem(POSE_STORAGE_KEY, JSON.stringify(payload));
		} catch (err) {
			console.warn('Unable to persist Chef pose settings', err);
		}
	}

	function loadSavedPose() {
		if (!window.localStorage) return;
		const raw = localStorage.getItem(POSE_STORAGE_KEY);
		if (!raw) return;
		try {
			const saved = JSON.parse(raw);
			if (saved) {
				if (elTitleTop && saved.titleTop !== undefined) elTitleTop.value = saved.titleTop;
				if (elTitleSize && saved.titleSize !== undefined) elTitleSize.value = saved.titleSize;
				if (elTranslate && saved.translateY !== undefined) elTranslate.value = saved.translateY;
				if (elScale && saved.scale !== undefined) elScale.value = saved.scale;
				if (elOffset && saved.offsetX !== undefined) elOffset.value = saved.offsetX;
				if (elChest && saved.chest !== undefined) elChest.value = saved.chest;
				if (elStomach && saved.stomach !== undefined) elStomach.value = saved.stomach;
				if (elMouth && saved.mouth !== undefined) elMouth.value = saved.mouth;
			}
		} catch (err) {
			console.warn('Unable to load Chef pose settings', err);
		}
	}

	function handleControlInput() {
		updateVars();
		persistPose();
	}

	if (elTitleTop) elTitleTop.addEventListener('input', handleControlInput);
	if (elTitleSize) elTitleSize.addEventListener('input', handleControlInput);
	if (elTranslate) elTranslate.addEventListener('input', handleControlInput);
	if (elScale) elScale.addEventListener('input', handleControlInput);
	if (elOffset) elOffset.addEventListener('input', handleControlInput);
	if (elChest) elChest.addEventListener('input', handleControlInput);
	if (elStomach) elStomach.addEventListener('input', handleControlInput);
	if (elMouth) elMouth.addEventListener('input', handleControlInput);

	if (btnReset) btnReset.addEventListener('click', function () {
		if (elTitleTop) elTitleTop.value = 400;
		if (elTitleSize) elTitleSize.value = 1.1;
		if (elTranslate) elTranslate.value = -60;
		if (elScale) elScale.value = 0.7;
		if (elOffset) elOffset.value = -133;
		if (elChest) elChest.value = 0.6;
		if (elStomach) elStomach.value = 50;
		if (elMouth) elMouth.value = 0.1;
		updateVars();
		persistPose();
	});

	if (btnSavePose) btnSavePose.addEventListener('click', function () {
		persistPose();
		const original = btnSavePose.textContent;
		btnSavePose.textContent = 'Saved!';
		setTimeout(() => { btnSavePose.textContent = original; }, 1200);
	});

	if (btnClearPose) btnClearPose.addEventListener('click', function () {
		if (window.localStorage) {
			localStorage.removeItem(POSE_STORAGE_KEY);
		}
		if (elTitleTop) elTitleTop.value = 400;
		if (elTitleSize) elTitleSize.value = 1.1;
		if (elTranslate) elTranslate.value = -60;
		if (elScale) elScale.value = 0.7;
		if (elOffset) elOffset.value = -133;
		if (elChest) elChest.value = 0.6;
		if (elStomach) elStomach.value = 50;
		if (elMouth) elMouth.value = 0.1;
		updateVars();
		persistPose();
	});

	function setPanelVisibility(show) {
		if (!tweakPanel) return;
		tweakPanel.setAttribute('aria-hidden', show ? 'false' : 'true');
		tweakPanel.style.display = show ? 'block' : 'none';
		if (btnHide) btnHide.textContent = show ? 'Hide' : 'Show';
	}

	setPanelVisibility(false);

	if (btnHide) btnHide.addEventListener('click', function () {
		if (!tweakPanel) return;
		const currentlyHidden = tweakPanel.getAttribute('aria-hidden') === 'true';
		setPanelVisibility(currentlyHidden);
	});

	document.addEventListener('keydown', function (event) {
		if (event.key.toLowerCase() === 't') {
			event.preventDefault();
			const currentlyHidden = tweakPanel && tweakPanel.getAttribute('aria-hidden') === 'true';
			setPanelVisibility(currentlyHidden);
		}
	});

	// initialize
	loadSavedPose();
	updateVars();

	const CAMERA_PITCH_MIN = -25;
	const CAMERA_PITCH_MAX = 25;
	const CAMERA_SPEED_MAX = 40;

	function normalizeAngle(value) {
		let result = value % 360;
		if (result < 0) result += 360;
		return result;
	}

	let manualYaw = cameraYawInput ? clamp(toNumber(cameraYawInput.value, 0), 0, 360) : 0;
	let manualPitch = cameraPitchInput ? clamp(toNumber(cameraPitchInput.value, 0), CAMERA_PITCH_MIN, CAMERA_PITCH_MAX) : 0;
	let orbitSpeed = cameraSpeedInput ? clamp(toNumber(cameraSpeedInput.value, 8), 0, CAMERA_SPEED_MAX) : 0;
	let orbitOffset = 0;
	let lastCameraFrame = performance.now();

	if (cameraYawInput) cameraYawInput.value = String(manualYaw);
	if (cameraPitchInput) cameraPitchInput.value = String(manualPitch);
	if (cameraSpeedInput) cameraSpeedInput.value = String(orbitSpeed);

	function applyCameraTransform() {
		const totalYaw = normalizeAngle(manualYaw + orbitOffset);
		const pitch = manualPitch;
		const translateXPct = Math.sin(totalYaw * Math.PI / 180) * 2.6;
		const translateYPct = pitch * -0.2;
		const transform = `translateZ(0) rotateX(${pitch}deg) rotateY(${totalYaw}deg) translate(${translateXPct}%, ${translateYPct}%)`;
		if (dojoContainer) {
			dojoContainer.style.transition = 'none';
			dojoContainer.style.transform = transform;
		}
		if (heroStage) {
			heroStage.style.transition = 'none';
			heroStage.style.transform = transform;
		}
		root.style.setProperty('--camera-yaw', `${totalYaw}deg`);
		root.style.setProperty('--camera-pitch', `${pitch}deg`);
		if (valCameraYaw) valCameraYaw.textContent = `${Math.round(totalYaw)}°`;
		if (valCameraPitch) valCameraPitch.textContent = `${Math.round(pitch)}°`;
		if (valCameraSpeed) valCameraSpeed.textContent = `${orbitSpeed.toFixed(0)}°/s`;
	}

	if (cameraYawInput) {
		cameraYawInput.addEventListener('input', () => {
			manualYaw = clamp(toNumber(cameraYawInput.value, manualYaw), 0, 360);
			cameraYawInput.value = String(manualYaw);
			applyCameraTransform();
		});
	}

	if (cameraPitchInput) {
		cameraPitchInput.addEventListener('input', () => {
			manualPitch = clamp(toNumber(cameraPitchInput.value, manualPitch), CAMERA_PITCH_MIN, CAMERA_PITCH_MAX);
			cameraPitchInput.value = String(manualPitch);
			applyCameraTransform();
		});
	}

	if (cameraSpeedInput) {
		cameraSpeedInput.addEventListener('input', () => {
			orbitSpeed = clamp(toNumber(cameraSpeedInput.value, orbitSpeed), 0, CAMERA_SPEED_MAX);
			cameraSpeedInput.value = String(orbitSpeed);
			applyCameraTransform();
		});
	}

	function cameraLoop(now) {
		const delta = (now - lastCameraFrame) / 1000;
		lastCameraFrame = now;
		if (orbitSpeed > 0) {
			orbitOffset = normalizeAngle(orbitOffset + (orbitSpeed * delta));
		}
		applyCameraTransform();
		window.requestAnimationFrame(cameraLoop);
	}

	applyCameraTransform();
	window.requestAnimationFrame(cameraLoop);

	// --- Chef breathing loop: crossfade inhale/exhale frames without keyframes ---
	const breathInhale = document.getElementById('chef-breath-inhale');
	const breathExhale = document.getElementById('chef-breath-exhale');
	const prefersReducedMotion = typeof window.matchMedia === 'function'
		? window.matchMedia('(prefers-reduced-motion: reduce)')
		: { matches: false };

	let breathTimer = null;
	let breathState = 'exhale';

	function applyBreathState(nextState) {
		if (!breathInhale) return;
		if (nextState === 'inhale') {
			breathInhale.classList.add('is-visible');
		} else {
			breathInhale.classList.remove('is-visible');
		}
		breathState = nextState;
	}

	function cancelBreathingLoop() {
		if (breathTimer) {
			window.clearTimeout(breathTimer);
			breathTimer = null;
		}
		if (breathInhale) breathInhale.classList.remove('is-visible');
		breathState = 'exhale';
	}

	function queueNextBreath() {
		const next = breathState === 'exhale' ? 'inhale' : 'exhale';
		applyBreathState(next);
		const delay = next === 'inhale' ? 3600 : 4200;
		breathTimer = window.setTimeout(queueNextBreath, delay);
	}

	function startBreathingLoop() {
		if (!breathInhale || prefersReducedMotion.matches) return;
		cancelBreathingLoop();
		applyBreathState('exhale');
		breathTimer = window.setTimeout(queueNextBreath, 3600);
	}

	if (breathInhale && breathExhale) {
		if (!prefersReducedMotion.matches) {
			startBreathingLoop();
		}

		const handleMotionPreference = (event) => {
			const prefersReduce = typeof event.matches === 'boolean' ? event.matches : prefersReducedMotion.matches;
			if (prefersReduce) {
				cancelBreathingLoop();
			} else {
				startBreathingLoop();
			}
		};

		if (typeof prefersReducedMotion.addEventListener === 'function') {
			prefersReducedMotion.addEventListener('change', handleMotionPreference);
		} else if (typeof prefersReducedMotion.addListener === 'function') {
			prefersReducedMotion.addListener(handleMotionPreference);
		}
	}

});
