import { useState } from "react";

export function ChartModal({ isOpen, onClose, onInsert }) {
  const [chartType, setChartType] = useState("bar");
  const [chartData, setChartData] = useState([
    { label: "Category 1", value: 10 },
    { label: "Category 2", value: 20 },
    { label: "Category 3", value: 15 },
    { label: "Category 4", value: 25 },
  ]);
  const [title, setTitle] = useState("Chart Title");

  const handleInsert = () => {
    onInsert({
      type: chartType,
      data: chartData,
      title,
    });
    onClose();
  };

  const addDataPoint = () => {
    setChartData((prev) => [
      ...prev,
      { label: `Category ${prev.length + 1}`, value: 0 },
    ]);
  };

  const updateDataPoint = (index, field, value) => {
    setChartData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const removeDataPoint = (index) => {
    setChartData((prev) => prev.filter((_, i) => i !== index));
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
          minWidth: "500px",
          maxWidth: "600px",
          maxHeight: "80vh",
          overflow: "auto",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: "0 0 16px 0", fontSize: "18px" }}>Create Chart</h3>

        <div style={{ marginBottom: "16px" }}>
          <label
            style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
          >
            Chart Title:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label
            style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
          >
            Chart Type:
          </label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label
            style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
          >
            Chart Data:
          </label>
          <div
            style={{
              maxHeight: "300px",
              overflow: "auto",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <th
                    style={{
                      padding: "8px",
                      border: "1px solid #ddd",
                      textAlign: "left",
                    }}
                  >
                    Label
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      border: "1px solid #ddd",
                      textAlign: "left",
                    }}
                  >
                    Value
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((item, index) => (
                  <tr key={index}>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) =>
                          updateDataPoint(index, "label", e.target.value)
                        }
                        style={{
                          width: "100%",
                          padding: "4px",
                          border: "none",
                          outline: "none",
                        }}
                      />
                    </td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                      <input
                        type="number"
                        value={item.value}
                        onChange={(e) =>
                          updateDataPoint(
                            index,
                            "value",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        style={{
                          width: "100%",
                          padding: "4px",
                          border: "none",
                          outline: "none",
                        }}
                      />
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        border: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      <button
                        onClick={() => removeDataPoint(index)}
                        style={{
                          padding: "2px 6px",
                          border: "none",
                          backgroundColor: "#dc3545",
                          color: "white",
                          borderRadius: "3px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={addDataPoint}
            style={{
              marginTop: "8px",
              padding: "6px 12px",
              border: "1px solid #007bff",
              backgroundColor: "white",
              color: "#007bff",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            + Add Data Point
          </button>
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
            Create Chart
          </button>
        </div>
      </div>
    </div>
  );
}
