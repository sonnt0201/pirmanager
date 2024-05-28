import { Button } from "flowbite-react";
import { useState } from "react";
import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';


// import { CategoryScale, Chart, LinearScale } from "chart.js";

// Chart.register(CategoryScale);
// Chart.register(LinearScale);

export function TestPage() {

    const [chartData, setChartData] = useState({
        labels: [1, 2, 3, 4, 5, 6, 7],
        datasets: [
          {
            label: 'My First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0,
          },
        ],
      });

//   const chartData = ;

  return (
    <div>
      <h1>This is test page</h1>
      <Button onClick={() => {
        // Your logic for sending the message (assuming no Electron)
        console.log("Sending message:"); // Example log
      }}>
        Send message
      </Button>
      <Chart type='line' data={chartData} />
    </div>
  );
}
