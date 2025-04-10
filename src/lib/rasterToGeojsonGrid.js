export function rasterToGeoJSONGrid({ raster, width, height, bbox }, scale = 1) {
    const [minX, minY, maxX, maxY] = bbox;
    const dx = (maxX - minX) / width;
    const dy = (maxY - minY) / height;
  
    const features = [];
  
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const value = raster[y][x];
        if (isNaN(value)) continue;
  
        const x0 = minX + x * dx;
        const y0 = maxY - y * dy; // Note: flip Y because raster is top-down
        const x1 = x0 + dx;
        const y1 = y0 - dy;
  
        features.push({
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [[
              [x0, y0],
              [x1, y0],
              [x1, y1],
              [x0, y1],
              [x0, y0]
            ]]
          },
          properties: {
            value,
            height: value * scale
          }
        });
      }
    }
  
    return {
      type: "FeatureCollection",
      features
    };
  }
  