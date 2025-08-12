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
import { TableModal } from "./components/table/TableModal";
import { ChartModal } from "./components/chart/ChartModal";
import { useState } from "react";

export default function App() {
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [editorRef, setEditorRef] = useState(null);

  const handleAddTable = (editor) => {
    setEditorRef(editor);
    setIsTableModalOpen(true);
  };

  const handleTableConfirm = ({ rows, columns }) => {
    if (editorRef) {
      editorRef.createShape({
        id: `shape:table_${Date.now()}`,
        type: "table",
        x: 100,
        y: 100,
        props: {
          rows,
          columns,
          w: columns * 150,
          h: rows * 50,
        },
      });
    }
  };

  const handleAddChart = (editor) => {
    setEditorRef(editor);
    setIsChartModalOpen(true);
  };

  const handleChartConfirm = ({ type, title, data }) => {
    console.log(type, title, data, "checkthis");
    if (editorRef) {
      editorRef.createShape({
        id: `shape:chart_${Date.now()}`,
        type: "chart",
        x: 500,
        y: 200,
        props: {
          type: type,
          w: 400,
          h: 300,
          data,
          title,
        },
      });
    }
  };

  const uiOverrides = {
    tools(editor, tools) {
      tools["table-tool"] = {
        id: "table-tool",
        icon: "table-icon",
        label: "Table",
        kbd: "t",
        onSelect: () => handleAddTable(editor),
      };
      tools["chart-tool"] = {
        id: "chart-tool",
        icon: "chart-icon",
        label: "Chart",
        kbd: "c",
        onSelect: () => handleAddChart(editor),
      };
      return tools;
    },
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
      "chart-icon": "/chart.svg",
      "table-icon": "/table.svg",
    },
  };

  return (
    <div className="fixed inset-0">
      <Tldraw
        shapeUtils={[TableShapeUtil, ChartShapeUtil]}
        overrides={uiOverrides}
        components={components}
        assetUrls={customAssetUrls}
      />

      <TableModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        onConfirm={handleTableConfirm}
      />

      <ChartModal
        isOpen={isChartModalOpen}
        onClose={() => setIsChartModalOpen(false)}
        onConfirm={handleChartConfirm}
      />
    </div>
  );
}
