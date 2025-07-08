import React, { useEffect, useRef } from 'react';
import {
	Table,
	TableHeaderRow,
	TableHeaderCell,
	TableRow,
	TableCell,
	TableVirtualizer,
	TableSelectionMulti,
	type TableVirtualizerDomRef
} from '@ui5/webcomponents-react';
import type { Employee } from '../context/EmployeeDataContext';

interface EmployeeTableProps {
	data: Employee[];
	filteredLength: number;
	rowHeight: number;
	tableHeight: number;
	onRangeChange: (e: Event) => void;
	search: string;
	selectedIds: string[];
	onSelectionChange: (e: Event) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ data, filteredLength, rowHeight, tableHeight, onRangeChange, search, onSelectionChange }) => {
	const virtualizerRef = useRef<TableVirtualizerDomRef>(null);

	useEffect(() => {
		virtualizerRef.current?.reset();
		console.log("reset");
	}, [search])

	return (
		<Table
			className="table-scrollbar"
			style={{ height: `${tableHeight}px`, width: '100%' }}
			headerRow={
				<TableHeaderRow sticky>
					<TableHeaderCell width="48px" minWidth="48px">#</TableHeaderCell>
					<TableHeaderCell minWidth="200px">Name</TableHeaderCell>
					<TableHeaderCell minWidth="150px">Department</TableHeaderCell>
					<TableHeaderCell minWidth="90px">Title</TableHeaderCell>
					<TableHeaderCell minWidth="300px">Email</TableHeaderCell>
				</TableHeaderRow>
			}
			features={
				<>
					<TableVirtualizer
						ref={virtualizerRef}
						rowCount={filteredLength}
						rowHeight={rowHeight}
						onRangeChange={onRangeChange}
					/>
					<TableSelectionMulti onChange={onSelectionChange} />
				</>
			}
			noDataText="No employees found."
		>
			{data.map((emp) => (
				<TableRow key={emp.id} rowKey={emp.id.toString()} position={emp.position}>
					<TableCell>{emp.id}</TableCell>
					<TableCell>{emp.name}</TableCell>
					<TableCell>{emp.department}</TableCell>
					<TableCell>{emp.title}</TableCell>
					<TableCell>{emp.email}</TableCell>
				</TableRow>
			))}
		</Table>
	);
};

export default EmployeeTable;
