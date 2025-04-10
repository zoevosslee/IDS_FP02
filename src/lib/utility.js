export function rasterToMesh({ bbox, width, height, rasters }) {
    const positions = [];
    const indices = [];
  
    const [minX, minY, maxX, maxY] = bbox;
    const dx = (maxX - minX) / width;
    const dy = (maxY - minY) / height;
  
    // Create vertices
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const lon = minX + x * dx;
        const lat = maxY - y * dy; // flipped vertically
        const z = rasters[y * width + x] || 0;
        positions.push([lon, lat, z]);
      }
    }
  
    // Create triangles
    for (let y = 0; y < height - 1; y++) {
      for (let x = 0; x < width - 1; x++) {
        const i = y * width + x;
        indices.push([i, i + 1, i + width]);
        indices.push([i + 1, i + width + 1, i + width]);
      }
    }
  
    return { positions, indices };
  }
  