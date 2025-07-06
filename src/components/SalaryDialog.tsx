import React from 'react';
import { Dialog, Input, Button, Select, Option } from '@ui5/webcomponents-react';
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
        <label htmlFor="salary-type">Type:</label>
        <Select id="salary-type" value={adjustType} onChange={e => onTypeChange(e.target.value as 'percent' | 'amount')} style={{ minWidth: 120 }}>
          <Option selected={adjustType === 'percent'} value="percent">Percent (%)</Option>
          <Option selected={adjustType === 'amount'} value="amount">Amount (€)</Option>
        </Select>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <label htmlFor="salary-direction">Direction:</label>
        <Select id="salary-direction" value={adjustDirection} onChange={e => onDirectionChange(e.target.value as 'increase' | 'decrease')} style={{ minWidth: 120 }}>
          <Option selected={adjustDirection === 'increase'} value="increase">Increase</Option>
          <Option selected={adjustDirection === 'decrease'} value="decrease">Decrease</Option>
        </Select>
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
