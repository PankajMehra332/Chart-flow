import { useState } from "react";

export function TableModal({ isOpen, onClose, onInsert }) {
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);

  const handleInsert = () => {
    onInsert({ rows, columns });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "8px",
          minWidth: "300px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: "0 0 16px 0", fontSize: "18px" }}>Insert Table</h3>

        <div style={{ marginBottom: "16px" }}>
          <label
            style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
          >
            Rows:
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={rows}
            onChange={(e) => setRows(parseInt(e.target.value) || 1)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label
            style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
          >
            Columns:
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={columns}
            onChange={(e) => setColumns(parseInt(e.target.value) || 1)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </div>

        <div
          style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: "white",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              backgroundColor: "#007bff",
              color: "white",
              cursor: "pointer",
            }}
          >
            Insert Table
          </button>
        </div>
      </div>
    </div>
  );
}
