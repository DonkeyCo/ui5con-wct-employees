import React, { useState } from 'react';
import {
	Button
} from '@ui5/webcomponents-react';
import '@ui5/webcomponents/dist/Assets.js';
import '@ui5/webcomponents-fiori/dist/Assets.js';
import '@ui5/webcomponents-react/dist/Assets.js';
import '@ui5/webcomponents-icons/dist/delete.js';
import '@ui5/webcomponents-icons/dist/add.js';
import AddEmployeeDialog from './components/AddEmployeeDialog';
import SalaryDialog from './components/SalaryDialog';
import TeamTable from './components/TeamTable';
import ProjectBoard from './components/ProjectBoard';

// Mock team data
const INITIAL_TEAM = [
	{ id: 1, name: 'Alice', title: 'Developer', project: 'Project A', salary: 90000 },
	{ id: 2, name: 'Bob', title: 'Analyst', project: 'Project B', salary: 85000 },
	{ id: 3, name: 'Charlie', title: 'Consultant', project: 'Project C', salary: 95000 },
	{ id: 4, name: 'Diana', title: 'Developer', project: 'Project D', salary: 91000 },
	{ id: 5, name: 'Eve', title: 'Developer', project: 'Project A', salary: 88000 },
	{ id: 6, name: 'Frank', title: 'Analyst', project: 'Project B', salary: 83000 },
	{ id: 7, name: 'Grace', title: 'Consultant', project: 'Project C', salary: 97000 },
	{ id: 8, name: 'Heidi', title: 'Developer', project: 'Project D', salary: 92000 }
];

type EmployeeTeamViewProps = {
	role?: 'Employee' | 'Manager';
};

