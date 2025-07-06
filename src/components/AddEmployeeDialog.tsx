import React from 'react';
import { Dialog, Input, Button } from '@ui5/webcomponents-react';
import type { InputDomRef } from '@ui5/webcomponents-react';

interface AddEmployeeDialogProps {
  open: boolean;
  name: string;
  title: string;
  onNameChange: (val: string) => void;
  onTitleChange: (val: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const AddEmployeeDialog: React.FC<AddEmployeeDialogProps> = ({ open, name, title, onNameChange, onTitleChange, onClose, onSubmit }) => (
  <Dialog open={open} headerText="Add Employee" onClose={onClose}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 12 }}>
      <Input
        placeholder="Name"
        value={name}
        onInput={e => onNameChange((e.target as InputDomRef).value)}
      />
      <Input
        placeholder="Title"
        value={title}
        onInput={e => onTitleChange((e.target as InputDomRef).value)}
      />
    </div>
    <div slot="footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
      <Button onClick={onClose}>Cancel</Button>
      <Button design="Emphasized" onClick={onSubmit} disabled={!name.trim() || !title.trim()}>
        Add
      </Button>
    </div>
  </Dialog>
);

export default AddEmployeeDialog;
