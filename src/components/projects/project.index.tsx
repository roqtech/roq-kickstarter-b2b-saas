import { useState } from 'react';
import ProjectList from './project.list';
import ProjectForm from './project.form';

const ProjectIndex = (): JSX.Element => {
    const [touch, setTouch] = useState<number>(0);

    const handleTouch = () => {
        setTouch((touch) => touch + 1);
    };

    return (
        <div>
            <ProjectForm handleTouch={handleTouch} />
            <ProjectList handleTouch={handleTouch} touch={touch} />
        </div>
    );
};

export default ProjectIndex;
