import { Source } from "mapbox-gl";

const Earthquakes: Source | any = {
  type: 'geojson',
  data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
  cluster: true,
  clusterMaxZoom: 14,
  clusterRadius: 50
};

export default {
  Earthquakes
};
