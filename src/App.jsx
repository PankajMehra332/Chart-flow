import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { useState, useCallback } from "react";
import { TableComponent } from "./components/table/TableComponent";
import { TableModal } from "./components/table/TableModal";
import { ChartModal } from "./components/chart/ChartModal";
import { ChartComponent } from "./components/chart/ChartComponent";
import { CustomToolbar } from "./components/toolbar/CustomToolbar";

export default function App() {
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [tables, setTables] = useState([]);
  const [charts, setCharts] = useState([]);

  const handleInsertTable = useCallback(
    ({ rows, columns }) => {
      const newTable = {
        id: Date.now(),
        rows,
        columns,
        x: 100 + tables.length * 50,
        y: 100 + tables.length * 50,
      };
      setTables((prev) => [...prev, newTable]);
    },
    [tables.length]
  );

  const handleInsertChart = useCallback(
    ({ type, data, title }) => {
      const newChart = {
        id: Date.now(),
        type,
        data,
        title,
        x: 100 + charts.length * 50,
        y: 100 + charts.length * 50,
      };
      setCharts((prev) => [...prev, newChart]);
    },
    [charts.length]
  );

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw />
      {tables.map((table) => (
        <TableComponent
          key={table.id}
          rows={table.rows}
          columns={table.columns}
          x={table.x}
          y={table.y}
        />
      ))}
      {charts.map((chart) => (
        <ChartComponent
          key={chart.id}
          type={chart.type}
          data={chart.data}
          title={chart.title}
          x={chart.x}
          y={chart.y}
        />
      ))}
      <CustomToolbar
        onInsertTable={() => setIsTableModalOpen(true)}
        onInsertChart={() => setIsChartModalOpen(true)}
      />
      <TableModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        onInsert={handleInsertTable}
      />
      <ChartModal
        isOpen={isChartModalOpen}
        onClose={() => setIsChartModalOpen(false)}
        onInsert={handleInsertChart}
      />
    </div>
  );
}
