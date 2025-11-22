import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js?module';

let renderer = null;
let camera = null;
let scene = null;
let skyboxMesh = null;
let resizeHandler = null;
let rafId = null;
let sliderElement = null;
let sliderHandler = null;
let currentYawDeg = 0;

function normalizeDegrees(value) {
    const degree = Number.isFinite(value) ? value : Number(value);
    if (!Number.isFinite(degree)) return 0;
    return (degree % 360 + 360) % 360;
}

function describeHeading(deg) {
    const normalized = normalizeDegrees(deg);
    const sectors = [
        { limit: 22.5, label: 'Facing north' },
        { limit: 67.5, label: 'Facing northeast' },
        { limit: 112.5, label: 'Facing east' },
        { limit: 157.5, label: 'Facing southeast' },
        { limit: 202.5, label: 'Facing south' },
        { limit: 247.5, label: 'Facing southwest' },
        { limit: 292.5, label: 'Facing west' },
        { limit: 337.5, label: 'Facing northwest' },
    ];
    for (const sector of sectors) {
        if (normalized < sector.limit) return sector.label;
    }
    return 'Facing north';
}

function updateSliderAccessibility() {
    if (!sliderElement) return;
    sliderElement.setAttribute('aria-valuenow', String(Math.round(currentYawDeg)));
    sliderElement.setAttribute('aria-valuetext', describeHeading(currentYawDeg));
}

function setSkyboxYaw(degrees) {
    currentYawDeg = normalizeDegrees(degrees);
    const radians = THREE.MathUtils.degToRad(currentYawDeg);
    if (skyboxMesh) {
        skyboxMesh.rotation.y = -radians;
    }
    if (sliderElement && document.activeElement !== sliderElement) {
        sliderElement.value = currentYawDeg.toString();
    }
    updateSliderAccessibility();
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
    if (sliderElement && sliderHandler) {
        sliderElement.removeEventListener('input', sliderHandler);
        sliderElement.removeEventListener('change', sliderHandler);
    }
    sliderElement = null;
    sliderHandler = null;
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

    sliderElement = document.getElementById('yaw-slider');
    if (sliderElement) {
        sliderHandler = (event) => {
            const raw = Number(event.target.value);
            if (!Number.isFinite(raw)) return;
            setSkyboxYaw(raw);
        };
        sliderElement.addEventListener('input', sliderHandler);
        sliderElement.addEventListener('change', sliderHandler);
    }

    const initialYawRaw = sliderElement ? Number(sliderElement.value) : currentYawDeg;
    const initialYaw = Number.isFinite(initialYawRaw) ? initialYawRaw : 0;
    setSkyboxYaw(initialYaw);

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
