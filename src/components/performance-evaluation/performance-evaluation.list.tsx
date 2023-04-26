import { Fragment, useEffect, useState } from "react";
import { TrashIcon, CheckIcon } from "@heroicons/react/24/outline";
import type { Department, Employee, Payroll, LeaveRequest, PerformanceEvaluation } from "@prisma/client";
import { useToastResponse } from "hooks/use-toast-response";

type PerformanceEvaluationData = PerformanceEvaluation & {
  evaluatee: Employee
}

interface LeaveRequestListProps {
  refetch(): void
  data: PerformanceEvaluationData[]
  isLoading?: boolean
}

function LeaveRequestList({ data, refetch }: LeaveRequestListProps): JSX.Element {

  const toastRes = useToastResponse()
  const handleUpdate = async (id: number | string) => {
    try {
      const response = await fetch('/api/performance-evaluations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ id }),
      }).then(toastRes).catch(toastRes);
      refetch()
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="overflow-x-auto mt-20">
      <table className="table w-full">
        {/* head */}
        <thead>
          <tr>
            <th>Email</th>
            <th>Evaluation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <th>{item.evaluatee?.email}</th>
              <td className="w-64">
                {JSON.stringify({
                  feedback: item.feedback,
                  rating: item.rating,
                })}
                {/* <div className="flex items-center">
                  <div className="mr-4">{item.employees?.length ?? 0}</div>
                  <div>{item.employees?.map(emp => <p key={emp.id}>{emp.email}</p>)}</div>
                </div> */}
              </td>
              <td>

                <button className="btn btn-outline btn-sm gap-2" onClick={() => handleUpdate(item.id)}>
                  <CheckIcon
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                  Update
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
