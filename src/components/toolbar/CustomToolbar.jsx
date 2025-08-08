import { Button, Group } from '@mantine/core';

export function CustomToolbar({ onInsertTable, onInsertChart }) {
  return (
    <div className="absolute top-1 left-[300px] z-[100] bg-white border border-gray-300 rounded-lg p-1 shadow-lg flex gap-1">
      <Group gap="xs">
        <Button
          onClick={onInsertTable}
          color="blue"
          size="sm"
          leftSection="📊"
        >
          Insert Table
        </Button>
        <Button
          onClick={onInsertChart}
          color="green"
          size="sm"
          leftSection="📈"
        >
          Insert Chart
        </Button>
      </Group>
    </div>
  );
}
