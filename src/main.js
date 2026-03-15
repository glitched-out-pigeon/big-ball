import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { setupScene } from './scene.js';
import { createPlanet } from './planet.js';
import { initScanner, startScan } from './scanner.js';
let scene, camera, renderer, planetObj, controls;
const clock = new THREE.Clock();

function init() {
  // 1. Setup Three.js Scene
  const container = document.getElementById('canvas-container');
  const setup = setupScene(container);
  scene = setup.scene;
  camera = setup.camera;
  renderer = setup.renderer;

  // 2. Add Planet
  planetObj = createPlanet(scene);

  // 3. Initialize Scanner
  initScanner(scene);

  // 4. Add OrbitControls (optional for user interaction, but adds to the explorer feel)
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enablePan = false;
  controls.minDistance = 8;
  controls.maxDistance = 40;

  // UI Elements
  const scanBtn = document.getElementById('scan-btn');
  const dataPanel = document.getElementById('data-panel');
  const scanStatus = document.getElementById('scan-status');

  // DOM Elements for Data
  const dataO2 = document.getElementById('data-o2');
  const dataTemp = document.getElementById('data-temp');
  const dataGrav = document.getElementById('data-grav');
  const barO2 = document.getElementById('bar-o2');
  const barTemp = document.getElementById('bar-temp');
  const barGrav = document.getElementById('bar-grav');

  scanBtn.addEventListener('click', () => {
    // Reset UI
    dataPanel.classList.remove('opacity-0');
    scanStatus.classList.remove('hidden');
    dataO2.textContent = '---';
    dataTemp.textContent = '---';
    dataGrav.textContent = '---';
    barO2.style.width = '0%';
    barTemp.style.width = '0%';
    barGrav.style.width = '0%';

    startScan((data) => {
      // On Complete
      scanStatus.classList.add('hidden');
      
      dataO2.textContent = data.o2;
      dataTemp.textContent = data.temp;
      dataGrav.textContent = data.grav;

      // Animate bars
      setTimeout(() => {
        barO2.style.width = `${Math.min(data.o2Percentage, 100)}%`;
        barTemp.style.width = `${Math.min(data.tempPercentage, 100)}%`;
        barGrav.style.width = `${Math.min(data.gravPercentage, 100)}%`;
      }, 100);
    });
  });

  // Start Animation Loop
  animate();
}

function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();

  // Slowly rotate planet and update uniforms
  if (planetObj && planetObj.planet) {
    planetObj.planet.rotation.y += 0.002;
    planetObj.wireframePlanet.rotation.y -= 0.001;
    planetObj.wireframePlanet.rotation.x += 0.0005;
  }

  // Update controls
  if (controls) controls.update();

  renderer.render(scene, camera);
}

// Ensure DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
