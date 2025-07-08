import React, { useState } from 'react';
import {
	Button
} from '@ui5/webcomponents-react';
import AddEmployeeDialog from './components/AddEmployeeDialog';
import SalaryDialog from './components/SalaryDialog';
import TeamTable from './components/TeamTable';
import ProjectBoard from './components/ProjectBoard';
import { useEmployeeData } from './context/EmployeeDataContext';
import '@ui5/webcomponents/dist/Assets.js';
import '@ui5/webcomponents-fiori/dist/Assets.js';
import '@ui5/webcomponents-react/dist/Assets.js';
import '@ui5/webcomponents-icons/dist/delete.js';
import '@ui5/webcomponents-icons/dist/add.js';

type EmployeeTeamViewProps = {
	role?: 'Employee' | 'Manager';
};

const EmployeeTeamView: React.FC<EmployeeTeamViewProps> = ({ role = 'Employee' }) => {
	const { employees, setEmployees } = useEmployeeData();
	// --- Dialog State and Handlers ---
	const [dialogOpen, setDialogOpen] = useState(false);
	const [newName, setNewName] = useState('');
	const [newTitle, setNewTitle] = useState('');
	const openAddDialog = () => setDialogOpen(true);
	const closeAddDialog = () => { setDialogOpen(false); setNewName(''); setNewTitle(''); };
	const submitAddDialog = () => {
		if (!newName.trim() || !newTitle.trim()) return;
		const nextId = employees.length ? Math.max(...employees.map(e => e.id)) + 1 : 1;
		// Add a random salary for new employees
		const randomSalary = Math.floor(Math.random() * 30000) + 70000;
		setEmployees(prev => [
			...prev,
			{
				id: nextId,
				name: newName,
				title: newTitle,
				project: '',
				salary: randomSalary,
				department: '',
				email: '',
				team: 'Alpha' // Ensure new employees are added to the current team
			}
		]);
		closeAddDialog();
	};

	// --- Salary Adjustment State and Handlers ---
	const [salaryDialogOpen, setSalaryDialogOpen] = useState(false);
	const [adjustType, setAdjustType] = useState<'percent' | 'amount'>('percent');
	const [adjustValue, setAdjustValue] = useState('');
	const [adjustDirection, setAdjustDirection] = useState<'increase' | 'decrease'>('increase');
	const openSalaryDialog = () => setSalaryDialogOpen(true);
	const closeSalaryDialog = () => { setSalaryDialogOpen(false); setAdjustValue(''); };
	const [selectedIds, setSelectedIds] = useState<number[]>([]);
	const applySalaryAdjustment = () => {
		const value = parseFloat(adjustValue);
		if (isNaN(value) || value <= 0) return;
		setEmployees(prev => prev.map(emp => {
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
	// Only show up to 10 employees from team 'Alpha' in the team dashboard
	const team = employees.filter(e => e.team === 'Alpha');
	const handleRemove = (id: number) => setEmployees(prev => prev.map(e => e.id === id ? { ...e, project: '', team: '' } : e));

	// --- Table Row Move Handlers ---
	const handleMove = (event: Event) => {
		const { source, destination } = (event as CustomEvent).detail;
		const sourceIndex = team.findIndex(row => `${row.id}` === source.element.rowKey);
		const destinationIndex = team.findIndex(row => `${row.id}` === destination.element.rowKey);
		if (sourceIndex === -1 || destinationIndex === -1) return;
		if (destination.placement === 'Before' || destination.placement === 'After') {
			const teamIds = team.map(m => m.id);
			const updatedOrder = [...teamIds];
			const [movedId] = updatedOrder.splice(sourceIndex, 1);
			if (destination.placement === 'Before') updatedOrder.splice(destinationIndex, 0, movedId);
			else updatedOrder.splice(destinationIndex + 1, 0, movedId);
			// Reorder employees in context
			setEmployees(prev => {
				const teamMembers = prev.filter(e => teamIds.includes(e.id));
				const rest = prev.filter(e => !teamIds.includes(e.id));
				const reordered = updatedOrder.map(id => teamMembers.find(e => e.id === id)!);
				return [...rest, ...reordered];
			});
		}
	};
	const handleMoveOver = (event: Event) => {
		const { source, destination } = (event as CustomEvent).detail;
		if (
			source.element.hasAttribute('ui5-table-row') &&
			destination.element.hasAttribute('ui5-table-row') &&
			destination.placement !== 'On'
		) event.preventDefault();
	};

	// --- Project Board Drag & Drop ---
	const handleListMove = (targetProject: string) => (event: Event) => {
		const { source } = (event as CustomEvent).detail;
		const id = Number(source.element.rowKey ?? source.element.getAttribute("data-id"));
		setEmployees(prev => prev.map(e => e.id === id ? { ...e, project: targetProject === 'Unassigned' ? '' : targetProject } : e));
	};
	const handleListMoveOver = (event: Event) => {
		const { source, destination } = (event as CustomEvent).detail;
		const tag = source?.element.tagName.toLowerCase();
		if (tag.includes('ui5-li') || tag.includes('ui5-table-row')) {
			if (destination?.element.hasAttribute('data-empty-indicator')) {
				if (destination.placement === "On") {
					event.preventDefault();
				}
			} else if (destination.placement !== "On") {
				event.preventDefault();
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
