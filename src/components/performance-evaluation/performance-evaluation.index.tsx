import { useState } from 'react';
import useSWR, { Fetcher } from "swr";
import { fetcher } from 'library/fetcher';
import PerformanceEvaluationForm from './performance-evaluation.form';
import PerformanceEvaluationList from './performance-evaluation.list';

const PerformanceEvaluationIndex = (): JSX.Element => {
  const { data, mutate } = useSWR(
    '/api/performance-evaluations',
    fetcher
  );
  console.log('PerformanceEvaluationIndex -> data:', data)

  return (
    <div>
      <PerformanceEvaluationForm refetch={() => mutate()} />
      <PerformanceEvaluationList refetch={() => mutate()} data={data?.data ?? []} />
    </div>
  );
};

export default PerformanceEvaluationIndex;
