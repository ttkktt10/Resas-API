import React from "react";
import { Line } from "react-chartjs-2";

interface ChartProps {
  ChartLineData: () => any;
  ChartLineOptions: () => any;
}

const PopulationChart: React.FC<ChartProps> = ({
  ChartLineData,
  ChartLineOptions
}) => {
  return (
    <div className="graph-container">
      <Line
        data={ChartLineData()}
        options={ChartLineOptions()}
        id="chart-key"
        width="100%"
        height="400px"
      />
    </div>
  );
};

export default PopulationChart;
