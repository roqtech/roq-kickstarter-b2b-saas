import { useState } from 'react';
import useSWR, { Fetcher } from "swr";
import { fetcher } from 'library/fetcher';
import PayslipList from './payslip.list';
import PayslipForm from './payslip.form';

const PaySlipIndex = (): JSX.Element => {
    const { data, mutate } = useSWR(
        '/api/payslips',
        fetcher
      );
    console.log('PaySlipIndex -> data:', data)

    return (
        <div>
          <PayslipForm refetch={() => mutate()} />
          <PayslipList refetch={() => mutate()} data={data?.data ?? []} />
        </div>
    );
};

export default PaySlipIndex;
