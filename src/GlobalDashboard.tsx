import React, { useState, useRef } from 'react';
import { Input } from '@ui5/webcomponents-react';
import '@ui5/webcomponents/dist/Assets.js';
import '@ui5/webcomponents-fiori/dist/Assets.js';
import '@ui5/webcomponents-react/dist/Assets.js';
import EmployeeTable from './components/EmployeeTable';

// Mock employee data
type Employee = {
	id: number;
	name: string;
	department: string;
	title: string;
	email: string;
	salary: number;
};

const EMPLOYEES: Employee[] = Array.from({ length: 1000 }, (_, i) => ({
	id: i + 1,
	name: `Employee ${i + 1}`,
	department: ['HR', 'IT', 'Finance', 'Sales'][i % 4],
	title: ['Developer', 'Manager', 'Analyst', 'Consultant'][i % 4],
	email: `employee${i + 1}@company.com`,
	salary: 50000 + (i % 10) * 2500
}));

const EMPLOYEES_WITH_POSITION = EMPLOYEES.map((item, index) => ({ ...item, position: index }));

const ROW_HEIGHT = 45;
const VISIBLE_ROWS = 10;
const TABLE_HEIGHT = ROW_HEIGHT * VISIBLE_ROWS;

const GlobalDashboard: React.FC = () => {
	const [search, setSearch] = useState('');
	const [data, setData] = useState(() => EMPLOYEES_WITH_POSITION.slice(0, VISIBLE_ROWS + 2));
	const virtualizerRef = useRef<any>(null);

	// Filtered data (name only)
	const filtered = React.useMemo(() => 
		EMPLOYEES_WITH_POSITION
			.filter(e => e.name.toLowerCase().includes(search.toLowerCase()))
			.map((item, index) => ({ ...item, position: index })),
		[search]
	);

	const handleRangeChange: React.ComponentProps<typeof EmployeeTable>["onRangeChange"] = (e) => {
		const { first, last } = e.detail;
		const overscanStart = Math.max(first, 0);
		const overscanEnd = Math.min(last, filtered.length);
		setData(filtered.slice(overscanStart, overscanEnd));
	};

	return (
		<div>
			<div>
				<Input
					placeholder="Filter by name..."
					value={search}
					onInput={e => setSearch((e.target as import('@ui5/webcomponents-react').InputDomRef).value)}
					style={{ width: 240 }}
				/>
			</div>
			<EmployeeTable
				data={data}
				filteredLength={filtered.length}
				rowHeight={ROW_HEIGHT}
				tableHeight={TABLE_HEIGHT}
				onRangeChange={handleRangeChange}
				search={search}
				virtualizerRef={virtualizerRef}
			/>
		</div>
	);
};

export default GlobalDashboard;
