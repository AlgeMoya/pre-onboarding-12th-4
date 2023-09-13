import "./App.css";
import { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
Chart.register(CategoryScale);

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
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

  // 파일 입력(input)의 내용이 변경될 때 실행되는 핸들러
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // 첫 번째 파일만 고려
    setSelectedFile(file);
  };

  // 버튼 클릭 시 파일 내용을 출력하는 핸들러
  const handleUpload = () => {
    if (selectedFile) {
      console.log("선택한 파일 내용:", selectedFile);
      // FileReader 객체를 생성하여 파일 내용 읽기
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          // 읽은 파일 내용을 JSON 파싱하여 출력
          const jsonContent = JSON.parse(event.target.result);
          const objects = [];

          for (const key in jsonContent.response) {
            if (jsonContent.response.hasOwnProperty(key)) {
              const newObj = {
                date: key,
                id: jsonContent.response[key].id,
                value_area: jsonContent.response[key].value_area,
                value_bar: jsonContent.response[key].value_bar,
              };
              objects.push(newObj);
            }
          }

          setJsonData(objects);
        } catch (error) {
          console.error("JSON 파싱 오류:", error);
        }
      };

      reader.readAsText(selectedFile); // 파일을 텍스트로 읽기
    } else {
      console.log("파일이 선택되지 않았습니다.");
    }
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

  return (
    <div className="App">
      <div style={{ margin: "0 auto" }}>
        <Line type="line" data={data} options={options} />
      </div>
      <form action="/uploadFile" enctype="multipart/form-data" method="post">
        <input type="file" name="myFile" onChange={handleFileChange} />
        <button type="button" onClick={handleUpload}>
          업로드
        </button>
      </form>
    </div>
  );
}

export default App;
