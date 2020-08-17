import React, { Component } from "react";

import ENVIRONMENT from "../../environment";

import "./map-style.css";

import mapboxgl from "mapbox-gl";

import mapboxDefaultLayers from "./map-layers";
import mapboxDefaultSources from "./map-sources";

mapboxgl.accessToken = ENVIRONMENT.mapbox.accessToken;

export interface MapControllerProperties {
  map: mapboxgl.Map
}

export interface MapProperties extends mapboxgl.MapboxOptions {
  onload(map: mapboxgl.Map): void
}

export interface PaintParameters {
  'fill-extrusion-color': string,
  'fill-extrusion-height': []
}

export interface LayerParameters {
  id: string,
  source: string,
  'sourse-layer': string,
  fiter: Array<string>,
  type: string,
  minzoom: number,
  paint: PaintParameters
}

export const defaultMapProperties: MapProperties = {
  style: "mapbox://styles/mapbox/streets-v11",
  container: "map",
  zoom: 0,
  center: [0, 0],
  onload: () => { console.log("Map was succesfully loaded..."); }
};

export class MapController implements MapControllerProperties {
  map: mapboxgl.Map;

  constructor(props: MapProperties = defaultMapProperties) {
    this.map = new mapboxgl.Map(props);

    this.map.on('load', () => {
      try {
        props.onload(this.map);
      } catch (err) {
        console.error(err);
      }
    });
  }

  public static createLayer(map: mapboxgl.Map, layerParameters: mapboxgl.Layer, labelLayerId?: string) {
    try {
      map.addLayer(layerParameters, labelLayerId);
    } catch (err) {
      console.error(err);
    }
  }

  public static createSource(map: mapboxgl.Map, sourceParameters: mapboxgl.Source | any, labelSourceId: string) {
    try {
      map.addSource(labelSourceId, sourceParameters);
    } catch (err) {
      console.error(err);
    }
  }

  public createLayer(layerParameters: mapboxgl.Layer, labelLayerId?: string) {
    MapController.createLayer(this.map, layerParameters, labelLayerId);
  }

  public createSource(sourceParameters: mapboxgl.Source | any, labelSourceId: string) {
    MapController.createSource(this.map, sourceParameters, labelSourceId);
  }
}

export default class Map extends Component<any, any> {
  mapController?: MapController;

  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    this.mapController = new MapController({
      style: "mapbox://styles/mapbox/streets-v11",
      container: "map",
      onload: () => {
        if (!this.mapController) { return; }

        this.mapController.createLayer(mapboxDefaultLayers.Buildings3D);
        this.mapController.createSource(mapboxDefaultSources.Earthquakes, 'earthquakes');
        this.mapController.createLayer(mapboxDefaultLayers.Cluster);
        this.mapController.createLayer(mapboxDefaultLayers.ClusterCount);
        this.mapController.createLayer(mapboxDefaultLayers.UnclusteredPoint);
      }
    });
  }

  render() {
    return (
      <section className="map-container" id="map" style={{ width: '1200px', height: '800px' }}>
        here will be a map
        <div className="hio"></div>
      </section>
    );
  }
}
