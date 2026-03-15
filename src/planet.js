import * as THREE from 'three';

export function createPlanet(scene) {
  // Texture Loader for Earth Height Map
  const textureLoader = new THREE.TextureLoader();
  textureLoader.setCrossOrigin('anonymous');
  const heightMap = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-topology.png');

  // Planet Sphere
  const geometry = new THREE.SphereGeometry(6, 256, 256);
  
  const vertexShader = `
    uniform sampler2D uHeightMap;
    varying vec2 vUv;
    varying float vElevation;

    // Simplex noise function for ocean floor generation
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    float snoise(vec3 v){
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
      i = mod(i, 289.0 ); 
      vec4 p = permute( permute( permute( 
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 1.0/7.0;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      vUv = uv;
      
      // Sample the height map texture (using the red channel as it's grayscale)
      vec4 texColor = texture2D(uHeightMap, vUv);
      
      float elevation = 0.0;
      
      // Since ocean is basically 0.0 in the texture map...
      if (texColor.r > 0.02) {
          // It's land! We exaggerate the scale a bit to make mountains pop.
          elevation = (texColor.r - 0.02) * 0.4; 
      } else {
          // It's ocean! The static texture map doesn't contain deep sea data.
          // Let's use noise to simulate oceanic ridges and trenches.
          float noise = snoise(vec3(position.x * 0.8, position.y * 0.8, position.z * 0.8));
          // output from noise usually [-1, 1], we map it entirely below 0
          elevation = (noise - 1.0) * 0.15; 
      }
      
      vElevation = elevation;

      vec3 newPosition = position + normal * elevation;
      
      vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;

      gl_Position = projectedPosition;
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    varying float vElevation;

    void main() {
      // Water depths (cool colors)
      vec3 abyss = vec3(0.3, 0.0, 0.5); // Deep purple
      vec3 deepOcean = vec3(0.0, 0.0, 0.6); // Dark blue
      vec3 shallows = vec3(0.0, 0.5, 0.8); // Light blue
      
      // Land elevations (warm colors)
      vec3 lowlands = vec3(0.1, 0.6, 0.2); // Green
      vec3 midlands = vec3(0.8, 0.6, 0.0); // Orange/Brown
      vec3 highlands = vec3(0.9, 0.2, 0.1); // Red

      vec3 color;
      
      // Use STRICT, SHARP thresholds for a clean, non-cloudy contour mapping
      if (vElevation <= -0.22) {
          color = abyss;
      } else if (vElevation <= -0.1) {
          color = deepOcean;
      } else if (vElevation <= 0.0) {
          color = shallows;
      } else if (vElevation <= 0.1) {
          color = lowlands;
      } else if (vElevation <= 0.2) {
          color = midlands;
      } else {
          color = highlands;
      }

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uHeightMap: { value: heightMap }
    },
    wireframe: false,
  });

  const planet = new THREE.Mesh(geometry, material);
  
  // Add an inner wireframe sphere for that UI/hologram look
  const wireGeometry = new THREE.SphereGeometry(6.05, 32, 32);
  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0x06b6d4, // Cyan
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });
  const wireframePlanet = new THREE.Mesh(wireGeometry, wireMaterial);
  planet.add(wireframePlanet);

  // Add atmosphere glow
  const atmosGeometry = new THREE.SphereGeometry(6.5, 32, 32);
  const atmosMaterial = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.05,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending
  });
  const atmosphere = new THREE.Mesh(atmosGeometry, atmosMaterial);
  planet.add(atmosphere);

  scene.add(planet);

  // Return the main mesh to rotate it in the animation loop
  return { planet, wireframePlanet };
}
