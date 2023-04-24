import { requireNextAuth } from '@roq/nextjs';
import DashboardLayout from '../layout/dashboard.layout';
import LeaveRequestsIndex from '../components/leave-requests/leave-request.index';

const LeaveRequestsPage = (): JSX.Element => {
  return (
    <DashboardLayout current="leave-requests">
      <LeaveRequestsIndex />
    </DashboardLayout>
  );
};

export default requireNextAuth({
  redirectIfAuthenticated: false,
  redirectTo: '/login',
})(LeaveRequestsPage);
