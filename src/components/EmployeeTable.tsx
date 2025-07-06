import React from 'react';
import {
  Table,
  TableHeaderRow,
  TableHeaderCell,
  TableRow,
  TableCell,
  TableVirtualizer
} from '@ui5/webcomponents-react';

interface EmployeeTableProps {
  data: any[];
  filteredLength: number;
  rowHeight: number;
  tableHeight: number;
  onRangeChange: (e: any) => void;
  search: string;
  virtualizerRef: React.Ref<any>;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ data, filteredLength, rowHeight, tableHeight, onRangeChange, search, virtualizerRef }) => (
  <Table
    className="table-scrollbar"
    style={{ height: `${tableHeight}px`, width: '100%' }}
    headerRow={
      <TableHeaderRow sticky>
        <TableHeaderCell width="48px" minWidth="48px">#</TableHeaderCell>
        <TableHeaderCell minWidth="100px">Name</TableHeaderCell>
        <TableHeaderCell minWidth="100px">Department</TableHeaderCell>
        <TableHeaderCell minWidth="90px">Title</TableHeaderCell>
        <TableHeaderCell minWidth="100px">Email</TableHeaderCell>
      </TableHeaderRow>
    }
    features={
      <TableVirtualizer
        key={search}
        ref={virtualizerRef}
        rowCount={filteredLength}
        rowHeight={rowHeight}
        onRangeChange={onRangeChange}
      />
    }
    noDataText="No employees found."
  >
    {data.map((emp) => (
      <TableRow key={emp.position} position={emp.position}>
        <TableCell>{emp.id}</TableCell>
        <TableCell>{emp.name}</TableCell>
        <TableCell>{emp.department}</TableCell>
        <TableCell>{emp.title}</TableCell>
        <TableCell>{emp.email}</TableCell>
      </TableRow>
    ))}
  </Table>
);

export default EmployeeTable;
