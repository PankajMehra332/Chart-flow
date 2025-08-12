import { useState } from "react";
import { Modal, NumberInput, Button, Stack } from "@mantine/core";

export function TableModal({ isOpen, onClose, onConfirm }) {
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);

  const handleInsert = () => {
    onConfirm({ rows, columns });
    onClose();
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Insert Table" centered>
      <Stack gap="md">
        <NumberInput
          label="Rows"
          value={rows}
          onChange={setRows}
          min={1}
          max={10}
          required
        />

        <NumberInput
          label="Columns"
          value={columns}
          onChange={setColumns}
          min={1}
          max={10}
          required
        />

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleInsert}>Insert Table</Button>
        </div>
      </Stack>
    </Modal>
  );
}
