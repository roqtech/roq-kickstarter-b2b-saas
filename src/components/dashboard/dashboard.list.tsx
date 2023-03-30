import {useEffect, useState} from "react";
import {TrashIcon} from "@heroicons/react/24/outline";

interface Car {
    id: number;
    name: string;
    roqUserId: number;
}

interface UserProfile {
    id: number;
    firstName: string;
    lastName: string;
}

interface DashboardListProps {
    handleTouch: () => void;
    touch: number;
}

function DashboardList({handleTouch, touch}: DashboardListProps): JSX.Element {
    const [cars, setCars] = useState<Car[]>([]);
    const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);

    useEffect(() => {
        // async function fetchCars() {
        //     const res = await fetch('/api/cars');
        //     const json = await res.json();
        //     setCars(json.result.cars);
        //     if (json.result.users.userProfiles) {
        //         setUserProfiles(json.result.users.userProfiles.data);
        //     }
        // }

        // fetchCars();
    }, [touch]);

    const handleDeleteCar = async (id: number) => {
        try {
            const response = await fetch('/api/cars?id='+id, {
                method: 'DELETE',
            });
            handleTouch();
        } catch (error) {
            console.error(error);
        }
    }

    const userProfile = (userId: number): UserProfile =>
        userProfiles.find((item) => item.id === userId);

    return (
        <div className="overflow-x-auto mt-20">
            <table className="table w-full">
                {/* head */}
                <thead>
                <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Created by</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {cars.map((car, index) => (
                    <tr key={car.id}>
                        <th>{car.id}</th>
                        <td>{car.name}</td>
                        <td>
                            {userProfile(car.roqUserId).firstName}{" "}
                            {userProfile(car.roqUserId).lastName}
                        </td>
                        <td>

                            <button className="btn btn-outline btn-sm gap-2" onClick={() => handleDeleteCar(car.id)}>
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

export default DashboardList;
