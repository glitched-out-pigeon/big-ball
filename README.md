(!! This is a sample project to test antigravity's potential !!)

# Deep Space Explorer

Deep Space Explorer is an interactive 3D web application built with Three.js and GSAP that allows users to explore a procedurally generated system of fictional exoplanets. The interface is styled as a futuristic spaceship terminal using Tailwind CSS.
This web application aims to provide a dynamic visual representation of planets and their topographical data.

## Features

- **Procedural Exoplanets:** A planet mimicking the Earth's topography using Simplex Noise and custom shaders for topography and ocean depths.
- **Dynamic Topography Legend:** A color-coded legend that updates based on the biome of the currently selected planet.
- **Camera Navigation:** Smooth, cinematic camera transitions between a zoomed-out "System View" and a close-up "Planet View" powered by GSAP.
- **Conditional Bloom Effects:** Planets glow beautifully in the distance using Three.js post-processing, which dynamically turns off when zooming in to ensure sharp, clear topographic data.
- **Atmospheric Scanner:** A futuristic laser-scanning animation that analyzes the currently selected planet, displaying randomized data points such as Oxygen levels, Surface Temperature, Gravity, and detecting hostile life forms or hazardous environments.

## Technologies Used

- [Three.js](https://threejs.org/) - 3D rendering engine, custom GLSL shaders, and post-processing (UnrealBloomPass)
- [GSAP (GreenSock Animation Platform)](https://greensock.com/gsap/) - Smooth camera and UI animations
- [Tailwind CSS](https://tailwindcss.com/) - Futuristic spaceship terminal UI styling
- Vanilla JS/HTML/CSS - Core application logic

## Project Structure

- `index.html`: Main entry point containing the Tailwind UI and module script imports.
- `src/main.js`: Core application loop, GSAP camera Tweening, and UI event listeners.
- `src/planet.js`: Procedural generation logic, GLSL shaders (Simplex Noise implementation), and planet configuration data.
- `src/scene.js`: Setup for the Three.js scene, camera, and generic lighting.
- `src/scanner.js`: Logic for generating and delivering atmospheric scanner data.
- `src/style.css`: Custom futuristic animations (scanlines, scanner lasers).

## Getting Started

Since the project uses ES Modules (`<script type="module">`), it must be served via a local web server to avoid CORS issues.

1. Clone the repository.
2. Start a local server in the project root directory. For example, using Python 3:
   \`\`\`bash
   python -m http.server 8000
   \`\`\`
3. Open your browser and navigate to \`http://localhost:8000\`.
                                                         [OR]
   Use link: https://glitched-out-pigeon.github.io/big-ball/

## Controls

- **UI Buttons:** Click the `<` and `>` buttons to cycle between planets. Click `System View` to zoom out to the entire solar system.
- **Keyboard Arrows:** Use `Left Arrow` and `Right Arrow` keys to navigate between planets.
- **Escape Key:** Press `Esc` to instantly return to the System View.
- **Scanner:** When focused on a planet, click the "Atmosphere Scanner" button to analyze its environment.
