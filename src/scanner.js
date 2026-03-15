import * as THREE from 'three';

let isScanning = false;
let scannerLine = null;

export function initScanner(scene) {
  // Laser line geometry
  const scanGeometry = new THREE.CylinderGeometry(0.05, 0.05, 14, 32);
  const scanMaterial = new THREE.MeshBasicMaterial({
    color: 0x10b981, // Neon Green
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  });

  scannerLine = new THREE.Mesh(scanGeometry, scanMaterial);
  // Start it to the left of the planet
  scannerLine.position.set(-8, 0, 0);
  
  // Add a glow around the laser
  const glowGeo = new THREE.CylinderGeometry(0.2, 0.2, 14, 32);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  scannerLine.add(glow);

  scene.add(scannerLine);
  return scannerLine;
}

export function startScan(onComplete) {
  if (isScanning) return;
  isScanning = true;

  // Reset position
  scannerLine.position.x = -8;
  
  // Fade in
  scannerLine.material.opacity = 0.8;
  scannerLine.children[0].material.opacity = 0.3; // Glow
  
  document.body.classList.add('scanning-active');

  // Simple animation using requestAnimationFrame
  const speed = 0.1;
  const finishX = 8;

  function animateLaser() {
    if (scannerLine.position.x < finishX) {
      scannerLine.position.x += speed;
      requestAnimationFrame(animateLaser);
    } else {
      // Finished
      isScanning = false;
      document.body.classList.remove('scanning-active');
      
      // Fade out
      scannerLine.material.opacity = 0;
      scannerLine.children[0].material.opacity = 0;
      
      if(onComplete) onComplete(generateRandomData());
    }
  }

  animateLaser();
}

function generateRandomData() {
  const o2 = (Math.random() * (25 - 5) + 5).toFixed(1); // 5% to 25%
  const temp = Math.floor(Math.random() * (120 - (-50)) + (-50)); // -50C to 120C
  const grav = (Math.random() * (1.5 - 0.5) + 0.5).toFixed(2); // 0.5G to 1.5G

  return {
    o2: o2 + ' %',
    temp: temp + ' °C',
    grav: grav + ' G',
    o2Percentage: (o2 / 30) * 100, // For the visual bar (assuming 30 is max scale)
    tempPercentage: ((temp + 50) / 170) * 100, // Scale for UI bar
    gravPercentage: (grav / 2.0) * 100
  };
}
