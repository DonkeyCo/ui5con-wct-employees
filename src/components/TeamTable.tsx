import React, { useState }  from 'react';
import {
	Table,
	TableHeaderRow,
	TableHeaderCell,
	TableRow,
	TableCell,
	TableRowAction,
	TableSelectionMulti,
	SegmentedButton,
	SegmentedButtonItem
} from '@ui5/webcomponents-react';
import '@ui5/webcomponents-icons/dist/detail-less.js';
import '@ui5/webcomponents-icons/dist/detail-more.js';

export type TeamMember = {
	id: number;
	name: string;
	title: string;
	project: string;
	salary: number;
	department: string;
	email: string;
	team: string;
	// Add more properties as needed
};

interface TeamTableProps {
	team: TeamMember[];
	role: 'Employee' | 'Manager';
	onSelectionChange: (ids: number[]) => void;
	onRemove: (id: number) => void;
	onMove: (event: Event) => void;
	onMoveOver: (event: Event) => void;
}

const TeamTable: React.FC<TeamTableProps> = ({ team, role, onSelectionChange, onRemove, onMove, onMoveOver }) => {
	const [details, setDetails] = useState<'less' | 'more'>('less');

	return (
		<div>
			<div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
				<SegmentedButton onSelectionChange={e => {
					const selected = e.detail.selectedItems?.[0]?.dataset.key as 'less' | 'more';
					setDetails(selected || 'less');
				}}>
					<SegmentedButtonItem icon="detail-more" data-key="more" tooltip='Show More Per Row'></SegmentedButtonItem>
					<SegmentedButtonItem selected icon='detail-less' data-key="less" tooltip='Show Less Per Row'></SegmentedButtonItem>
				</SegmentedButton>
			</div>
			<Table
				overflowMode="Popin"
				style={{ height: '100%', width: '100%' }}
				headerRow={
					<TableHeaderRow sticky>
						<TableHeaderCell width="48px" minWidth="40px" importance={3}>#</TableHeaderCell>
						<TableHeaderCell width="15%" minWidth="100px" importance={2}>Name</TableHeaderCell>
						<TableHeaderCell width="15%" minWidth="100px" importance={-1} popinHidden={details === "less"}>Department</TableHeaderCell>
						<TableHeaderCell width="20%" minWidth="90px" importance={-1} popinHidden={details === "less"}>Title</TableHeaderCell>
						<TableHeaderCell minWidth="100px" importance={1}>Project</TableHeaderCell>
						<TableHeaderCell minWidth="200px">Email</TableHeaderCell>
						<TableHeaderCell minWidth="100px" importance={-2} popinHidden={details === "less"}>Team</TableHeaderCell>
						{role === 'Manager' && 
							<TableHeaderCell horizontalAlign="Right" width="10%" minWidth="100px" importance={1}>Salary</TableHeaderCell>
						}
					</TableHeaderRow>
				}
				rowActionCount={role === 'Manager' ? 1 : 0}
				noDataText="No team members found."
				onMove={onMove}
				onMoveOver={onMoveOver}
			>
				{role === 'Manager' && (
					<TableSelectionMulti
						slot="features"
						onChange={e => {
							const selection = e.target;
							const ids = Array.from(selection.getSelectedAsSet());
							onSelectionChange(ids.map(id => parseInt(id, 10)));
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
								onClick={() => onRemove(member.id)}
							>
								Remove
							</TableRowAction>
						) : undefined}
					>
						<TableCell>{member.id}</TableCell>
						<TableCell>{member.name}</TableCell>
						<TableCell>{member.department}</TableCell>
						<TableCell>{member.title}</TableCell>
						<TableCell>{member.project}</TableCell>
						<TableCell>{member.email}</TableCell>
						<TableCell>{member.team}</TableCell>
						{role === 'Manager' && (
							<TableCell>
								{typeof member.salary === 'number'
									? member.salary.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
									: 'N/A'}
							</TableCell>
						)}
					</TableRow>
				))}
				{role === 'Manager' && (
					<TableRow rowKey="summary" style={{ background: 'var(--sapList_TableGroupHeaderBackground)', borderTop: '1px solid var(--sapList_BorderColor)' }}>
						<TableCell horizontalAlign="End" style={{ gridColumn: '2 / -2', gridRow: '1' }}>
							<span style={{ fontWeight: 'bold' }}>
								Total Salary:&nbsp;&nbsp;
								{team.reduce((sum, m) => sum + (typeof m.salary === 'number' ? m.salary : 0), 0).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
							</span>
						</TableCell>
					</TableRow>
				)}
			</Table>
		</div>
	);
};

export default TeamTable;
