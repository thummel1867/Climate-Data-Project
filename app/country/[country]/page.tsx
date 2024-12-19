import React from "react";
import CountryClientPage from "./CountryClientPage";
import { getCountryData } from "../../utils/api";

const CountryPage = async ({ params, searchParams }: { params: { country: string }; searchParams: { name?: string } }) => {
  const countryCode = params.country;
  const countryName = searchParams.name || countryCode;

  const { generationData, emissionsData, overallData } = await getCountryData(countryCode);

  return (
    <div>
      <CountryClientPage
        countryName={countryName}
        generationData={generationData}
        emissionsData={emissionsData}
        overallData={overallData}
      />
    </div>
  );
};

export default CountryPage;
