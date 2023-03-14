import { requireNextAuth } from '@roq/nextjs';
import DashboardLayout from '../layout/dashboard.layout';
import DashboardIndex from '../components/dashboard/dashboard.index';

const DashboardPage = (): JSX.Element => {
    return (
        <DashboardLayout current="dashboard">
            <DashboardIndex />
        </DashboardLayout>
    );
};

export default requireNextAuth({
    redirectIfAuthenticated: false,
    redirectTo: '/login',
})(DashboardPage);
