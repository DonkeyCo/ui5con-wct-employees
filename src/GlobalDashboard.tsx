import React, { useState, useRef } from 'react';
import { Input } from '@ui5/webcomponents-react';
import '@ui5/webcomponents/dist/Assets.js';
import '@ui5/webcomponents-fiori/dist/Assets.js';
import '@ui5/webcomponents-react/dist/Assets.js';
import EmployeeTable from './components/EmployeeTable';
import { useEmployeeData } from './context/EmployeeDataContext';

const ROW_HEIGHT = 45;
const VISIBLE_ROWS = 10;
const TABLE_HEIGHT = ROW_HEIGHT * VISIBLE_ROWS;

const GlobalDashboard: React.FC = () => {
	const { employees } = useEmployeeData();
	const [search, setSearch] = useState('');
	const [virtualizerKey, setVirtualizerKey] = useState('');
	const [data, setData] = useState(() => employees.slice(0, VISIBLE_ROWS + 2));
	const virtualizerRef = useRef<any>(null);

	// Filtered data (name only)
	const filtered = React.useMemo(() => 
		employees
			.filter(e => e.name.toLowerCase().includes(search.toLowerCase()))
			.map((item, index) => ({ ...item, position: index })),
		[search, employees]
	);

	React.useEffect(() => {
		// Reset virtualizer when search changes
		setVirtualizerKey(search + '-' + filtered.length);
	}, [search, filtered.length]);

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
				key={virtualizerKey}
			/>
		</div>
	);
};

export default GlobalDashboard;
