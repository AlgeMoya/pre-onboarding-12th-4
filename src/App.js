import mockData from "./mock/mock_data.json";
import "./App.css";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
Chart.register(CategoryScale);

function App() {
  const [jsonData, setJsonData] = useState();
  const [date, setDate] = useState([]);
  const [id, setId] = useState([]);
  const [value_area, setValue_area] = useState([]);
  const [value_bar, setValue_bar] = useState([]);

  const data = {
    labels: date,
    datasets: [
      {
        type: "bar",
        label: "Area",
        borderColor: "rgb(54, 162, 235)",
        borderWidth: 2,
        data: value_area,
        yAxisID: "y-left", // 첫 번째 Y축 사용
      },
      {
        type: "line",
        label: "Bar",
        backgroundColor: "rgb(255, 99, 132)",
        data: value_bar,
        borderColor: "red",
        yAxisID: "y-right", // 두 번째 Y축 사용
      },
    ],
  };

  const options = {
    spanGaps: true,
    maxBarThickness: 30,
    grouped: true,
    // canvas의 크기에 맞춰지는 반응형 차트를 생성하기 위해 true로 설정
    responsive: true,
    interaction: {
      mode: "index",
    },
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          padding: 10,
          font: {
            family: "'Noto Sans KR', 'serif'",
            lineHeight: 1,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(124, 35, 35, 0.4)",
        padding: 10,
        bodySpacing: 5,
        bodyFont: {
          font: {
            family: "'Noto Sans KR', sans-serif",
          },
        },
        usePointStyle: true,
        filter: (item) => item.parsed.y !== null,
        callbacks: {
          title: (context) => context[0].label,
        },
      },
    },
    scales: {
      "y-left": {
        type: "linear",
        position: "left",
      },
      "y-right": {
        type: "linear",
        position: "right",
      },
    },
  };

  useEffect(() => {
    // jsonData가 업데이트될 때마다 실행됨
    if (jsonData) {
      setDate(jsonData.map((item) => item.date));
      setId(jsonData.map((item) => item.id));
      setValue_area(jsonData.map((item) => item.value_area));
      setValue_bar(jsonData.map((item) => item.value_bar));
    }
  }, [jsonData]);

  useEffect(() => {
    console.log(mockData.response);

    const objects = [];

    for (const key in mockData.response) {
      if (mockData.response.hasOwnProperty(key)) {
        const newObj = {
          date: key,
          id: mockData.response[key].id,
          value_area: mockData.response[key].value_area,
          value_bar: mockData.response[key].value_bar,
        };
        objects.push(newObj);
      }
    }

    setJsonData(objects);
  }, []);

  return (
    <div className="App">
      <div style={{ margin: "0 auto" }}>
        <Line type="line" data={data} options={options} />
      </div>
    </div>
  );
}

export default App;
