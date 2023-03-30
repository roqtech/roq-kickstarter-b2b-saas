import {useEffect, useState} from "react";
import {TrashIcon} from "@heroicons/react/24/outline";

interface TestFlight {
    id: number;
    name: string;
    roqUserId: number;
}

interface UserProfile {
    id: number;
    firstName: string;
    lastName: string;
}

interface TestFlightListProps {
    handleTouch: () => void;
    touch: number;
}

function TestFlightList({handleTouch, touch}: TestFlightListProps): JSX.Element {
    const [data, setData] = useState<TestFlight[]>([]);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch('/api/testflights');
            const response = await res.json();
            setData(response.data);
        }

        fetchData();
    }, [touch]);

    const handleDeleteitem = async (id: number) => {
        try {
            const response = await fetch('/api/testflights?id='+id, {
                method: 'DELETE',
            });
            handleTouch();
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

export default TestFlightList;
