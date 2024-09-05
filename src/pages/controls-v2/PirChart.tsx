
import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import { useEffect, useRef, useState } from "react";
import { ChartData, Point } from 'chart.js/auto';
import { EncodedPirRecord, IGroup, IPir, IPirRecord, LogType } from '../../interfaces';
import axios from 'axios';
import { ID } from '../../interfaces/typedef';
import { PirRecord } from '../../models';
import { useLog } from '../../app_states';
import { json } from 'react-router-dom';
import { color } from 'chart.js/helpers';


interface Props {
  capturing: boolean;
  serverAddress: string;
  pirGroup: IGroup | null;

}


/*
{
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
      }
*/

const CHART_COLORS: string[] = ["red", 'green', "yellow", "blue", "purple"]

export const PirChart = ({ capturing, serverAddress, pirGroup }: Props) => {

  const [chartData, setChartData] = useState<ChartData<"line", (number | Point | null)[], unknown>>({ labels: [], datasets: [] });
  const [pirRecords, setPirRecords] = useState<PirRecord[]>([]);
  const recordIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [_, log] = useLog();

  const nowAsSec = () => Math.floor(Date.now() / 1000);

  // fetch data from server
  useEffect(() => {

    fetchRecordsWhenCapturing();

  }, [capturing])

  // when pir records change
  useEffect(() => {

    updateChart();

  }, [pirRecords])


  const updateChart = () => {

    let labels: number[] = [];

    let valuesForYAxis: number[][] = Array(pirGroup?.pirs?.length).fill([]);
    let labelsForYAxis: string[] = [];
    // console.log(pirGroup)



    pirGroup?.pirs?.forEach((pir: IPir, index: number) => {
      // console.log(pir.id)
      labelsForYAxis.push(pir.description as string);
      // filt data
      pirRecords.filter(record => record.pirId == pir.id).forEach((record) => {

        if (index === 0) labels = [...labels, ...record.timeInMillisecs()];

        valuesForYAxis[index] = [...valuesForYAxis[index], ...record.vols];

        // console.log(labels)

      })
    })



    setChartData(() => ({
      labels,
      datasets:
       [...valuesForYAxis.map((datum, index) =>

        ({
          label: labelsForYAxis[index],
          data: datum,
          fill: false,
          borderColor: CHART_COLORS[index % CHART_COLORS.length],
          // tension: 0.1,
          pointRadius: 1
        })


        ),

        {
          label: "Min",
          data: labels.map(_ => 0),
          fill: false,
          borderColor: "black",
          // tension: 0.1,
          pointRadius: 1

        },

        {
          label: "Max",
          data: labels.map(_ => 3000),
          fill: false,
          borderColor: "black",
          // tension: 0.1,
          pointRadius: 1

        },
        
      
      ],
      options: {
        animations: false,

        scales: {
          y: {
            type: 'linear',
            min: 0,
            max: 3000
          }
        }
      }
    }));
  }

  const fetchRecordsWhenCapturing = () => {
    if (!capturing) {
      if (recordIntervalRef.current) clearInterval(recordIntervalRef.current)
      return;
    }
    
  

  }

  return <>

    <Chart type='line' data={chartData} />
  </>
}