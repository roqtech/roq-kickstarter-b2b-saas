import {useEffect, useState} from "react";
import {TrashIcon} from "@heroicons/react/24/outline";
import { Employee } from "@prisma/client";


export interface Project {
  id: number;
  salary: number;
  employee?: Employee
}


interface PayrollListProps {
    refetch(): void
    data: Project[]
    isLoading?: boolean
}

function PayrollList({ data, refetch }: PayrollListProps): JSX.Element {
    const handleDeleteitem = async (id: number) => {
        try {
            const response = await fetch('/api/projects?id='+id, {
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
                        <th>{item.employee?.email}</th>
                        <td>{item.salary}</td>
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

export default PayrollList;
