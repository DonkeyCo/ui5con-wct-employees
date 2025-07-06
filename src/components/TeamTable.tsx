import React from 'react';
import {
  Table,
  TableHeaderRow,
  TableHeaderCell,
  TableRow,
  TableCell,
  TableRowAction,
  TableSelectionMulti
} from '@ui5/webcomponents-react';

export type TeamMember = {
  id: number;
  name: string;
  title: string;
  project: string;
  salary: number;
};

interface TeamTableProps {
  team: TeamMember[];
  role: 'Employee' | 'Manager';
  onSelectionChange: (ids: number[]) => void;
  onRemove: (id: number) => void;
  onMove: (event: any) => void;
  onMoveOver: (event: any) => void;
}

const TeamTable: React.FC<TeamTableProps> = ({ team, role, onSelectionChange, onRemove, onMove, onMoveOver }) => (
  <Table
    style={{ height: '100%', width: '100%' }}
    headerRow={
      <TableHeaderRow sticky>
        <TableHeaderCell width="40px" minWidth="40px">#</TableHeaderCell>
        <TableHeaderCell width="15%" minWidth="100px">Name</TableHeaderCell>
        <TableHeaderCell width="20%" minWidth="90px">Title</TableHeaderCell>
        <TableHeaderCell minWidth="100px">Project</TableHeaderCell>
        {role === 'Manager' && <TableHeaderCell horizontalAlign="Right" width="10%" minWidth="100px">Salary</TableHeaderCell>}
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
    {role === 'Manager' && (
      <TableRow style={{ background: 'var(--sapList_TableGroupHeaderBackground)', borderTop: '1px solid var(--sapList_BorderColor)' }}>
        <TableCell horizontalAlign="End" style={{ gridColumn: '2 / -2', gridRow: '1' }}>
          <span style={{ fontWeight: 'bold' }}>
            Total Salary:&nbsp;&nbsp;
            {team.reduce((sum, m) => sum + (typeof m.salary === 'number' ? m.salary : 0), 0).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
          </span>
        </TableCell>
      </TableRow>
    )}
  </Table>
);

export default TeamTable;
