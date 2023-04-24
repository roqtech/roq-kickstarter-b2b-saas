import { requireNextAuth } from '@roq/nextjs';
import DashboardLayout from '../layout/dashboard.layout';
import EmployeesIndex from '../components/employees/employee.index';

const EmployeesPage = (): JSX.Element => {
  return (
    <DashboardLayout current="employees">
      <EmployeesIndex />
    </DashboardLayout>
  );
};

export default requireNextAuth({
  redirectIfAuthenticated: false,
  redirectTo: '/login',
})(EmployeesPage);
