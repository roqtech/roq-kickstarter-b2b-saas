import { requireNextAuth } from '@roq/nextjs';
import DashboardLayout from '../layout/dashboard.layout';
import WorkspaceIndex from '../components/workspace/workspace.index';

const WorkspacePage = (): JSX.Element => {
    return (
        <DashboardLayout current="workspaces">
            <WorkspaceIndex />
        </DashboardLayout>
    );
};

export default requireNextAuth({
    redirectIfAuthenticated: false,
    redirectTo: '/login',
})(WorkspacePage);
