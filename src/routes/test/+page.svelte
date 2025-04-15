

<!-- //SURFACE FLOATING -->

<script lang="ts">
  import mapboxgl from 'mapbox-gl';
  import * as THREE from 'three';
  import { fromUrl } from 'geotiff';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  import { onMount, onDestroy } from 'svelte';
  import 'mapbox-gl/dist/mapbox-gl.css';

  let mapContainer;
  let threeCanvas;
  let renderer, camera, scene, controls, animationFrameId;
  let surfaceMesh;

  onDestroy(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  if (renderer) renderer.dispose(); // 👈 prevents WebGL leaks
});


  function animate() {
    animationFrameId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  onMount(async () => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2xhdWRpYXRvbWF0ZW8iLCJhIjoiY2prZnN5NWtuMGM1azN2bWxkNmhpeHYyYSJ9.SL5jYHvrqHpfxsZU3yE88w';

    const map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-71.0589, 42.3601], // Boston
      zoom: 12,
      pitch: 0,
      bearing: 0,
      antialias: true
    });

    map.on('load', async () => {
      scene = new THREE.Scene();
      renderer = new THREE.WebGLRenderer({
      canvas: threeCanvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: false
    });

      renderer.setClearColor(0x000000, 0); // transparent
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);

      camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      10,        // near plane
      200000     // far plane — was 10000 or 50000
    );



      const tiff = await fromUrl('/311_2015_final_geo_8bit.tif');
      const image = await tiff.getImage();
      const width = image.getWidth();
      const height = image.getHeight();
      const data = await image.readRasters({ interleave: true });

      const [west, south, east, north] = image.getBoundingBox();
      const resX = (east - west) / width;
      const resY = (north - south) / height;

      const geometry = new THREE.PlaneGeometry(width, height, width - 1, height - 1);
      const min = 0;
      const max = 17;
      const colors = [];

      for (let i = 0; i < geometry.attributes.position.count; i++) {
        const val = data[i];
        const norm = (val - min) / (max - min);
        geometry.attributes.position.setZ(i, norm * 10); // moderate exaggeration
        const color = new THREE.Color();
        color.setHSL(0.6 - norm * 0.5, 1.0, 0.5);
        colors.push(color.r, color.g, color.b);
      }

      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geometry.computeVertexNormals();
      geometry.rotateX(-Math.PI / 2);

      const material = new THREE.MeshBasicMaterial({
      vertexColors: true,
      side: THREE.DoubleSide
    });


      surfaceMesh = new THREE.Mesh(geometry, material);

      const centerX = (west + east) / 2;
      const centerY = (south + north) / 2;
      const center = map.unproject([centerX, centerY]);
      const merc = mapboxgl.MercatorCoordinate.fromLngLat(center, 0);

      surfaceMesh.scale.set(resX, 10, resY);
      surfaceMesh.position.set(merc.x, merc.y, merc.z);
      scene.add(surfaceMesh);

      // const light = new THREE.DirectionalLight(0xffffff, 1);
      // light.position.set(0, 0, 1000);
      // scene.add(light);

      // ✅ OrbitControls: working top-down view
      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(merc.x, merc.y, 0); // center of mesh
      controls.enableZoom = true;
      controls.enableRotate = true;
      controls.enablePan = true;
      controls.zoomSpeed = 1.2;
      controls.rotateSpeed = 0.8;
      controls.panSpeed = 0.5;
      controls.minDistance = 50;
      controls.maxDistance = 100000;
      controls.maxPolarAngle = Math.PI / 2; // 🔒 stay above horizon
      controls.update();

      // ✅ Start above looking down
      camera.position.set(merc.x, merc.y, 12000);
      camera.lookAt(merc.x, merc.y, 0);

      window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      });

      animate();
    });
  });
</script>

<style>
  #mapbox-container {
    position: relative;
    width: 100%;
    height: 100vh;
  }

  #three-canvas {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: auto;
    z-index: 10;
  }
</style>

<div id="mapbox-container">
  <div bind:this={mapContainer} style="width: 100%; height: 100%;" />
  <canvas bind:this={threeCanvas} id="three-canvas" />
</div>








