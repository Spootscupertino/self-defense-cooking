import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js?module';

let renderer = null;
let camera = null;
let scene = null;
let skyboxMesh = null;
let resizeHandler = null;
let rafId = null;
let yawDeg = 0;
let pitchDeg = 0;

const PITCH_MAX = 80;
const PITCH_MIN = -80;
const YAW_SENSITIVITY = 0.18;
const PITCH_SENSITIVITY = 0.14;

let pointerDownHandler = null;
let pointerMoveHandler = null;
let pointerUpHandler = null;
let pointerCancelHandler = null;
let canvasElement = null;
let activePointerId = null;
let pointerStartX = 0;
let pointerStartY = 0;
let pointerStartYaw = 0;
let pointerStartPitch = 0;

function normalizeDegrees(value) {
    const degree = Number.isFinite(value) ? value : Number(value);
    if (!Number.isFinite(degree)) return 0;
    return (degree % 360 + 360) % 360;
}

function setOrientation(nextYaw, nextPitch) {
    if (typeof nextYaw === 'number') {
        yawDeg = normalizeDegrees(nextYaw);
    }
    if (typeof nextPitch === 'number') {
        const clamped = Math.min(Math.max(nextPitch, PITCH_MIN), PITCH_MAX);
        pitchDeg = clamped;
    }

    const yawRad = THREE.MathUtils.degToRad(yawDeg);
    const pitchRad = THREE.MathUtils.degToRad(pitchDeg);

    if (camera) {
        camera.rotation.set(pitchRad, yawRad, 0, 'YXZ');
    }
}

function teardownViewer() {
    if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
    if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
        resizeHandler = null;
    }
    if (canvasElement && pointerDownHandler) {
        canvasElement.removeEventListener('pointerdown', pointerDownHandler);
    }
    if (pointerMoveHandler) {
        window.removeEventListener('pointermove', pointerMoveHandler);
    }
    if (pointerUpHandler) {
        window.removeEventListener('pointerup', pointerUpHandler);
    }
    if (pointerCancelHandler) {
        window.removeEventListener('pointercancel', pointerCancelHandler);
    }
    pointerDownHandler = null;
    pointerMoveHandler = null;
    pointerUpHandler = null;
    pointerCancelHandler = null;
    canvasElement = null;
    activePointerId = null;
    if (renderer) {
        renderer.dispose();
        renderer = null;
    }
    camera = null;
    scene = null;
    skyboxMesh = null;
}

function createSkybox() {
    const textureLoader = new THREE.TextureLoader();

    function loadFace(url) {
        const texture = textureLoader.load(url, undefined, undefined, (err) => {
            console.error(`Failed to load texture ${url}`, err);
        });
        if ('colorSpace' in texture) {
            texture.colorSpace = THREE.SRGBColorSpace;
        } else if ('encoding' in texture) {
            texture.encoding = THREE.sRGBEncoding;
        }
        return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
    }

    const materials = [
        loadFace('assets/skybox/dojo_right.png'),
        loadFace('assets/skybox/dojo_left.png'),
        loadFace('assets/skybox/dojo-top.png'),
        loadFace('assets/skybox/dojo-bottom.png'),
        loadFace('assets/skybox/dojo-front.png'),
        loadFace('assets/skybox/dojo-back.png'),
    ];

    const geometry = new THREE.BoxGeometry(1200, 1200, 1200);
    skyboxMesh = new THREE.Mesh(geometry, materials);
    scene.add(skyboxMesh);
}

function registerPointerControls(canvas) {
    if (!canvas) return;

    canvas.style.cursor = 'grab';

    pointerDownHandler = (event) => {
        if (typeof event.button === 'number' && event.button !== 0) {
            return;
        }
        activePointerId = event.pointerId;
        pointerStartX = event.clientX;
        pointerStartY = event.clientY;
        pointerStartYaw = yawDeg;
        pointerStartPitch = pitchDeg;
        if (canvas.setPointerCapture) {
            try {
                canvas.setPointerCapture(activePointerId);
            } catch (err) {
                console.warn('Pointer capture failed', err);
            }
        }
        canvas.style.cursor = 'grabbing';
        event.preventDefault();
    };

    pointerMoveHandler = (event) => {
        if (activePointerId === null || event.pointerId !== activePointerId) {
            return;
        }
        const dx = event.clientX - pointerStartX;
        const dy = event.clientY - pointerStartY;
        const nextYaw = pointerStartYaw - dx * YAW_SENSITIVITY;
        const nextPitch = pointerStartPitch - dy * PITCH_SENSITIVITY;
        setOrientation(nextYaw, nextPitch);
        event.preventDefault();
    };

    const releasePointer = () => {
        if (canvas && activePointerId !== null && canvas.releasePointerCapture) {
            try {
                canvas.releasePointerCapture(activePointerId);
            } catch (err) {
                // no-op if pointer capture already released
            }
        }
        activePointerId = null;
        canvas.style.cursor = 'grab';
    };

    pointerUpHandler = (event) => {
        if (event.pointerId !== activePointerId) return;
        releasePointer();
    };

    pointerCancelHandler = (event) => {
        if (event.pointerId !== activePointerId) return;
        releasePointer();
    };

    canvas.addEventListener('pointerdown', pointerDownHandler);
    window.addEventListener('pointermove', pointerMoveHandler);
    window.addEventListener('pointerup', pointerUpHandler);
    window.addEventListener('pointercancel', pointerCancelHandler);
}

export function initDojoViewer() {
    const canvas = document.getElementById('dojo-canvas');
    if (!canvas) {
        console.error('Dojo viewer: #dojo-canvas not found.');
        return;
    }

    teardownViewer();

    scene = new THREE.Scene();

    const aspect = window.innerWidth > 0 && window.innerHeight > 0
        ? window.innerWidth / window.innerHeight
        : 1;
    camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 2000);
    camera.position.set(0, 0, 0);
    camera.rotation.order = 'YXZ';

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.setClearColor(0x000000, 1);

    createSkybox();

    resizeHandler = () => {
        const width = Math.max(window.innerWidth, 1);
        const height = Math.max(window.innerHeight, 1);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
    };

    resizeHandler();
    window.addEventListener('resize', resizeHandler);

    setOrientation(yawDeg, pitchDeg);

    canvasElement = canvas;
    registerPointerControls(canvas);

    const renderLoop = () => {
        rafId = requestAnimationFrame(renderLoop);
        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    };

    renderLoop();
}

window.addEventListener('DOMContentLoaded', () => {
    initDojoViewer();
});

export default initDojoViewer;
