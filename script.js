import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js?module';

let renderer = null;
let camera = null;
let scene = null;
let skyboxTextures = [];
let skyboxMesh = null;
let resizeHandler = null;
let rafId = null;
let yawDeg = 0;
let pitchDeg = 0;

const DEBUG_ENABLED = false;

const PITCH_MAX = 80;
const PITCH_MIN = -80;
const YAW_SENSITIVITY = 0.18;
const PITCH_SENSITIVITY = 0.14;
const SKYBOX_SIZE = 24000;

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

function shrinkSkyboxUVs(geometry, margin) {
    const safeMargin = Number.isFinite(margin) && margin > 0 ? margin : 0;
    if (!geometry || !geometry.attributes || !geometry.attributes.uv) {
        return;
    }
    const uvAttr = geometry.attributes.uv;
    const scale = 1 - safeMargin * 2;
    for (let i = 0; i < uvAttr.count; i += 1) {
        const u = uvAttr.getX(i);
        const v = uvAttr.getY(i);
        uvAttr.setXY(i, u * scale + safeMargin, v * scale + safeMargin);
    }
    uvAttr.needsUpdate = true;
}

function debugLog(message, ...args) {
    if (!DEBUG_ENABLED) {
        return;
    }
    try {
        console.log(message, ...args);
        const formattedArgs = args.length
            ? ' ' + args.map((item) => {
                if (item instanceof Error) {
                    return `${item.message}\n${item.stack || ''}`;
                }
                if (typeof item === 'object') {
                    try {
                        return JSON.stringify(item, null, 2);
                    } catch (jsonErr) {
                        return String(item);
                    }
                }
                return String(item);
            }).join(' ')
            : '';
        const text = `[${new Date().toLocaleTimeString()}] ${String(message)}${formattedArgs}`;
        if (typeof fetch === 'function') {
            try {
                const encoded = encodeURIComponent(text.slice(0, 512));
                fetch(`/__debug?msg=${encoded}`, { method: 'GET', mode: 'no-cors', keepalive: false }).catch(() => {});
            } catch (networkErr) {
                // ignore
            }
        }
    } catch (err) {
        // ignore secondary logging issues
    }
}

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
    if (skyboxTextures.length) {
        skyboxTextures.forEach((texture) => {
            if (texture && texture.dispose) {
                texture.dispose();
            }
        });
        skyboxTextures = [];
    }
    if (skyboxMesh && scene) {
        scene.remove(skyboxMesh);
        skyboxMesh.geometry.dispose();
        skyboxMesh.material.dispose();
        skyboxMesh = null;
    }
    if (scene && scene.background) {
        scene.background = null;
    }
    if (scene && scene.environment) {
        scene.environment = null;
    }
    camera = null;
    scene = null;
}

function createSkybox() {
    const loader = new THREE.TextureLoader();
    const faces = [
        'dojo_right.png',
        'dojo_left.png',
        'dojo-top.png',
        'dojo-bottom.png',
        'dojo-front.png',
        'dojo-back.png',
    ];

    const loadFace = (file) => new Promise((resolve, reject) => {
        loader.load(
            `assets/skybox/${file}`,
            (texture) => {
                const width = texture.image && texture.image.width ? texture.image.width : null;
                const height = texture.image && texture.image.height ? texture.image.height : null;
                if ('colorSpace' in texture) {
                    texture.colorSpace = THREE.SRGBColorSpace;
                } else if ('encoding' in texture) {
                    texture.encoding = THREE.sRGBEncoding;
                }
                texture.wrapS = THREE.ClampToEdgeWrapping;
                texture.wrapT = THREE.ClampToEdgeWrapping;
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                texture.generateMipmaps = false;
                debugLog('Skybox face ready', file, width, height);
                resolve(texture);
            },
            undefined,
            (err) => reject(err),
        );
    });

    Promise.all(faces.map((file) => loadFace(file)))
        .then((textures) => {
            debugLog('Skybox textures loaded');
            if (!scene) {
                textures.forEach((texture) => texture.dispose());
                return;
            }
            if (skyboxTextures.length) {
                skyboxTextures.forEach((texture) => {
                    if (texture && texture.dispose) {
                        texture.dispose();
                    }
                });
            }
            skyboxTextures = textures;
            const geometry = new THREE.BoxGeometry(SKYBOX_SIZE, SKYBOX_SIZE, SKYBOX_SIZE);
            const smallestDimension = textures.reduce((acc, texture) => {
                if (!texture || !texture.image) return acc;
                const { width, height } = texture.image;
                const localMin = Math.min(width || acc, height || acc);
                return Math.min(acc, localMin);
            }, Infinity);
            const margin = smallestDimension && Number.isFinite(smallestDimension) && smallestDimension > 0
                ? 1 / (smallestDimension * 2)
                : 0;
            shrinkSkyboxUVs(geometry, margin);
            const materials = textures.map((texture) => new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.BackSide,
                depthWrite: false,
            }));
            if (skyboxMesh && scene) {
                scene.remove(skyboxMesh);
                if (skyboxMesh.geometry) {
                    skyboxMesh.geometry.dispose();
                }
                const priorMaterials = Array.isArray(skyboxMesh.material)
                    ? skyboxMesh.material
                    : [skyboxMesh.material];
                priorMaterials.forEach((material) => {
                    if (material && material.dispose) {
                        material.dispose();
                    }
                });
                skyboxMesh = null;
            }
            skyboxMesh = new THREE.Mesh(geometry, materials);
            skyboxMesh.frustumCulled = false;
            scene.add(skyboxMesh);
            debugLog('Skybox mesh added to scene');
        })
        .catch((err) => {
            debugLog('Failed to load dojo skybox', err && err.message ? err.message : err);
        });
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
    camera = new THREE.PerspectiveCamera(110, aspect, 0.05, SKYBOX_SIZE * 2);
    camera.position.set(0, 0, 0);
    camera.rotation.order = 'YXZ';
    camera.updateProjectionMatrix();

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.setClearColor(0x000000, 1);
    if ('outputColorSpace' in renderer) {
        renderer.outputColorSpace = THREE.SRGBColorSpace;
    } else if ('outputEncoding' in renderer) {
        renderer.outputEncoding = THREE.sRGBEncoding;
    }

    createSkybox();
    debugLog('Skybox load initiated');

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
    debugLog('Dojo viewer booting');
    initDojoViewer();
});

export default initDojoViewer;
