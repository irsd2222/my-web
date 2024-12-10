// Inisialisasi Scene dan Kamera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Objek
const centralMassGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const centralMassMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const centralMass = new THREE.Mesh(centralMassGeometry, centralMassMaterial);
scene.add(centralMass);

const orbitingBodyGeometry = new THREE.SphereGeometry(0.2, 32, 32);
const orbitingBodyMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const orbitingBody = new THREE.Mesh(orbitingBodyGeometry, orbitingBodyMaterial);
scene.add(orbitingBody);

const pathGeometry = new THREE.BufferGeometry();
const positions = [];
pathGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
const pathMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const pathLine = new THREE.Line(pathGeometry, pathMaterial);
scene.add(pathLine);

// Variabel Simulasi
let centralMassValue = 10;
let orbitMassValue = 1;
let position = { x: 10, y: 0 };
let velocity = { x: 0, y: 5 };
let timeStep = 0.01;
let running = false;

// Update Slider
function updateSliders() {
    centralMassValue = parseFloat(document.getElementById("centralMassSlider").value);
    orbitMassValue = parseFloat(document.getElementById("orbitMassSlider").value);
    position.x = parseFloat(document.getElementById("initialXSlider").value);
    position.y = parseFloat(document.getElementById("initialYSlider").value);
    velocity.x = parseFloat(document.getElementById("velocityXSlider").value);
    velocity.y = parseFloat(document.getElementById("velocityYSlider").value);

    orbitingBody.position.set(position.x, position.y, 0);
}

// Simulasi
function simulate() {
    if (!running) return;

    const r = Math.sqrt(position.x ** 2 + position.y ** 2);
    const force = (centralMassValue * orbitMassValue) / (r ** 2);
    const ax = -force * (position.x / r);
    const ay = -force * (position.y / r);

    velocity.x += ax * timeStep;
    velocity.y += ay * timeStep;

    position.x += velocity.x * timeStep;
    position.y += velocity.y * timeStep;

    orbitingBody.position.set(position.x, position.y, 0);

    // Update path
    positions.push(position.x, position.y, 0);
    if (positions.length > 3000) positions.splice(0, 3);
    pathGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    pathGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
    requestAnimationFrame(simulate);
}

// Event Listener
document.getElementById("centralMassSlider").addEventListener("input", updateSliders);
document.getElementById("orbitMassSlider").addEventListener("input", updateSliders);
document.getElementById("initialXSlider").addEventListener("input", updateSliders);
document.getElementById("initialYSlider").addEventListener("input", updateSliders);
document.getElementById("velocityXSlider").addEventListener("input", updateSliders);
document.getElementById("velocityYSlider").addEventListener("input", updateSliders);

document.getElementById("startButton").addEventListener("click", () => {
    running = !running;
    if (running) {
        simulate();
        document.getElementById("startButton").innerText = "Hentikan Simulasi";
    } else {
        document.getElementById("startButton").innerText = "Mulai Simulasi";
    }
});

// Pengaturan Awal
camera.position.z = 50;
updateSliders();
renderer.render(scene, camera);
