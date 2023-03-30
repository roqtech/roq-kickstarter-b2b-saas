import { useState } from 'react';
import WorkspaceList from './workspace.list';
import WorkspaceForm from './workspace.form';

const WorkspaceIndex = (): JSX.Element => {
    const [touch, setTouch] = useState<number>(0);

    const handleTouch = () => {
        setTouch((touch) => touch + 1);
    };

    return (
        <div>
            <WorkspaceForm handleTouch={handleTouch} />
            <WorkspaceList handleTouch={handleTouch} touch={touch} />
        </div>
    );
};

export default WorkspaceIndex;
