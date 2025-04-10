import * as THREE from 'three';

export function createSurface({ width, height, values }, xScale, yScale, zScale) {
    const geometry = new THREE.PlaneGeometry(xScale, yScale, width - 1, height - 1);
  
    let i = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const z = values[y][x] * zScale;
        geometry.attributes.position.setZ(i, z);
        i++;
      }
    }
    
  
    geometry.computeVertexNormals();
  
    const material = new THREE.MeshStandardMaterial({
      color: 0x4444ff,
      wireframe: false,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    });
  
    return new THREE.Mesh(geometry, material);
  }
  
  
