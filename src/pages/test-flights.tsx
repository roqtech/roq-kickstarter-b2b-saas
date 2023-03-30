import { requireNextAuth } from '@roq/nextjs';
import DashboardLayout from '../layout/dashboard.layout';
import TestFlightIndex from '../components/testflights/testflight.index';

const TestFlightPage = (): JSX.Element => {
    return (
        <DashboardLayout current="test-flights">
            <TestFlightIndex />
        </DashboardLayout>
    );
};

export default requireNextAuth({
    redirectIfAuthenticated: false,
    redirectTo: '/login',
})(TestFlightPage);
