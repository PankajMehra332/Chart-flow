import { useState } from "react";
import { Modal, TextInput, Select, Button, Stack, Table, ActionIcon, Group } from '@mantine/core';
import { IconTrash, IconPlus } from '@tabler/icons-react';

export function ChartModal({ isOpen, onClose, onConfirm  }) {
  const [chartType, setChartType] = useState("bar");
  const [chartData, setChartData] = useState([
    { label: "Category 1", value: 10 },
    { label: "Category 2", value: 20 },
    { label: "Category 3", value: 15 },
    { label: "Category 4", value: 25 },
  ]);
  const [title, setTitle] = useState("Chart Title");

  const handleInsert = () => {
    onConfirm({
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

  const rows = chartData.map((item, index) => (
    <Table.Tr key={index}>
      <Table.Td>
        <TextInput
          value={item.label}
          onChange={(e) => updateDataPoint(index, "label", e.target.value)}
          variant="unstyled"
          size="sm"
        />
      </Table.Td>
      <Table.Td>
        <TextInput
          type="number"
          value={item.value}
          onChange={(e) => updateDataPoint(index, "value", parseFloat(e.target.value) || 0)}
          variant="unstyled"
          size="sm"
        />
      </Table.Td>
      <Table.Td>
        <ActionIcon
          color="red"
          variant="subtle"
          onClick={() => removeDataPoint(index)}
          size="sm"
        >
          <IconTrash size={16} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Modal opened={isOpen} onClose={onClose} title="Create Chart" centered size="lg">
      <Stack gap="md">
        <TextInput
          label="Chart Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Select
          label="Chart Type"
          value={chartType}
          onChange={setChartType}
          data={[
            { value: "bar", label: "Bar Chart" },
            { value: "line", label: "Line Chart" },
            { value: "pie", label: "Pie Chart" },
          ]}
          required
        />

        <div>
          <Group justify="space-between" mb="xs">
            <span className="text-sm font-medium">Chart Data:</span>
            <Button
              variant="outline"
              size="xs"
              leftSection={<IconPlus size={14} />}
              onClick={addDataPoint}
            >
              Add Data Point
            </Button>
          </Group>
          
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Label</Table.Th>
                <Table.Th>Value</Table.Th>
                <Table.Th style={{ width: 50 }}>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </div>

        <Group justify="flex-end" gap="sm">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleInsert}>
            Create Chart
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
