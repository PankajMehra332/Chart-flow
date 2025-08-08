import { useEffect, useRef, useState } from "react";

export function TableComponent({
  rows,
  columns,
  x,
  y,
  cellWidth = 150,
  cellHeight = 40,
}) {
  const [cellData, setCellData] = useState(() => {
    const data = {};
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        data[`${r}-${c}`] = "";
      }
    }
    return data;
  });

  const [editingCell, setEditingCell] = useState(null);
  const [columnWidths, setColumnWidths] = useState(() =>
    Array(columns).fill(cellWidth)
  );
  const [rowHeights, setRowHeights] = useState(() =>
    Array(rows).fill(cellHeight)
  );
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState(null);
  const [resizeIndex, setResizeIndex] = useState(null);
  const [tableWidth, setTableWidth] = useState(columns * cellWidth);
  const [tableHeight, setTableHeight] = useState(rows * cellHeight);
  const [tablePosition, setTablePosition] = useState({ x, y });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const tableRef = useRef(null);

  const handleCellChange = (row, col, value) => {
    setCellData((prev) => ({
      ...prev,
      [`${row}-${col}`]: value,
    }));
  };

  const handleCellClick = (row, col) => {
    setEditingCell(`${row}-${col}`);
  };

  const handleCellBlur = () => {
    setEditingCell(null);
  };

  const handleKeyDown = (e, row, col) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setEditingCell(null);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const nextCol = col + 1;
      const nextRow = nextCol >= columns ? row + 1 : row;
      const newCol = nextCol >= columns ? 0 : nextCol;

      if (nextRow < rows) {
        setEditingCell(`${nextRow}-${newCol}`);
      } else {
        setEditingCell(null);
      }
    }
  };

  const handleColumnResizeStart = (e, colIndex) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeType("column");
    setResizeIndex(colIndex);
  };

  const handleColumnResize = (e) => {
    if (!isResizing || resizeType !== "column") return;

    const rect = tableRef.current.getBoundingClientRect();
    const leftOffset = columnWidths
      .slice(0, resizeIndex)
      .reduce((sum, width) => sum + width, 0);
    const newWidth = e.clientX - rect.left - leftOffset;

    if (newWidth > 50) {
      setColumnWidths((prev) => {
        const newWidths = [...prev];
        newWidths[resizeIndex] = newWidth;
        return newWidths;
      });
      const newWidths = [...columnWidths];
      newWidths[resizeIndex] = newWidth;
      const totalWidth = newWidths.reduce((sum, width) => sum + width, 0);
      setTableWidth(totalWidth);
    }
  };

  const handleRowResizeStart = (e, rowIndex) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeType("row");
    setResizeIndex(rowIndex);
  };

  const handleRowResize = (e) => {
    if (!isResizing || resizeType !== "row") return;

    const rect = tableRef.current.getBoundingClientRect();
    const topOffset = rowHeights
      .slice(0, resizeIndex)
      .reduce((sum, height) => sum + height, 0);
    const newHeight = e.clientY - rect.top - topOffset;

    if (newHeight > 30) {
      setRowHeights((prev) => {
        const newHeights = [...prev];
        newHeights[resizeIndex] = newHeight;
        return newHeights;
      });
      const newHeights = [...rowHeights];
      newHeights[resizeIndex] = newHeight;
      const totalHeight = newHeights.reduce((sum, height) => sum + height, 0);
      setTableHeight(totalHeight);
    }
  };

  const handleTableResizeStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeType("table");
    setDragOffset({
      x: e.clientX - tablePosition.x,
      y: e.clientY - tablePosition.y,
    });
  };

  const handleTableResize = (e) => {
    if (!isResizing || resizeType !== "table") return;
    const newWidth = e.clientX - tablePosition.x;
    const newHeight = e.clientY - tablePosition.y;
    if (newWidth > 200 && newHeight > 100) {
      setTableWidth(newWidth);
      setTableHeight(newHeight);
      const avgColumnWidth = newWidth / columns;
      setColumnWidths(Array(columns).fill(avgColumnWidth));
      const avgRowHeight = newHeight / rows;
      setRowHeights(Array(rows).fill(avgRowHeight));
    }
  };

  const handleTableDragStart = (e) => {
    if (e.target.closest(".resize-handle") || e.target.closest(".cell-input"))
      return;

    e.preventDefault();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - tablePosition.x,
      y: e.clientY - tablePosition.y,
    });
  };

  const handleTableDrag = (e) => {
    if (!isDragging) return;

    setTablePosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    });
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    setIsDragging(false);
    setResizeType(null);
    setResizeIndex(null);
  };

  useEffect(() => {
    if (isResizing || isDragging) {
      const handleMouseMove = (e) => {
        if (resizeType === "column") {
          handleColumnResize(e);
        } else if (resizeType === "row") {
          handleRowResize(e);
        } else if (resizeType === "table") {
          handleTableResize(e);
        } else if (isDragging) {
          handleTableDrag(e);
        }
      };

      const handleMouseUpGlobal = () => {
        handleMouseUp();
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUpGlobal);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUpGlobal);
      };
    }
  }, [isResizing, isDragging, resizeType, resizeIndex, dragOffset]);

  return (
    <div
      ref={tableRef}
      className={`absolute border-2 border-gray-700 bg-white rounded overflow-hidden shadow-lg ${
        isResizing ? "table-resizing" : ""
      } ${isDragging ? "cursor-grabbing" : isResizing ? "cursor-default" : "cursor-grab"}`}
      style={{
        left: tablePosition.x,
        top: tablePosition.y,
        width: tableWidth,
        height: tableHeight,
      }}
      onMouseDown={handleTableDragStart}
    >
      {Array.from({ length: columns - 1 }, (_, col) => (
        <div
          key={`col-resize-${col}`}
          className="resize-handle column-resize absolute top-0 w-1 h-full bg-transparent cursor-col-resize z-10"
          style={{
            left:
              columnWidths
                .slice(0, col + 1)
                .reduce((sum, width) => sum + width, 0) - 2,
          }}
          onMouseDown={(e) => handleColumnResizeStart(e, col + 1)}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-500 rounded" />
        </div>
      ))}

      {Array.from({ length: rows - 1 }, (_, row) => (
        <div
          key={`row-resize-${row}`}
          className="resize-handle row-resize absolute left-0 w-full h-1 bg-transparent cursor-row-resize z-10"
          style={{
            top:
              rowHeights
                .slice(0, row + 1)
                .reduce((sum, height) => sum + height, 0) - 2,
          }}
          onMouseDown={(e) => handleRowResizeStart(e, row + 1)}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-0.5 bg-blue-500 rounded" />
        </div>
      ))}

      <div
        className="resize-handle table-resize absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-blue-500 rounded cursor-nw-resize z-10"
        onMouseDown={handleTableResizeStart}
      />

      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className="flex">
          {Array.from({ length: columns }, (_, col) => {
            const cellKey = `${row}-${col}`;
            const isEditing = editingCell === cellKey;
            const isHeader = row === 0;

            return (
              <div
                key={col}
                className={`border border-gray-300 flex items-center px-2 ${
                  isHeader ? "bg-gray-50" : "bg-white"
                } ${row === 0 ? "border-t-0" : ""} ${col === 0 ? "border-l-0" : ""}`}
                style={{
                  width: columnWidths[col],
                  height: rowHeights[row],
                }}
                onClick={() => handleCellClick(row, col)}
              >
                {isEditing ? (
                  <input
                    type="text"
                    className="cell-input w-full border-none outline-none bg-transparent text-sm"
                    style={{
                      fontWeight: isHeader ? "bold" : "normal",
                    }}
                    value={cellData[cellKey] || ""}
                    onChange={(e) => handleCellChange(row, col, e.target.value)}
                    onBlur={handleCellBlur}
                    onKeyDown={(e) => handleKeyDown(e, row, col)}
                    autoFocus
                  />
                ) : (
                  <span
                    className={`text-sm cursor-text w-full overflow-hidden text-ellipsis whitespace-nowrap ${
                      cellData[cellKey] ? "text-gray-800" : "text-gray-500"
                    }`}
                    style={{
                      fontWeight: isHeader ? "bold" : "normal",
                    }}
                  >
                    {cellData[cellKey] ||
                      (isHeader ? `Header ${col + 1}` : "Click to edit")}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
