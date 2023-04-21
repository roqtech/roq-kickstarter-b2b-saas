import { useState } from 'react';
import useSWR, { Fetcher } from "swr";
import { fetcher } from 'library/fetcher';
import PayrollForm from './payroll.form';
import PayrollList from './payroll.list';

const PayrollIndex = (): JSX.Element => {
    const { data, mutate } = useSWR(
        '/api/payrolls',
        fetcher
      );
    console.log('PayrollIndex -> data:', data)

    return (
        <div>
          <PayrollForm refetch={() => mutate()} />
          <PayrollList refetch={() => mutate()} data={data?.data ?? []} />
        </div>
    );
};

export default PayrollIndex;
