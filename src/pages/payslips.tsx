import { requireNextAuth } from '@roq/nextjs';
import DashboardLayout from '../layout/dashboard.layout';
import PayslipsIndex from '../components/payslip/payslip.index';

const PayslipsPage = (): JSX.Element => {
  return (
    <DashboardLayout current="payslips">
      <PayslipsIndex />
    </DashboardLayout>
  );
};

export default requireNextAuth({
  redirectIfAuthenticated: false,
  redirectTo: '/login',
})(PayslipsPage);
