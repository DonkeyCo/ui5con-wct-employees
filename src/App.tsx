import React, { useState, useRef } from 'react';
import GlobalDashboard from './GlobalDashboard';
import EmployeeTeamView from './EmployeeTeamView';
import { ShellBar, ShellBarItem, Card, CardHeader, Avatar, Bar, Popover, List, Icon, ListItemStandard } from '@ui5/webcomponents-react';
import './App.css';
import '@ui5/webcomponents-icons/dist/table-view.js';
import '@ui5/webcomponents-icons/dist/group.js';
import '@ui5/webcomponents-icons/dist/user-settings.js';

function App() {
  const [view, setView] = useState<'global' | 'team'>('global');
  const [role, setRole] = useState<'Employee' | 'Manager'>('Employee');
  const [rolePopoverOpen, setRolePopoverOpen] = useState(false);
  const roleItemRef = useRef(null);

  const handleRoleSelect = (selectedRole: 'Employee' | 'Manager') => {
    setRole(selectedRole);
    setRolePopoverOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--sapBackgroundColor)', display: 'flex', flexDirection: 'column' }}>
      <ShellBar
        primaryTitle="Employee Management System"
        logo={<img src="/vite.svg" alt="Logo" style={{ height: 32 }} />}
        onLogoClick={() => setView('global')}
      >
        <ShellBarItem icon="table-view" text="Global" onClick={() => setView('global')} />
        <ShellBarItem icon="group" text="Team" onClick={() => setView('team')} />
        <ShellBarItem
          icon="user-settings"
          text={`Role: ${role}`}
          ref={roleItemRef}
          onClick={() => setRolePopoverOpen(true)}
        />
      </ShellBar>
      {rolePopoverOpen && roleItemRef.current && (
        <Popover
          open
          opener={roleItemRef.current as HTMLElement}
          placement="Bottom"
          onClose={() => setRolePopoverOpen(false)}
        >
          <List>
            <ListItemStandard
              data-role="Employee"
              selected={role === 'Employee'}
              onClick={() => handleRoleSelect('Employee')}
            >
              <Icon name="employee" style={{ marginRight: 8 }} /> Employee
            </ListItemStandard>
            <ListItemStandard
              data-role="Manager"
              selected={role === 'Manager'}
              onClick={() => handleRoleSelect('Manager')}
            >
              <Icon name="user-settings" style={{ marginRight: 8 }} /> Manager
            </ListItemStandard>
          </List>
        </Popover>
      )}
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '2rem 0', background: 'var(--sapBackgroundColor)' }}>
        <Card
          style={{ width: '100%', maxWidth: 1200, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)', borderRadius: 16, background: 'var(--sapTile_Background)', marginTop: 32 }}
          header={<CardHeader
            titleText={view === 'global' ? 'Global Employee Dashboard' : 'My Team'}
            avatar={<Avatar icon={view === 'global' ? 'table-view' : 'group'} shape="Circle" />}
          />}
        >
          <div style={{ padding: '2rem', paddingTop: 0 }}>
            {view === 'global' ? <GlobalDashboard role={role} /> : <EmployeeTeamView role={role} />}
          </div>
        </Card>
      </main>
      <Bar style={{ textAlign: 'center', color: 'var(--sapContent_ContrastTextColor)' }}>
        <span style={{ width: '100%' }}>© {new Date().getFullYear()} Employee Management System</span>
      </Bar>
    </div>
  );
}

export default App;
