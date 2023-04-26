import { Fragment, useCallback, useEffect, useState } from "react";
import dayjs from 'dayjs'
import { TrashIcon, CheckIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import type { Department, Employee, Payroll, LeaveRequest } from "@prisma/client";
import { useToastResponse } from "hooks/use-toast-response";

type LeaveRequestData = LeaveRequest & {
  employee: Employee
}

interface LeaveRequestListProps {
  refetch(): void
  data: LeaveRequestData[]
  isLoading?: boolean
}

function LeaveRequestList({ data, refetch }: LeaveRequestListProps): JSX.Element {
  const toastRes = useToastResponse()
  const handleApprove = async (id: number | string, currentStatus: string) => {
    try {
      const response = await fetch('/api/leave-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({
          id,
          status: currentStatus === 'Pending' ? 'Approve' : currentStatus === 'Approve' ? 'Close' : currentStatus === 'Close' ? 'Approve' : 'Pending'
        })
      }).then(toastRes).catch(toastRes)
      console.log(response);
      refetch()
    } catch (error) {
      console.error(error);
    }
  }

  const handleUpdate = async (id: number | string) => {
    try {
      const response = await fetch('/api/leave-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({
          id,
          end_date: dayjs().add(Math.ceil(Math.random()*10), 'day').toDate(),
        })
      }).then(toastRes).catch(toastRes)
      console.log(response);
      refetch()
    } catch (error) {
      console.error(error);
    }
  }

  const renderStatus = useCallback((status: string) => {
    switch (status) {
      case 'Pending': {
        return <>
          <CheckIcon
            className="h-6 w-6"
            aria-hidden="true"
          />
          Approve</>
      }
      case 'Approve': {
        return <>
          <LockClosedIcon
            className="h-6 w-6"
            aria-hidden="true"
          />
          Not approve</>
      }
      case 'Close': {
        return <>
          <CheckIcon
            className="h-6 w-6"
            aria-hidden="true"
          />
          Approve</>
      }
    }
  }, [])

  return (
    <div className="overflow-x-auto mt-20">
      <table className="table w-full">
        {/* head */}
        <thead>
          <tr>
            <th>Email</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <th>{item.employee?.email}</th>
              <td>{dayjs(item.end_date).format('DD/MM/YYYY')}
                <button className="ml-3 btn btn-outline btn-sm gap-2" onClick={() => handleUpdate(item.id)}>Extend</button>
              </td>
              <td className="w-64">
                {item.status}
                {/* <div className="flex items-center">
                  <div className="mr-4">{item.employees?.length ?? 0}</div>
                  <div>{item.employees?.map(emp => <p key={emp.id}>{emp.email}</p>)}</div>
                </div> */}
              </td>
              <td>
                <button className="btn btn-outline btn-sm gap-2" onClick={() => handleApprove(item.id, item.status)}>
                  {renderStatus(item.status)}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaveRequestList;
