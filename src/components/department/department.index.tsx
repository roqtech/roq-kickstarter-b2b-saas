import { useState } from 'react';
import useSWR, { Fetcher } from "swr";
import { fetcher } from 'library/fetcher';
import DepartmentForm from './department.form';
import DepartmentList from './department.list';

const DepartmentIndex = (): JSX.Element => {
    const { data, mutate } = useSWR(
        '/api/departments',
        fetcher
      );

    return (
        <div>
          <DepartmentForm refetch={() => mutate()} />
          <DepartmentList refetch={() => mutate()} data={data?.departments ?? []} />
        </div>
    );
};

export default DepartmentIndex;
