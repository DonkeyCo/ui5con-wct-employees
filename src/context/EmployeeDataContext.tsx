import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type Employee = {
  id: number;
  name: string;
  department: string;
  title: string;
  email: string;
  salary: number;
  project: string; // always a string
  team: string; // new property
};

const TEAMS = ['Alpha', 'Beta', 'Gamma', 'Delta'];
const FIRST_NAMES = [
  'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Heidi', 'Ivan', 'Judy',
  'Karl', 'Laura', 'Mallory', 'Niaj', 'Olivia', 'Peggy', 'Quentin', 'Rupert', 'Sybil', 'Trent',
  'Uma', 'Victor', 'Wendy', 'Xavier', 'Yvonne', 'Zach'
];
const LAST_NAMES = [
  'Anderson', 'Brown', 'Clark', 'Davis', 'Evans', 'Foster', 'Garcia', 'Harris', 'Iverson', 'Jones',
  'King', 'Lewis', 'Miller', 'Nelson', 'Owens', 'Parker', 'Quinn', 'Roberts', 'Smith', 'Turner',
  'Underwood', 'Vega', 'White', 'Xu', 'Young', 'Zimmerman'
];

function randomName(i: number) {
  const first = FIRST_NAMES[i % FIRST_NAMES.length];
  const last = LAST_NAMES[Math.floor(i / FIRST_NAMES.length) % LAST_NAMES.length];
  return `${first} ${last}`;
}

const EMPLOYEES: Employee[] = [
  ...Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: randomName(i),
    department: ['HR', 'IT', 'Finance', 'Sales'][i % 4],
    title: ['Developer', 'Manager', 'Analyst', 'Consultant'][i % 4],
    email: `employee${i + 1}@company.com`,
    salary: 50000 + (i % 10) * 2500,
    project:
      i === 0 ? 'Project A' :
      i === 1 ? 'Project B' :
      i === 2 ? 'Project C' :
      i === 3 ? 'Project D' :
      i === 4 ? 'Project A' :
      i === 5 ? 'Project B' :
      i === 6 ? 'Project C' :
      i === 7 ? 'Project D' :
      '',
    team: 'Alpha'
  })),
  ...Array.from({ length: 990 }, (_, i) => ({
    id: i + 11,
    name: randomName(i + 10),
    department: ['HR', 'IT', 'Finance', 'Sales'][(i + 10) % 4],
    title: ['Developer', 'Manager', 'Analyst', 'Consultant'][(i + 10) % 4],
    email: `employee${i + 11}@company.com`,
    salary: 50000 + ((i + 10) % 10) * 2500,
    project: '',
    team: TEAMS[1 + ((i + 10) % 3)] // Cycles through Beta, Gamma, Delta
  }))
];

interface EmployeeDataContextType {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
}

const EmployeeDataContext = createContext<EmployeeDataContextType | undefined>(undefined);

export const EmployeeDataProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployees] = useState<Employee[]>(EMPLOYEES);
  return (
    <EmployeeDataContext.Provider value={{ employees, setEmployees }}>
      {children}
    </EmployeeDataContext.Provider>
  );
};

export const useEmployeeData = () => {
  const ctx = useContext(EmployeeDataContext);
  if (!ctx) throw new Error('useEmployeeData must be used within EmployeeDataProvider');
  return ctx;
};
