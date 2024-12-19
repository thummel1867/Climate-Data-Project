"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import geojson from "public/world-geojson.json";

interface GenerationData {
  date: string;
  series: string;
  generation_twh: number;
}

interface EmissionsData {
  date: string;
  series: string;
  emissions_mtco2: number;
}

interface OverallData {
  date: string;
  generation_twh: number;
  emissions_mtco2: number;
  ratio: number;
}

const aggregateDataByYear = (data: any[], key: string) => {
  return data.reduce((acc: Record<string, any>, item) => {
    const year = new Date(item.date).getFullYear();
    if (!acc[year]) {
      acc[year] = { date: `${year}`, [key]: 0 };
    }
    acc[year][key] += item[key];
    return acc;
  }, {});
};

const aggregateDataByType = (data: any[], key: string) => {
  const aggregatedData = data.reduce((acc: Record<string, any>, item) => {
    if (!acc[item.series]) {
      acc[item.series] = { series: item.series, [key]: 0, count: 0 };
    }
    acc[item.series][key] += item[key];
    acc[item.series].count += 1;
    return acc;
  }, {});

  return Object.values(aggregatedData).map((item: any) => ({
    series: item.series,
    [key]: parseFloat((item[key] / item.count).toFixed(2)),
  }));
};

const CountryClientPage = ({
  countryName,
  generationData = [],
  emissionsData = [],
  overallData = [],
}: {
  countryName: string;
  generationData: GenerationData[];
  emissionsData: EmissionsData[];
  overallData: OverallData[];
}) => {
  const [selectedType, setSelectedType] = useState<string>("overall");
  const [countriesWithData, setCountriesWithData] = useState<string[]>([]);

  useEffect(() => {
    const countries = geojson.features
      .map((feature: any) => feature.properties.name)
      .sort();
    setCountriesWithData(countries);
  }, []);

  const energyTypes = Array.from(
    new Set(generationData.map((item) => item.series))
  );

  const filteredGenerationData =
    selectedType === "overall"
      ? overallData
      : generationData.filter((item) => item.series === selectedType);

  const filteredEmissionsData =
    selectedType === "overall"
      ? emissionsData
      : emissionsData.filter((item) => item.series === selectedType);

  const aggregatedGenerationData = Object.values(
    aggregateDataByYear(filteredGenerationData, "generation_twh")
  ).map((item: any) => ({
    ...item,
    generation_twh: parseFloat(item.generation_twh.toFixed(2)),
  }));

  const aggregatedEmissionsData = Object.values(
    aggregateDataByYear(filteredEmissionsData, "emissions_mtco2")
  ).map((item: any) => ({
    ...item,
    emissions_mtco2: parseFloat(item.emissions_mtco2.toFixed(2)),
  }));

  const averageGenerationData = aggregateDataByType(generationData, "generation_twh");
  const averageEmissionsData = aggregateDataByType(emissionsData, "emissions_mtco2");

  const averageRatioData = energyTypes.map((type) => {
    const generation = averageGenerationData.find((item) => item.series === type);
    const emissions = averageEmissionsData.find((item) => item.series === type);
    return {
      series: type,
      ratio: generation && emissions && generation.generation_twh !== 0
        ? parseFloat((emissions.emissions_mtco2 / generation.generation_twh).toFixed(2))
        : 0,
    };
  });

  useEffect(() => {
    console.log("Aggregated Generation Data:", aggregatedGenerationData);
    console.log("Aggregated Emissions Data:", aggregatedEmissionsData);
    console.log("Average Ratio Data:", averageRatioData);
    console.log("Countries with Data:", countriesWithData);
  }, [aggregatedGenerationData, aggregatedEmissionsData, averageRatioData, countriesWithData]);

  return (
    <div className="container">
      <h1>Energy Data for {countryName}</h1>

      <Link href="/" className="back-button">
        Back to Map
      </Link>

      <div className="dropdown">
        <label htmlFor="type-select">Select Energy Type:</label>
        <select
          id="type-select"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="overall">Overall</option>
          {energyTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <h2>Electricity Generation (TWh)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={aggregatedGenerationData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="generation_twh" stroke="#8884d8" name="Generation (TWh)" />
        </LineChart>
      </ResponsiveContainer>

      <h2>Emissions (MTCO2)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={aggregatedEmissionsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="emissions_mtco2" stroke="#82ca9d" name="Emissions (MTCO2)" />
        </LineChart>
      </ResponsiveContainer>

      <h2>Average Emissions to Generation Ratio</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={averageRatioData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="series" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="ratio" fill="#FF5722" name="Emissions to Generation Ratio" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CountryClientPage;