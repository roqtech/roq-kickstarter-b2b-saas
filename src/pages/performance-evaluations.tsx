import { requireNextAuth } from '@roq/nextjs';
import DashboardLayout from '../layout/dashboard.layout';
import PerformanceEvaluationIndex from '../components/performance-evaluation/performance-evaluation.index'

const PerformanceEvaluationsPage = (): JSX.Element => {
  return (
    <DashboardLayout current="performance-evaluations">
      <PerformanceEvaluationIndex />
    </DashboardLayout>
  );
};

export default requireNextAuth({
  redirectIfAuthenticated: false,
  redirectTo: '/login',
})(PerformanceEvaluationsPage);
