import React, { useState } from 'react';
import { Input, Toast } from '@ui5/webcomponents-react';
import '@ui5/webcomponents/dist/Assets.js';
import '@ui5/webcomponents-fiori/dist/Assets.js';
import '@ui5/webcomponents-react/dist/Assets.js';
import EmployeeTable from './components/EmployeeTable';
import { useEmployeeData } from './context/EmployeeDataContext';
import type TableSelectionMulti from '@ui5/webcomponents/dist/TableSelectionMulti.js';

const ROW_HEIGHT = 45;
const VISIBLE_ROWS = 10;
const TABLE_HEIGHT = ROW_HEIGHT * VISIBLE_ROWS;

const GlobalDashboard: React.FC = () => {
	const { employees } = useEmployeeData();
	const [search, setSearch] = useState('');
	const [data, setData] = useState(() => employees.slice(0, VISIBLE_ROWS + 2));
	const [selectedIds, setSelectedIds] = useState<(string)[]>([]);  
	const [showToast, setShowToast] = useState(false);

	// Filtered data (name only)
	const filtered = React.useMemo(() => 
		employees
			.filter(e => e.name.toLowerCase().includes(search.toLowerCase()))
			.map((item, index) => ({ ...item, position: index })),
		[search, employees]
	);

	const handleRangeChange: React.ComponentProps<typeof EmployeeTable>["onRangeChange"] = (e) => {
		const { first, last } = (e as CustomEvent).detail;
		const overscanStart = Math.max(first, 0);
		const overscanEnd = Math.min(last, filtered.length);
		setData(filtered.slice(overscanStart, overscanEnd));
	};

	const handleSelectionChange = (e: Event) => {
		const selected = Array.from((e.target as TableSelectionMulti).getSelectedAsSet() || []) as string[];
		setSelectedIds(selected);
	};

	const handleCopySelected = async () => {
		const selectedEmployees = filtered.filter(emp => selectedIds.includes(emp.id.toString()));
		if (selectedEmployees.length === 0) return;
		const text = selectedEmployees.map(emp => `${emp.id},${emp.name},${emp.department},${emp.title},${emp.email}`).join('\n');
		await navigator.clipboard.writeText(text);
		setShowToast(true);
	};

	return (
		<div>
			<Toast
				open={showToast}
				onClose={() => setShowToast(false)}
			>
				Copied selected rows to clipboard.
			</Toast>
			<div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 8 }}>
				<Input
					placeholder="Filter by name..."
					value={search}
					onInput={e => setSearch((e.target as import('@ui5/webcomponents-react').InputDomRef).value)}
					style={{ width: 240 }}
				/>
				<button onClick={handleCopySelected} disabled={selectedIds.length === 0} style={{ height: 40, padding: '0 16px', background: 'var(--sapButton_Background)', color: 'var(--sapButton_TextColor)', border: 'none', borderRadius: 4, cursor: selectedIds.length ? 'pointer' : 'not-allowed' }}>
					Copy Selected
				</button>
			</div>
			<EmployeeTable
				data={data}
				filteredLength={filtered.length}
				rowHeight={ROW_HEIGHT}
				tableHeight={TABLE_HEIGHT}
				onRangeChange={handleRangeChange}
				search={search}
				onSelectionChange={handleSelectionChange}
				selectedIds={selectedIds}
			/>
		</div>
	);
};

export default GlobalDashboard;
