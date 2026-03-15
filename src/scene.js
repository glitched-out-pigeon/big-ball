import * as THREE from 'three';

export function setupScene(container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#020617'); // slate-950

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 25;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(10, 5, 10);
  scene.add(directionalLight);

  const blueLight = new THREE.PointLight(0x06b6d4, 5, 50); // cyan
  blueLight.position.set(-10, 0, 10);
  scene.add(blueLight);
  
  const greenLight = new THREE.PointLight(0x10b981, 3, 50); // green
  greenLight.position.set(10, -10, 5);
  scene.add(greenLight);

  // Add stars/particles
  createStars(scene);

  const resize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', resize);

  return { scene, camera, renderer };
}

function createStars(scene) {
  const starsGeometry = new THREE.BufferGeometry();
  const starsCount = 1000;
  const posArray = new Float32Array(starsCount * 3);
  
  for(let i = 0; i < starsCount * 3; i++) {
    // Spread stars widely
    posArray[i] = (Math.random() - 0.5) * 100;
  }
  
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const starsMaterial = new THREE.PointsMaterial({
    size: 0.1,
    color: 0x06b6d4, // cyan tinted stars
    transparent: true,
    opacity: 0.6
  });
  
  const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(starsMesh);
}
