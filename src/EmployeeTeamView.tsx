import React, { useState, useRef } from 'react';
import {
	Table,
	TableHeaderRow,
	TableHeaderCell,
	TableRow,
	TableCell,
	TableRowAction,
	Button,
	Dialog,
	Input,
	Card,
	CardHeader,
	FlexBox,
	List,
	ListItemStandard,
	TableSelectionMulti
} from '@ui5/webcomponents-react';
import type { InputDomRef } from '@ui5/webcomponents-react';
import '@ui5/webcomponents/dist/Assets.js';
import '@ui5/webcomponents-fiori/dist/Assets.js';
import '@ui5/webcomponents-react/dist/Assets.js';
import '@ui5/webcomponents-icons/dist/delete.js';
import '@ui5/webcomponents-icons/dist/add.js';
import '@ui5/webcomponents/dist/List.js';

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
	const [team, setTeam] = useState(INITIAL_TEAM);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [newName, setNewName] = useState('');
	const [newTitle, setNewTitle] = useState('');
	const [selectedIds, setSelectedIds] = useState<number[]>([]);
	const [salaryDialogOpen, setSalaryDialogOpen] = useState(false);
	const [adjustType, setAdjustType] = useState<'percent' | 'amount'>('percent');
	const [adjustValue, setAdjustValue] = useState('');
	const [adjustDirection, setAdjustDirection] = useState<'increase' | 'decrease'>('increase');

	const handleRemove = (id: number) => {
		setTeam(prev => prev.filter(member => member.id !== id));
	};

	const handleAdd = () => {
		setDialogOpen(true);
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
		setNewName('');
		setNewTitle('');
	};

	const handleDialogSubmit = () => {
		if (!newName.trim() || !newTitle.trim()) return;
		const nextId = team.length ? Math.max(...team.map(e => e.id)) + 1 : 1;
		// Add a random salary for new employees
		const randomSalary = Math.floor(Math.random() * 30000) + 70000;
		setTeam(prev => [
			...prev,
			{ id: nextId, name: newName, title: newTitle, project: '', salary: randomSalary }
		]);
		handleDialogClose();
	};

	// Handler for row move (reorder) using source/destination/placement
	const handleMove = (event: any) => {
		const { source, destination } = event.detail;
		const sourceIndex = team.findIndex(
			(row) => `${row.id}` === source.element.rowKey
		);
		const destinationIndex = team.findIndex(
			(row) => `${row.id}` === destination.element.rowKey
		);
		if (sourceIndex === -1 || destinationIndex === -1) return;
		if (destination.placement === 'Before' || destination.placement === 'After') {
			const updated = [...team];
			const [moved] = updated.splice(sourceIndex, 1);
			if (destination.placement === 'Before') {
				updated.splice(destinationIndex, 0, moved);
			} else if (destination.placement === 'After') {
				updated.splice(destinationIndex + 1, 0, moved);
			}
			setTeam(updated);
		}
	};

	// Handler for move over (drag over row) to prevent invalid drop
	const handleMoveOver = (event: any) => {
		const { source, destination } = event.detail;
		if (
			source.element.hasAttribute('ui5-table-row') &&
			destination.element.hasAttribute('ui5-table-row') &&
			destination.placement !== 'On'
		) {
			event.preventDefault();
		}
	};

	// Handler for moving employees between projects using List's onMove
	const handleListMove = (targetProject: string) => (event: any) => {
		const { source, destination } = event.detail;

		const destinationList = destination?.element?.closest("[data-list-index]");
		if (!destinationList) return;

		const projectIndex = destinationList.getAttribute('data-list-index');
		if (projectIndex === null) return;

		const project = ['Project A', 'Project B', 'Project C', 'Project D', 'Unassigned'][Number(projectIndex)];
		if (!project) return;

		const employeeId = parseInt(source?.element?.getAttribute("data-id") ?? source?.element?.rowKey);
		if (isNaN(employeeId)) return;

		const employee = team.find(m => m.id === employeeId);
		if (!employee) return;

		employee.project = targetProject === 'Unassigned' ? '' : targetProject;
		// Update the team state with the moved employee
		setTeam(prev => {
			const updated = prev.map(emp => emp.id === employeeId ? { ...emp, project: employee.project } : emp);
			return updated;
		});
	};

	// Handler for move over (optional, for visual feedback)
	const handleListMoveOver = (event: any) => {
		// If the dragged control is a ListItemStandard, prevent the event
		const { source, destination } = event.detail;

		if (source?.element.tagName.toLowerCase().includes("ui5-li") ||
			source?.element.tagName.toLowerCase().includes("ui5-table-row")) {
			// Moving over empty list, only allow "On"
			if (destination?.element.hasAttribute("data-empty-indicator")) {
				// If the destination is an empty list, allow dropping
				destination.placement === "On" && event.preventDefault();
			} else {
				destination.placement !== "On" && event.preventDefault();
			}
		}
	};

	return (
		<div className="table-scrollbar" style={{ borderRadius: 12, background: 'var(--sapList_Background)', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)', padding: 16 }}>
			{role === 'Manager' && (
				<div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
					<Button icon="add" design="Emphasized" onClick={handleAdd}>
						Add Employee
					</Button>
					<Button icon="money-bills" design="Attention" disabled={selectedIds.length === 0} onClick={() => setSalaryDialogOpen(true)}>
						Adjust Salary
					</Button>
				</div>
			)}
			<Table
				style={{ height: '100%', width: '100%' }}
				headerRow={
					<TableHeaderRow sticky>
						<TableHeaderCell width="40px" minWidth="40px">#</TableHeaderCell>
						<TableHeaderCell width="15%" minWidth="100px">Name</TableHeaderCell>
						<TableHeaderCell width="20%" minWidth="90px">Title</TableHeaderCell>
						<TableHeaderCell minWidth="100px">Project</TableHeaderCell>
						{
							role === 'Manager' && 
							<TableHeaderCell horizontalAlign="Right" width="10%" minWidth="100px">Salary</TableHeaderCell>
						}
					</TableHeaderRow>
				}
				rowActionCount={role === 'Manager' ? 1 : 0}
				noDataText="No team members found."
				onMove={handleMove}
				onMoveOver={handleMoveOver}
			>
				{role === 'Manager' && (
					<TableSelectionMulti
						slot="features"
						onChange={e => {
							const selection = e.target;
							const ids = Array.from(selection.getSelectedAsSet());
							setSelectedIds(ids.map(id => parseInt(id, 10)));
						}}
					/>
				)}
				{team.map((member, idx) => (
					<TableRow
						key={member.id}
						rowKey={`${member.id}`}
						movable
						position={idx}
						actions={role === 'Manager' ? (
							<TableRowAction
								icon="delete"
								onClick={() => handleRemove(member.id)}
							>
								Remove
							</TableRowAction>
						) : undefined}
					>
						<TableCell>{member.id}</TableCell>
						<TableCell>{member.name}</TableCell>
						<TableCell>{member.title}</TableCell>
						<TableCell>{member.project}</TableCell>
						{role === 'Manager' && (
							<TableCell>
								{typeof member.salary === 'number'
									? member.salary.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
									: 'N/A'}
							</TableCell>
						)}
					</TableRow>
				))}
				{role == "Manager" && 
					<TableRow style={{
						background: 'var(--sapList_TableGroupHeaderBackground)',
						borderTop: '1px solid var(--sapList_BorderColor)'
					}}>
						<TableCell 
							horizontalAlign="End"
							style={{ gridColumn: "2 / -2", gridRow: "1" }}>
						<span style={{ fontWeight: "bold" }}>
							Total Salary:&nbsp;&nbsp;
							{team.reduce((sum, m) => sum + (typeof m.salary === 'number' ? m.salary : 0), 0).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
						</span> 
						</TableCell>
					</TableRow>
				}
			</Table>
			{role === 'Manager' && (
				<>
					{/* Project Board with Cards in FlexBox */}
					<FlexBox
						direction="Row"
						wrap="Wrap"
						gap={'1rem'}
						style={{ marginTop: 16 }}
					>
						{['Project A', 'Project B', 'Project C', 'Project D', 'Unassigned'].map((project, listIdx) => (
							<Card
								key={project}
								header={<CardHeader
									titleText={project}
									subtitleText={project === 'Unassigned' ? 'No Project' : 'Project'}
								/>}
								style={{ minHeight: '200px', minWidth: 280, maxWidth: 340, flex: '1 1 300px' }}
							>
								<List
									onMove={handleListMove(project)}
									onMoveOver={handleListMoveOver}
									data-list-index={listIdx}
								>
									{team.filter(m => (project === 'Unassigned' ? !m.project : m.project === project)).length === 0 ? (
										<ListItemStandard data-empty-indicator="true" key="empty" type="Inactive" style={{ color: 'var(--sapContent_LabelColor)' }}>
											No employees assigned.
										</ListItemStandard>
									) : (
										team.filter(m => (project === 'Unassigned' ? !m.project : m.project === project)).map((m) => (
											<ListItemStandard
												key={m.id}
												data-id={m.id}
												style={{ cursor: 'grab' }}
												description={m.title}
												additionalText={m.salary.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
												movable
											>
												{m.name}
											</ListItemStandard>
										))
									)}
								</List>
							</Card>
						))}
					</FlexBox>
				</>
			)}
			<Dialog open={dialogOpen} headerText="Add Employee" onClose={handleDialogClose}>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 12 }}>
					<Input
						placeholder="Name"
						value={newName}
						onInput={e => setNewName((e.target as InputDomRef).value)}
					/>
					<Input
						placeholder="Title"
						value={newTitle}
						onInput={e => setNewTitle((e.target as InputDomRef).value)}
					/>
				</div>
				<div slot="footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
					<Button onClick={handleDialogClose}>Cancel</Button>
					<Button design="Emphasized" onClick={handleDialogSubmit} disabled={!newName.trim() || !newTitle.trim()}>
						Add
					</Button>
				</div>
			</Dialog>
			{role === 'Manager' && (
				<Dialog open={salaryDialogOpen} headerText="Adjust Salary" onClose={() => setSalaryDialogOpen(false)}>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 12 }}>
						<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
							<label>Type:</label>
							<select value={adjustType} onChange={e => setAdjustType(e.target.value as any)}>
								<option value="percent">Percent (%)</option>
								<option value="amount">Amount (€)</option>
							</select>
						</div>
						<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
							<label>Direction:</label>
							<select value={adjustDirection} onChange={e => setAdjustDirection(e.target.value as any)}>
								<option value="increase">Increase</option>
								<option value="decrease">Decrease</option>
							</select>
						</div>
						<Input
							placeholder={adjustType === 'percent' ? 'Percent (e.g. 5)' : 'Amount (e.g. 1000)'}
							value={adjustValue}
							onInput={e => setAdjustValue((e.target as InputDomRef).value)}
							type="Number"
						/>
					</div>
					<div slot="footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
						<Button onClick={() => setSalaryDialogOpen(false)}>Cancel</Button>
						<Button design="Emphasized" onClick={() => {
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
							setSalaryDialogOpen(false);
							setAdjustValue('');
						}} disabled={!adjustValue.trim() || isNaN(Number(adjustValue)) || Number(adjustValue) <= 0}>
							Apply
						</Button>
					</div>
				</Dialog>
			)}
		</div>
	);
};

export default EmployeeTeamView;
