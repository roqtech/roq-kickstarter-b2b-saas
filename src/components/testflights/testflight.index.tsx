import { useState } from 'react';
import TestFlightList from './testflight.list';
import TestFlightForm from './testflight';

const TestFlightIndex = (): JSX.Element => {
    const [touch, setTouch] = useState<number>(0);

    const handleTouch = () => {
        setTouch((touch) => touch + 1);
    };

    return (
        <div>
            <TestFlightForm handleTouch={handleTouch} />
            <TestFlightList handleTouch={handleTouch} touch={touch} />
        </div>
    );
};

export default TestFlightIndex;
