import { useState } from 'react';
import DashboardList from './dashboard.list';
import DashboardForm from './dashboard.form';

const DashboardIndex = (): JSX.Element => {
    const [touch, setTouch] = useState<number>(0);

    const handleTouch = () => {
        setTouch((touch) => touch + 1);
    };

    return (
        <div>
            Dashboard
        </div>
    );
};

export default DashboardIndex;
