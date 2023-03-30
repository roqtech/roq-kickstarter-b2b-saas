import {useEffect, useState} from "react";
import {TrashIcon} from "@heroicons/react/24/outline";

export interface Project {
    id: number;
    name: string;
    roqUserId: number;
}


interface ProjectListProps {
    refetch(): void
    data: Project[]
    isLoading?: boolean
}

function ProjectList({ data, refetch }: ProjectListProps): JSX.Element {
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
                    <th></th>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={item.id}>
                        <th>{item.id}</th>
                        <td>{item.name}</td>
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

export default ProjectList;
