import React, { useState, useEffect } from "react";
import * as echarts from "echarts";

export default function SpendingsChart({ item }) {
  const [x, setX] = useState([]);
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/spendingschart?item=${item}`);
      const { data } = await response.json();
      const xData = data.map((i) => i[item]);
      const seriesData = data.map((i) => i["total_amount"]);
      setX(xData);
      setSeries(seriesData);
      console.log(data);
    };
    fetchData();
  }, [item]);

  useEffect(() => {
    const chart = echarts.init(document.getElementById("mainChart" + item)); // 确保ID唯一
    chart.setOption({
      xAxis: {
        // type: "category",
        data: x,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: series,
          type: "line",
          label: {
            show: true,
            position: "top",
          },
        },
      ],
    });

    return () => {
      chart.dispose();
    };
  }, [series]);

  return (
    <div
      id={"mainChart" + item}
      style={{ width: "100%", height: "400px" }}
    ></div>
  );
}
