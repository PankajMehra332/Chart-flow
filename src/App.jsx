import {
  DefaultToolbar,
  DefaultToolbarContent,
  Tldraw,
  TldrawUiMenuItem,
  useIsToolSelected,
  useTools,
} from "tldraw";
import "tldraw/tldraw.css";
import { TableShapeUtil } from "./shapes/TableShape";
import { ChartShapeUtil } from "./shapes/ChartShape";


const uiOverrides = {
  tools(editor, tools) {
    tools["table-tool"] = {
      id: "table-tool",
      icon: "custom-icon",
      label: "Table",
      kbd: "t",
      onSelect: () => handleAddTable(editor),
    };
    tools["chart-tool"] = {
      id: "chart-tool",
      icon: "custom-icon",
      label: "Chart",
      kbd: "c",
      onSelect: () => handleAddChart(editor),
    };
    return tools;
  },
};

  const handleAddTable = (editor) => {
    console.log(editor, 'editor');
    const rows = parseInt(prompt("Number of rows?", "3"), 10) || 3;
    const columns = parseInt(prompt("Number of columns?", "3"), 10) || 3;
    editor.createShape({
      id: `shape:table_${Date.now()}`,
      type: "table",
      x: 100,
      y: 100,
      props: {
        rows,
        columns,
        cellWidth: 150,
        cellHeight: 50,
      },
    });
  };

  const handleAddChart = (editor) => {
    console.log(editor, 'editor');
    const chartType = prompt("Chart type? (bar/line/pie)", "bar") || "bar";
    editor.createShape({
      id: `shape:chart_${Date.now()}`,
      type: "chart",
      x: 500,
      y: 200,
      props: {
        type: chartType,
        w: 400,
        h: 300,
        data: [
          { label: "A", value: 10 },
          { label: "B", value: 20 },
          { label: "C", value: 15 },
        ],
        title: "Sample Chart",
      },
    });
  };

const components = {
  Toolbar: (props) => {
    const tools = useTools();
    const isTableSelected = useIsToolSelected(tools["table-tool"]);
    const isChartSelected = useIsToolSelected(tools["chart-tool"]);
    return (
      <DefaultToolbar {...props}>
        <TldrawUiMenuItem
          {...tools["table-tool"]}
          isSelected={isTableSelected}
        />
        <TldrawUiMenuItem
          {...tools["chart-tool"]}
          isSelected={isChartSelected}
        />
        <DefaultToolbarContent />
      </DefaultToolbar>
    );
  },
};

const customAssetUrls = {
  icons: {
    "custom-icon": "/vite.svg",
  },
};

export default function App() {
  return (
    <div className="fixed inset-0">
      <Tldraw
        shapeUtils={[TableShapeUtil, ChartShapeUtil]}
        overrides={uiOverrides}
        components={components}
        assetUrls={customAssetUrls}
      />
    </div>
  );
}
