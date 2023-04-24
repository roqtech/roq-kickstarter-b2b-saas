import { requireNextAuth } from '@roq/nextjs';
import DashboardLayout from '../layout/dashboard.layout';
import PayrollsIndex from '../components/payroll/payroll.index';

const PayrollsPage = (): JSX.Element => {
  return (
    <DashboardLayout current="payrolls">
      <PayrollsIndex />
    </DashboardLayout>
  );
};

export default requireNextAuth({
  redirectIfAuthenticated: false,
  redirectTo: '/login',
})(PayrollsPage);
