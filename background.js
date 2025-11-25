// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Orbit Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = false; // Disable auto-rotate
controls.enablePan = true;

// Lighting
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffffff, 2, 300);
sunLight.position.set(0, 0, 0);
sunLight.castShadow = true;
scene.add(sunLight);

// Sun
const sunGeometry = new THREE.SphereGeometry(10, 64, 64);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffdd00 }); // Glowing yellow
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Sun Glow
const sunGlowGeometry = new THREE.SphereGeometry(11, 32, 32);
const sunGlowMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.3 });
const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
scene.add(sunGlow);

// Planets Data (Procedural Colors)
const planetsData = [
    { name: 'Mercury', radius: 0.8, distance: 15, color: 0xaaaaaa, speed: 0.02 },
    { name: 'Venus', radius: 1.5, distance: 22, color: 0xeecb8b, speed: 0.015 },
    { name: 'Earth', radius: 1.6, distance: 30, color: 0x2233ff, speed: 0.01 },
    { name: 'Mars', radius: 0.9, distance: 40, color: 0xff3300, speed: 0.008 },
    { name: 'Jupiter', radius: 4.5, distance: 60, color: 0xd2b48c, speed: 0.004 },
    { name: 'Saturn', radius: 3.8, distance: 80, color: 0xf4a460, speed: 0.003, hasRings: true },
    { name: 'Uranus', radius: 2.5, distance: 100, color: 0xadd8e6, speed: 0.002 },
    { name: 'Neptune', radius: 2.4, distance: 120, color: 0x000080, speed: 0.0015 }
];

const planets = [];

// Create Planets and Orbits
planetsData.forEach(data => {
    // Planet
    const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        color: data.color,
        roughness: 0.7,
        metalness: 0.1
    });
    const planet = new THREE.Mesh(geometry, material);
    planet.castShadow = true;
    planet.receiveShadow = true;

    // Random starting angle
    planet.userData = { angle: Math.random() * Math.PI * 2, distance: data.distance, speed: data.speed, baseSpeed: data.speed };
    scene.add(planet);
    planets.push(planet);

    // Saturn Rings
    if (data.hasRings) {
        const ringGeometry = new THREE.RingGeometry(data.radius + 1, data.radius + 4, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xc2a278,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        planet.add(ring);
    }

    // Orbit Line
    const orbitGeometry = new THREE.RingGeometry(data.distance - 0.1, data.distance + 0.1, 128);
    const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.05 });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);
});

// Starfield
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 5000;
const posArray = new Float32Array(starsCount * 3);

for (let i = 0; i < starsCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 1000;
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const starsMaterial = new THREE.PointsMaterial({ size: 0.7, color: 0xffffff, transparent: true, opacity: 0.8 });
const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starsMesh);

// Camera Position
camera.position.z = 80;
camera.position.y = 40;
camera.lookAt(0, 0, 0);

// Interaction: Toggle Speed
let isFastForward = false;
window.addEventListener('click', () => {
    isFastForward = !isFastForward;
    const multiplier = isFastForward ? 10 : 1;

    planets.forEach(planet => {
        planet.userData.speed = planet.userData.baseSpeed * multiplier;
    });
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate Sun
    sun.rotation.y += 0.002;

    // Rotate Planets
    planets.forEach(planet => {
        planet.userData.angle += planet.userData.speed;
        planet.position.x = Math.cos(planet.userData.angle) * planet.userData.distance;
        planet.position.z = Math.sin(planet.userData.angle) * planet.userData.distance;
        planet.rotation.y += 0.01;
    });

    // Update Controls
    controls.update();

    renderer.render(scene, camera);
}

animate();

// Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
