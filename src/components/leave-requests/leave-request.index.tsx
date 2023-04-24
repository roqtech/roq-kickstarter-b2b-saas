import { useState } from 'react';
import useSWR, { Fetcher } from "swr";
import { fetcher } from 'library/fetcher';
// import LeaveRequestForm from './LeaveRequest.form';
import LeaveRequestList from './leave-request.list';

const LeaveRequestIndex = (): JSX.Element => {
  const { data, mutate } = useSWR(
    '/api/leave-requests',
    fetcher
  );
  console.log('LeaveRequestIndex -> data:', data)

  const createLeave = async () => {
    try {
      const response = await fetch('/api/leave-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({}),
      });
      mutate()
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div>
      {/* <LeaveRequestForm refetch={() => mutate()} /> */}
      <button type="submit" className="btn btn-sm mt-4 w-20" onClick={createLeave}>
        Submit
      </button>
      <LeaveRequestList refetch={() => mutate()} data={data?.data ?? []} />
    </div>
  );
};

export default LeaveRequestIndex;
