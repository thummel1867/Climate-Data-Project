import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import axios from "axios";

const CountryData = ({ countryCode }: { countryCode: string }) => {
  const [data, setData] = useState([]);
  const [type, setType] = useState("total");
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`https://api.ember-energy.org/v1/electricity-generation/yearly?entity_code=${countryCode}&api_key=YOUR_API_KEY`);
      setData(response.data.data);

      const types = Array.from(new Set(response.data.data.map((item) => item.series)));
      setAvailableTypes(types);
    };

    fetchData();
  }, [countryCode]);

  const filteredData = data.filter((item) => type === "total" || item.series === type);

  return (
    <div>
      <label htmlFor="type">Type: </label>
      <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
        <option value="total">Total</option>
        {availableTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CountryData;
