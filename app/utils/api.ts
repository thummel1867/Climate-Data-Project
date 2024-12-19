import axios from "axios";

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

export const getCountryData = async (countryCode: string) => {
  const apiKey = "2e9730d9-2f75-488c-a90c-e1f3486c6fc2";

  // Fetch Generation Data
  const generationResponse = await axios.get(
    `https://api.ember-energy.org/v1/electricity-generation/yearly?entity_code=${countryCode}&is_aggregate_series=false&start_date=2000&api_key=${apiKey}`
  );
  console.log("Generation Response Object:", generationResponse);
  const generationData: GenerationData[] = generationResponse.data.data;
  console.log("Fetched Generation Data:", generationData);

  // Fetch Emissions Data
  const emissionsResponse = await axios.get(
    `https://api.ember-energy.org/v1/power-sector-emissions/yearly?entity_code=${countryCode}&start_date=2000&api_key=${apiKey}`
  );
  console.log("Emissions Response Object:", emissionsResponse);
  const emissionsData: EmissionsData[] = emissionsResponse.data.data.map((item: any) => ({
    date: item.date,
    series: item.series,
    emissions_mtco2: item.emissions_mtco2,
  }));
  console.log("Processed Emissions Data:", emissionsData);

  // Aggregate Overall Data
  const overallData: OverallData[] = generationData.map((item) => {
    const matchingEmissions = emissionsData.find((e) => e.date === item.date);
    return {
      date: item.date,
      generation_twh: item.generation_twh,
      emissions_mtco2: matchingEmissions ? matchingEmissions.emissions_mtco2 : 0,
      ratio: matchingEmissions ? item.generation_twh / matchingEmissions.emissions_mtco2 : 0,
    };
  });
  console.log("Aggregated Overall Data:", overallData);

  return { generationData, emissionsData, overallData };
};