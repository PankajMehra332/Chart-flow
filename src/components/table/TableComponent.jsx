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
      className={isResizing ? "table-resizing" : ""}
      style={{
        position: "absolute",
        left: tablePosition.x,
        top: tablePosition.y,
        border: "2px solid #333",
        backgroundColor: "white",
        borderRadius: "4px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        width: tableWidth,
        height: tableHeight,
        cursor: isDragging ? "grabbing" : isResizing ? "default" : "grab",
      }}
      onMouseDown={handleTableDragStart}
    >
      {Array.from({ length: columns - 1 }, (_, col) => (
        <div
          key={`col-resize-${col}`}
          className="resize-handle column-resize"
          style={{
            position: "absolute",
            top: 0,
            left:
              columnWidths
                .slice(0, col + 1)
                .reduce((sum, width) => sum + width, 0) - 2,
            width: "4px",
            height: "100%",
            backgroundColor: "transparent",
            cursor: "col-resize",
            zIndex: 10,
          }}
          onMouseDown={(e) => handleColumnResizeStart(e, col + 1)}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "2px",
              height: "20px",
              backgroundColor: "#007bff",
              borderRadius: "1px",
            }}
          />
        </div>
      ))}

      {Array.from({ length: rows - 1 }, (_, row) => (
        <div
          key={`row-resize-${row}`}
          className="resize-handle row-resize"
          style={{
            position: "absolute",
            top:
              rowHeights
                .slice(0, row + 1)
                .reduce((sum, height) => sum + height, 0) - 2,
            left: 0,
            width: "100%",
            height: "4px",
            backgroundColor: "transparent",
            cursor: "row-resize",
            zIndex: 10,
          }}
          onMouseDown={(e) => handleRowResizeStart(e, row + 1)}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "20px",
              height: "2px",
              backgroundColor: "#007bff",
              borderRadius: "1px",
            }}
          />
        </div>
      ))}

      <div
        className="resize-handle table-resize"
        style={{
          position: "absolute",
          bottom: "-6px",
          right: "-6px",
          width: "12px",
          height: "12px",
          backgroundColor: "#007bff",
          borderRadius: "2px",
          cursor: "nw-resize",
          zIndex: 10,
        }}
        onMouseDown={handleTableResizeStart}
      />

      {Array.from({ length: rows }, (_, row) => (
        <div key={row} style={{ display: "flex" }}>
          {Array.from({ length: columns }, (_, col) => {
            const cellKey = `${row}-${col}`;
            const isEditing = editingCell === cellKey;
            const isHeader = row === 0;

            return (
              <div
                key={col}
                style={{
                  width: columnWidths[col],
                  height: rowHeights[row],
                  border: "1px solid #ddd",
                  borderTop: row === 0 ? "none" : "1px solid #ddd",
                  borderLeft: col === 0 ? "none" : "1px solid #ddd",
                  backgroundColor: isHeader ? "#f8f9fa" : "white",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 8px",
                }}
                onClick={() => handleCellClick(row, col)}
              >
                {isEditing ? (
                  <input
                    type="text"
                    className="cell-input"
                    value={cellData[cellKey] || ""}
                    onChange={(e) => handleCellChange(row, col, e.target.value)}
                    onBlur={handleCellBlur}
                    onKeyDown={(e) => handleKeyDown(e, row, col)}
                    style={{
                      width: "100%",
                      border: "none",
                      outline: "none",
                      backgroundColor: "transparent",
                      fontSize: "14px",
                      fontWeight: isHeader ? "bold" : "normal",
                    }}
                    autoFocus
                  />
                ) : (
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: isHeader ? "bold" : "normal",
                      color: cellData[cellKey] ? "#333" : "#999",
                      cursor: "text",
                      width: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
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
