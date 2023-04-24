import { requireNextAuth } from '@roq/nextjs';
import DashboardLayout from '../layout/dashboard.layout';
import DepartmentIndex from '../components/department/department.index';

const DepartmentsPage = (): JSX.Element => {
  return (
    <DashboardLayout current="departments">
      <DepartmentIndex />
    </DashboardLayout>
  );
};

export default requireNextAuth({
  redirectIfAuthenticated: false,
  redirectTo: '/login',
})(DepartmentsPage);
