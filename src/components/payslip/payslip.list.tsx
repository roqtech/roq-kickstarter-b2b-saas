import { Fragment, useEffect, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import type { Department, Employee, Payroll, LeaveRequest, PerformanceEvaluation, Payslip } from "@prisma/client";

type PayrollData = Payroll & {
  employee: Employee
}

type PayslipData = Payslip & {
  payroll: PayrollData
}

interface LeaveRequestListProps {
  refetch(): void
  data: PayslipData[]
  isLoading?: boolean
}

function LeaveRequestList({ data, refetch }: LeaveRequestListProps): JSX.Element {
  const handleDeleteitem = async (id: number | string) => {
    try {
      const response = await fetch('/api/projects?id=' + id, {
        method: 'DELETE',
      });
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
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <th>{item.payroll?.employee?.email}</th>
              <td className="w-64">
                {JSON.stringify({
                  gross_salary: item.gross_salary,
                  net_salary: item.net_salary,
                  deductions: item.deductions,
                  bonuses: item.bonuses,
                }, null , 2)}
                {/* <div className="flex items-center">
                  <div className="mr-4">{item.employees?.length ?? 0}</div>
                  <div>{item.employees?.map(emp => <p key={emp.id}>{emp.email}</p>)}</div>
                </div> */}
              </td>
              <td>

                {/* <button className="btn btn-outline btn-sm gap-2" onClick={() => handleDeleteitem(item.id)}>
                  <TrashIcon
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                  Delete
                </button> */}

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaveRequestList;
