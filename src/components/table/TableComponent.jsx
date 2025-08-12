import { useState } from "react";

export function TableComponent({
  rows,
  columns,
  cellWidth = 150,
  cellHeight = 40,
  width,
  height,
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
  const actualCellWidth = width ? width / columns : cellWidth;
  const actualCellHeight = height ? height / rows : cellHeight;

  const handleCellChange = (row, col, value) => {
    setCellData((prev) => ({
      ...prev,
      [`${row}-${col}`]: value,
    }));
  };

  const handleCellClick = (row, col, e) => {
    e.stopPropagation();
    setEditingCell(`${row}-${col}`);
  };

  const handleCellBlur = () => {
    setEditingCell(null);
  };

  const handleKeyDown = (e, row, col) => {
    e.stopPropagation();

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

  return (
    <div
      className="bg-white border border-gray-300 rounded overflow-hidden"
      style={{
        width: width || columns * cellWidth,
        height: height || rows * cellHeight,
      }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className="flex">
          {Array.from({ length: columns }, (_, col) => {
            const cellKey = `${row}-${col}`;
            const isEditing = editingCell === cellKey;
            const isHeader = row === 0;

            return (
              <div
                key={col}
                className={`border-r border-b border-gray-300 flex items-center px-2 ${
                  isHeader ? "bg-gray-50 font-semibold" : "bg-white"
                } ${col === columns - 1 ? "border-r-0" : ""} ${
                  row === rows - 1 ? "border-b-0" : ""
                }`}
                style={{
                  width: actualCellWidth,
                  height: actualCellHeight,
                  minWidth: 50,
                  minHeight: 30,
                }}
                onClick={(e) => handleCellClick(row, col, e)}
                onPointerDown={(e) => e.stopPropagation()}
              >
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full border-none outline-none bg-transparent text-sm"
                    style={{
                      fontWeight: isHeader ? "600" : "normal",
                    }}
                    value={cellData[cellKey] || ""}
                    onChange={(e) => handleCellChange(row, col, e.target.value)}
                    onBlur={handleCellBlur}
                    onKeyDown={(e) => handleKeyDown(e, row, col)}
                    onPointerDown={(e) => e.stopPropagation()}
                    autoFocus
                  />
                ) : (
                  <span
                    className={`text-sm cursor-text w-full overflow-hidden text-ellipsis whitespace-nowrap ${
                      cellData[cellKey] ? "text-gray-800" : "text-gray-400"
                    }`}
                    style={{
                      fontWeight: isHeader ? "600" : "normal",
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
