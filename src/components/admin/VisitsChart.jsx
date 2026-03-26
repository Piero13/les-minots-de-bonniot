import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Spinner } from "react-bootstrap";
import { getVisitsLast7Days } from "../../services/analyticsService";

const getLast7Days = () => {
  const days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);

    days.push({
      date: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("fr-FR", { weekday: "short" }),
    });
  }

  return days;
};

const VisitsChart = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const apiData = await getVisitsLast7Days();

        const last7Days = getLast7Days();

        const merged = last7Days.map((day) => {
          const found = apiData.find((d) => d.day === day.date);

          return {
            name: day.label.charAt(0).toUpperCase() + day.label.slice(1),
            visits: found ? found.count : 0,
          };
        });

        setData(merged);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  if (!data) return <Spinner />;

  return (
    <div className="p-3 border rounded shadow-sm bg-white border-primary">
      <h5 className="text-center mb-4">Visites des 7 derniers jours</h5>

      <ResponsiveContainer className="h-16 w-100">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />

          <Tooltip
            formatter={(value) => [`${value} visites`, "Trafic"]}
            labelFormatter={(label) => `Jour : ${label}`}
          />

          <Bar
            fill="#3FA26A"
            dataKey="visits"
            radius={[6, 6, 0, 0]} // coins arrondis
            animationDuration={500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VisitsChart;