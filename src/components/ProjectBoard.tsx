import React from 'react';
import { FlexBox, Card, CardHeader, List, ListItemStandard } from '@ui5/webcomponents-react';
import type { TeamMember } from './TeamTable';

interface ProjectBoardProps {
  team: TeamMember[];
  onListMove: (project: string) => (event: any) => void;
  onListMoveOver: (event: any) => void;
}

const PROJECTS = ['Project A', 'Project B', 'Project C', 'Project D', 'Unassigned'];

const ProjectBoard: React.FC<ProjectBoardProps> = ({ team, onListMove, onListMoveOver }) => (
  <FlexBox direction="Row" wrap="Wrap" gap={'1rem'} style={{ marginTop: 16 }}>
    {PROJECTS.map((project, listIdx) => (
      <Card
        key={project}
        header={<CardHeader titleText={project} subtitleText={project === 'Unassigned' ? 'No Project' : 'Project'} />}
        style={{ minHeight: '200px', minWidth: 280, maxWidth: 340, flex: '1 1 300px' }}
      >
        <List
          onMove={onListMove(project)}
          onMoveOver={onListMoveOver}
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
);

export default ProjectBoard;
