import { useState } from 'react';
import useSWR, { Fetcher } from "swr";
import { fetcher } from 'library/fetcher';

const PaySlipIndex = (): JSX.Element => {
    const { data, mutate } = useSWR(
        '/api/payslips',
        fetcher
      );
    console.log('PaySlipIndex -> data:', data)

    return (
        <div>

        </div>
    );
};

export default PaySlipIndex;
