import React from 'react';
import { Dialog, Input, Button } from '@ui5/webcomponents-react';
import type { InputDomRef } from '@ui5/webcomponents-react';

interface SalaryDialogProps {
  open: boolean;
  adjustType: 'percent' | 'amount';
  adjustValue: string;
  adjustDirection: 'increase' | 'decrease';
  onTypeChange: (val: 'percent' | 'amount') => void;
  onDirectionChange: (val: 'increase' | 'decrease') => void;
  onValueChange: (val: string) => void;
  onClose: () => void;
  onApply: () => void;
}

const SalaryDialog: React.FC<SalaryDialogProps> = ({
  open, adjustType, adjustValue, adjustDirection, onTypeChange, onDirectionChange, onValueChange, onClose, onApply
}) => (
  <Dialog open={open} headerText="Adjust Salary" onClose={onClose}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 12 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <label>Type:</label>
        <select value={adjustType} onChange={e => onTypeChange(e.target.value as 'percent' | 'amount')}>
          <option value="percent">Percent (%)</option>
          <option value="amount">Amount (€)</option>
        </select>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <label>Direction:</label>
        <select value={adjustDirection} onChange={e => onDirectionChange(e.target.value as 'increase' | 'decrease')}>
          <option value="increase">Increase</option>
          <option value="decrease">Decrease</option>
        </select>
      </div>
      <Input
        placeholder={adjustType === 'percent' ? 'Percent (e.g. 5)' : 'Amount (e.g. 1000)'}
        value={adjustValue}
        onInput={e => onValueChange((e.target as InputDomRef).value)}
        type="Number"
      />
    </div>
    <div slot="footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
      <Button onClick={onClose}>Cancel</Button>
      <Button design="Emphasized" onClick={onApply} disabled={!adjustValue.trim() || isNaN(Number(adjustValue)) || Number(adjustValue) <= 0}>
        Apply
      </Button>
    </div>
  </Dialog>
);

export default SalaryDialog;
