export function CustomToolbar({ onInsertTable, onInsertChart }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "1px",
        left: "300px",
        zIndex: 100,
        backgroundColor: "white",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "2px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        display: "flex",
        gap: "4px",
      }}
    >
      <button
        onClick={onInsertTable}
        style={{
          padding: "8px 12px",
          border: "none",
          borderRadius: "4px",
          backgroundColor: "#007bff",
          color: "white",
          cursor: "pointer",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        📊 Insert Table
      </button>
      <button
        onClick={onInsertChart}
        style={{
          padding: "8px 12px",
          border: "none",
          borderRadius: "4px",
          backgroundColor: "#28a745",
          color: "white",
          cursor: "pointer",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        📈 Insert Chart
      </button>
    </div>
  );
}
