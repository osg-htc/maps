// Minimal typings for the parts of d3-geo-voronoi we use, the package ships without any
declare module 'd3-geo-voronoi' {
  import type { FeatureCollection, Polygon } from 'geojson';

  interface GeoVoronoi<T> {
    // Each feature's properties.site is the datum it was built from
    polygons(): FeatureCollection<Polygon, { site: T; sitecoordinates: [number, number] }>;
  }

  interface GeoDelaunay {
    // Indices of the points whose cells share an edge with each point's cell
    neighbors: number[][];
  }

  export function geoVoronoi<T = [number, number]>(data: T[]): GeoVoronoi<T>;
  export function geoDelaunay(data: [number, number][]): GeoDelaunay;
}
