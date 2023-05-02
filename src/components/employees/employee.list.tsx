import { Fragment, useEffect, useMemo, useState } from "react";
import useSWR, { Fetcher } from "swr";
import { fetcher } from 'library/fetcher';
import { TrashIcon } from "@heroicons/react/24/outline";
import type { Department, Employee, Payroll } from "@prisma/client";
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useToastResponse } from "hooks/use-toast-response";

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
  const { data: depData, mutate } = useSWR(
    '/api/departments',
    fetcher
  );
  const toastRes = useToastResponse()
  const departments = useMemo<Department[]>(() => depData?.departments ?? [], [depData])

  const handleChangeDep = async (values: any) => {
    try {
      const response = await fetch('/api/employees', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(values),
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
                <Listbox value={item.department} onChange={(value) => {
                  handleChangeDep({
                    employee_id: item.id,
                    department_id: value.id
                  })
                }}>
                  <div className="relative mt-1">
                    <Listbox.Button className="max-w-xs h-9 relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                      <span className="block truncate">{item.department?.name}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="z-10 max-w-xs absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {departments.map((dep, personIdx) => (
                          <Listbox.Option
                            key={personIdx}
                            className={({ active }) =>
                              `relative max-w-xs cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                              }`
                            }
                            value={dep}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                    }`}
                                >
                                  {dep.name}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;
