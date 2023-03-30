import { requireNextAuth } from '@roq/nextjs';
import DashboardLayout from '../layout/dashboard.layout';
import ProjectsIndex from '../components/projects/project.index';

const ProjectsPage = (): JSX.Element => {
    return (
        <DashboardLayout current="projects">
            <ProjectsIndex />
        </DashboardLayout>
    );
};

export default requireNextAuth({
    redirectIfAuthenticated: false,
    redirectTo: '/login',
})(ProjectsPage);
