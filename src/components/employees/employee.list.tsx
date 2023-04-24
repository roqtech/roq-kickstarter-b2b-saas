import { Fragment, useEffect, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import type { Department, Employee, Payroll } from "@prisma/client";

type EmployeeData = Employee & {
  department: Department
  payroll: Payroll[]
}

interface EmployeeListProps {
  refetch(): void
  data: EmployeeData[]
  isLoading?: boolean
}

function EmployeeList({ data, refetch }: EmployeeListProps): JSX.Element {
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
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <th>{item.email}</th>
              <td className="w-64">
                {item.department?.name}
                {/* <div className="flex items-center">
                  <div className="mr-4">{item.employees?.length ?? 0}</div>
                  <div>{item.employees?.map(emp => <p key={emp.id}>{emp.email}</p>)}</div>
                </div> */}
              </td>
              <td>

                <button className="btn btn-outline btn-sm gap-2" onClick={() => handleDeleteitem(item.id)}>
                  <TrashIcon
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                  Delete
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;