const EmployeeTeamView: React.FC<EmployeeTeamViewProps> = ({ role = 'Employee' }) => {
	// --- Dialog State and Handlers ---
	const [dialogOpen, setDialogOpen] = useState(false);
	const [newName, setNewName] = useState('');
	const [newTitle, setNewTitle] = useState('');
	const openAddDialog = () => setDialogOpen(true);
	const closeAddDialog = () => { setDialogOpen(false); setNewName(''); setNewTitle(''); };
	const submitAddDialog = () => {
		if (!newName.trim() || !newTitle.trim()) return;
		const nextId = team.length ? Math.max(...team.map(e => e.id)) + 1 : 1;
		// Add a random salary for new employees
		const randomSalary = Math.floor(Math.random() * 30000) + 70000;
		setTeam(prev => [...prev, { id: nextId, name: newName, title: newTitle, project: '', salary: randomSalary }]);
		closeAddDialog();
	};

	// --- Salary Adjustment State and Handlers ---
	const [salaryDialogOpen, setSalaryDialogOpen] = useState(false);
	const [adjustType, setAdjustType] = useState<'percent' | 'amount'>('percent');
	const [adjustValue, setAdjustValue] = useState('');
	const [adjustDirection, setAdjustDirection] = useState<'increase' | 'decrease'>('increase');
	const openSalaryDialog = () => setSalaryDialogOpen(true);
	const closeSalaryDialog = () => { setSalaryDialogOpen(false); setAdjustValue(''); };
	const applySalaryAdjustment = () => {
		const value = parseFloat(adjustValue);
		if (isNaN(value) || value <= 0) return;
		setTeam(prev => prev.map(emp => {
			if (!selectedIds.includes(emp.id)) return emp;
			let newSalary = emp.salary;
			if (adjustType === 'percent') {
				const delta = emp.salary * (value / 100);
				newSalary = adjustDirection === 'increase' ? emp.salary + delta : emp.salary - delta;
			} else {
				newSalary = adjustDirection === 'increase' ? emp.salary + value : emp.salary - value;
			}
			return { ...emp, salary: Math.max(0, Math.round(newSalary)) };
		}));
		closeSalaryDialog();
	};

	// --- Team State and Selection ---
	const [team, setTeam] = useState(INITIAL_TEAM);
	const [selectedIds, setSelectedIds] = useState<number[]>([]);
	const handleRemove = (id: number) => setTeam(prev => prev.filter(member => member.id !== id));

	// --- Table Row Move Handlers ---
	const handleMove = (event: any) => {
		const { source, destination } = event.detail;
		const sourceIndex = team.findIndex(row => `${row.id}` === source.element.rowKey);
		const destinationIndex = team.findIndex(row => `${row.id}` === destination.element.rowKey);
		if (sourceIndex === -1 || destinationIndex === -1) return;
		if (destination.placement === 'Before' || destination.placement === 'After') {
			const updated = [...team];
			const [moved] = updated.splice(sourceIndex, 1);
			if (destination.placement === 'Before') updated.splice(destinationIndex, 0, moved);
			else updated.splice(destinationIndex + 1, 0, moved);
			setTeam(updated);
		}
	};
	const handleMoveOver = (event: any) => {
		const { source, destination } = event.detail;
		if (
			source.element.hasAttribute('ui5-table-row') &&
			destination.element.hasAttribute('ui5-table-row') &&
			destination.placement !== 'On'
		) event.preventDefault();
	};

	// --- Project Board Drag & Drop ---
	const handleListMove = (targetProject: string) => (event: any) => {
		const { source, destination } = event.detail;
		const destinationList = destination?.element?.closest('[data-list-index]');
		if (!destinationList) return;
		const projectIndex = destinationList.getAttribute('data-list-index');
		if (projectIndex === null) return;
		const project = ['Project A', 'Project B', 'Project C', 'Project D', 'Unassigned'][Number(projectIndex)];
		if (!project) return;
		const employeeId = parseInt(source?.element?.getAttribute('data-id') ?? source?.element?.rowKey);
		if (isNaN(employeeId)) return;
		const employee = team.find(m => m.id === employeeId);
		if (!employee) return;
		const newProject = targetProject === 'Unassigned' ? '' : targetProject;
		if (employee.project === newProject) return;
		setTeam(prev => prev.map(emp => emp.id === employeeId ? { ...emp, project: newProject } : emp));
	};
	const handleListMoveOver = (event: any) => {
		const { source, destination } = event.detail;
		const tag = source?.element.tagName.toLowerCase();
		if (tag.includes('ui5-li') || tag.includes('ui5-table-row')) {
			if (destination?.element.hasAttribute('data-empty-indicator')) {
				destination.placement === 'On' && event.preventDefault();
			} else {
				destination.placement !== 'On' && event.preventDefault();
			}
		}
	};

	return (
		<div className="table-scrollbar" style={{ borderRadius: 12, background: 'var(--sapList_Background)', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)', padding: 16 }}>
			{role === 'Manager' && (
				<div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
					<Button icon="add" design="Emphasized" onClick={openAddDialog}>
						Add Employee
					</Button>
					<Button icon="money-bills" design="Attention" disabled={selectedIds.length === 0} onClick={openSalaryDialog}>
						Adjust Salary
					</Button>
				</div>
			)}
			<TeamTable
				team={team}
				role={role}
				onSelectionChange={setSelectedIds}
				onRemove={handleRemove}
				onMove={handleMove}
				onMoveOver={handleMoveOver}
			/>
			{role === 'Manager' && <ProjectBoard team={team} onListMove={handleListMove} onListMoveOver={handleListMoveOver} />}
			<AddEmployeeDialog
				open={dialogOpen}
				name={newName}
				title={newTitle}
				onNameChange={setNewName}
				onTitleChange={setNewTitle}
				onClose={closeAddDialog}
				onSubmit={submitAddDialog}
			/>
			{role === 'Manager' && (
				<SalaryDialog
					open={salaryDialogOpen}
					adjustType={adjustType}
					adjustValue={adjustValue}
					adjustDirection={adjustDirection}
					onTypeChange={setAdjustType}
					onDirectionChange={setAdjustDirection}
					onValueChange={setAdjustValue}
					onClose={closeSalaryDialog}
					onApply={applySalaryAdjustment}
				/>
			)}
		</div>
	);
};

export default EmployeeTeamView;
