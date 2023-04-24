import { useState } from 'react';
import useSWR, { Fetcher } from "swr";
import { fetcher } from 'library/fetcher';
// import EmployeeForm from './Employee.form';
import EmployeeList from './employee.list';

const EmployeeIndex = (): JSX.Element => {
    const { data, mutate } = useSWR(
        '/api/employees',
        fetcher
      );
    console.log('EmployeeIndex -> data:', data)

    return (
        <div>
          {/* <EmployeeForm refetch={() => mutate()} /> */}
          <EmployeeList refetch={() => mutate()} data={data?.data ?? []} />
        </div>
    );
};

export default EmployeeIndex;
