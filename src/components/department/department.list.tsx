import { Fragment, useEffect, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import type { Department, Employee } from "@prisma/client";
import { useToastResponse } from "hooks/use-toast-response";
import { useSelectEmployee } from "hooks/use-select-employee";


type DepartmentData = Department & {
  employees: Employee[]
  department_manager: Employee
}

interface DepartmentListProps {
  refetch(): void
  data: DepartmentData[]
  isLoading?: boolean
}

function DepartmentList({ data, refetch }: DepartmentListProps): JSX.Element {

  const { renderSelect, selected: employeeSelected } = useSelectEmployee({ type: 'department-manager' })
  const toastRes = useToastResponse()
  const handleDelete = async (id: number | string) => {
    try {
      const response = await fetch('/api/departments', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      }).then(toastRes).catch(toastRes)
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
            <th>Name</th>
            <th>Employees</th>
            <th>Manager</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <th>{item.name}</th>
              <td className="w-64">
                <div className="flex items-center">
                  <div className="mr-4">{item.employees?.length ?? 0}</div>
                  <div>{item.employees?.map(emp => <p key={emp.id}>{emp.email}</p>)}</div>
                </div>
              </td>
              <td>
                <div className="flex flex-col">
                  <p>{item.department_manager?.email ?? 'No department manager'}</p>
                  <div>
                    {renderSelect}
                  </div>
                </div>
              </td>
              <td>

                <button className="btn btn-outline btn-sm gap-2" onClick={() => handleDelete(item.id)}>
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

export default DepartmentList;
