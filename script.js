// Background rotation
const dojoImages = [
    "assets/dojo_front.png",
    "assets/dojo_left.png",
    "assets/dojo_right.png",
    "assets/dojo_plaque.png"
];

let bgIndex = 0;
const dojoBg = document.getElementById("dojo-bg");

setInterval(() => {
    bgIndex = (bgIndex + 1) % dojoImages.length;
    dojoBg.src = dojoImages[bgIndex];
}, 12000); // 12 sec per rotation

// Chef Chilla animation
const canvas = document.getElementById("chilla-canvas");
const ctx = canvas.getContext("2d");

const chillaImg = new Image();
chillaImg.src = "assets/chef_chilla_idle.png";

// Idle sprite sheet details
const FRAME_WIDTH = chillaImg.width / 3; 
const FRAME_HEIGHT = chillaImg.height / 2;
let frame = 0;

chillaImg.onload = () => animate();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let sx = (frame % 3) * FRAME_WIDTH;
    let sy = Math.floor(frame / 3) * FRAME_HEIGHT;

    ctx.drawImage(
        chillaImg,
        sx, sy, FRAME_WIDTH, FRAME_HEIGHT,
        0, 0, canvas.width, canvas.height
    );

    frame = (frame + 1) % 6;

    requestAnimationFrame(animate);
}
