import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale
} from "chart.js/auto";
import PrefectureCheckbox from "./components/PefectureCheckbox";
import CategorySelect from "./components/CategorySelect";
import Population from "./components/Population";
import "./App.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale
);

const App = () => {
  type Prefecture = {
    prefCode: number;
    prefName: string;
  };

  type PopulationData = {
    year: number;
    value: number;
    rate?: number;
  };

  type PrefPopulation = {
    prefName: string;
    label?: string;
    data: PopulationData[];
  };

  const categories = ["総人口", "年少人口", "生産年齢人口", "老年人口"];

  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [checked, setChecked] = useState<Prefecture[]>([]);
  const [displayGraphData, setDisplayGraphData] = useState<PrefPopulation[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] = useState("総人口");

  const apiRequest = async (url: string) => {
    return await axios.get(url, {
      headers: {
        "X-API-KEY": "YmTlDcRGRpSxA1oz9toZprlZz4eUiOf0V9QsiJLM",
        "Content-Type": "application/json;charset=UTF-8"
      }
    });
  };

  // 都道府県一覧を取得
  useEffect(() => {
    const fn = async () => {
      try {
        const response = await apiRequest(
          "https://opendata.resas-portal.go.jp/api/v1/prefectures"
        );

        setPrefectures(response.data.result);
        console.log({ setPrefectures });
      } catch (error) {
        console.log(error);
      }
    };
    fn();
  }, []);

  const handleEventChecked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checkedPrefName: string = e.target.value;
    const isChecked: boolean = e.target.checked;
    let newChecked = [];

    if (isChecked) {
      const checkedPrefecture = prefectures.find(
        (pref) => pref.prefName === checkedPrefName
      );

      if (checkedPrefecture) {
        newChecked = [...checked, checkedPrefecture];
        setChecked(newChecked);
        await prefGraphData(selectedCategory, newChecked);
      }
    } else {
      newChecked = checked.filter((pref) => pref.prefName !== checkedPrefName);
      setChecked(newChecked);
      setDisplayGraphData((prevState) =>
        prevState.filter((pref) => pref.prefName !== checkedPrefName)
      );
    }
  };

  const prefGraphData = async (category: string, newChecked: Prefecture[]) => {
    const newDisplayGraphData = await Promise.all(
      newChecked.map(async (checkedPref) => {
        const response = await apiRequest(
          `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${checkedPref.prefCode}`
        );

        const prefPopulationData = response.data.result.data;
        const selectedPopulationData = prefPopulationData.find(
          (categoryData: { label: string }) => categoryData.label === category
        );

        return {
          prefName: checkedPref.prefName,
          label: selectedCategory,
          data: selectedPopulationData.data
        };
      })
    );
    await setDisplayGraphData(newDisplayGraphData);
  };

  const ChartLineData = () => ({
    labels: displayGraphData[0]?.data.map((num) => num.year) || [],
    datasets: displayGraphData.map((values) => ({
      label: values.prefName,
      data: values.data.map((populationData) => populationData.value),
      fill: false,
      borderColor: "rgb(75, 192, 192)"
    }))
  });

  const ChartLineOptions = (): any => ({
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 40,
          padding: 10
        }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { size: 14 },
        bodyFont: { size: 12 }
      }
    }
  });

  const selectpopulationCategory = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCategory(e.target.value);
    prefGraphData(e.target.value, checked);
  };

  return (
    <div className="App">
      <header>
        <h1>都道府県別総人口推移</h1>
      </header>
      <div className="prefectures-container">
        {prefectures.map((prefecture) => (
          <PrefectureCheckbox
            key={prefecture.prefCode}
            prefecture={prefecture}
            handleEventChecked={handleEventChecked}
          />
        ))}
      </div>
      <CategorySelect
        categories={categories}
        selectpopulationCategory={selectpopulationCategory}
      />
      <Population
        ChartLineData={ChartLineData}
        ChartLineOptions={ChartLineOptions}
      />
    </div>
  );
};
export default App;
