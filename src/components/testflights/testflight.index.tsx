import { useState } from 'react';
import TestFlightList from './testflight.list';
import TestFlightForm from './testflight';
import useSWR from "swr";
import { fetcher } from 'library/fetcher';

const TestFlightIndex = (): JSX.Element => {
    const { data, mutate } = useSWR(
        '/api/testflights',
        fetcher
      );
    const refetch = () => mutate()
    return (
        <div>
            <TestFlightForm refetch={refetch} />
            <TestFlightList refetch={refetch} data={data?.data ?? []} />
        </div>
    );
};

export default TestFlightIndex;
