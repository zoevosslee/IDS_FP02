// import GeoTIFF from 'geotiff';

// export async function loadGeoTIFF() {
//   const response = await fetch('/data/311_2015_final_geo_8bit.tif');
//   const arrayBuffer = await response.arrayBuffer();

//   const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
//   const image = await tiff.getImage();
//   const raster = await image.readRasters();
//   const width = image.getWidth();
//   const height = image.getHeight();
//   const flat = raster[0];

//   const max = Math.max(...flat);
//   const values = [];

//   for (let y = 0; y < height; y++) {
//     const row = [];
//     for (let x = 0; x < width; x++) {
//       const i = y * width + x;
//       row.push(flat[i] / max); // normalize to 0–1
//     }
//     values.push(row);
//   }

//   return { width, height, values };
// }

// src/lib/loadGeoTIFF.js
// src/lib/loadGeoTIFF.js
import GeoTIFF from 'geotiff';

export async function loadGeoTIFF(url) {
  const tiff = await GeoTIFF.fromUrl(url);
  const image = await tiff.getImage();

  const bbox = image.getBoundingBox(); // [minX, minY, maxX, maxY]
  const width = image.getWidth();
  const height = image.getHeight();

  const rasters = await image.readRasters({ interleave: true });

  return { bbox, width, height, rasters };
}


