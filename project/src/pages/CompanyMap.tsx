import React from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

// Exemple de coordonnées (longitude, latitude)
const locations = [
  { name: "Paris", coordinates: [2.3522, 48.8566] },
  { name: "Lyon", coordinates: [4.8357, 45.7640] },
  { name: "Marseille", coordinates: [5.3698, 43.2965] },
  { name: "Nice", coordinates: [7.2620, 43.7102] },
  { name: "Bordeaux", coordinates: [-0.5792, 44.8378] },
  { name: "Lille", coordinates: [3.0573, 50.6292] },
];


const FRANCE_GEOJSON =
  "https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions-version-simplifiee.geojson";

const CompanyMap: React.FC = () => (
  <div className="flex flex-col items-center py-8">
    <h2 className="text-2xl font-bold mb-4">Nos implantations en France</h2>
    <div className="w-full max-w-md">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [2.5, 46.5], scale: 1100 }}
        width={400}
        height={450}
      >
        <Geographies geography={FRANCE_GEOJSON}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#E5E7EB"
                stroke="#374151"
                strokeWidth={0.3}
              />
            ))
          }
        </Geographies>
        {locations.map(({ name, coordinates }) => (
          <Marker key={name} coordinates={coordinates}>
            <circle r={6} fill="#2563eb" stroke="#fff" strokeWidth={2} />
            <text
              textAnchor="middle"
              y={-12}
              style={{ fontFamily: "sans-serif", fontSize: 12, fill: "#111827" }}
            >
              {name}
            </text>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  </div>
);

export default CompanyMap;