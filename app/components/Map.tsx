"use client";


import React from "react";
import { useRouter } from "next/navigation";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";

const geoUrl = "/world-geojson.json"; // Replace with the correct path to your GeoJSON file

const Map = () => {
  const router = useRouter();

  const handleCountryClick = (geo: any) => {
    const countryCode = geo.properties.iso_a3; // Example property for country code
    const countryName = geo.properties.name; // Example property for country name
  
    if (countryCode && countryName) {
      router.push(`/country/${countryCode}?name=${encodeURIComponent(countryName)}`);
    } else {
      console.error("Country code or name is undefined. Cannot navigate.");
    }
  };  

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ComposableMap>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => handleCountryClick(geo)}
                style={{
                  default: { fill: "#D6D6DA", outline: "none" },
                  hover: { fill: "#F53", outline: "none" },
                  pressed: { fill: "#E42", outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default Map;
