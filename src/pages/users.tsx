import {requireNextAuth, UserInvitesTable, useSession} from "@roq/nextjs";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {useEffect, useState} from "react";
import DashboardLayout from "../layout/dashboard.layout";

function DashboardPage() {

    const [userProfiles, setUserProfiles] = useState([]);

    useEffect(() => {
        async function fetchMenus() {
            const res = await fetch('/api/users');
            const json = await res.json();
            setUserProfiles(json.result.users.userProfiles.data);
        }

        fetchMenus();
    }, []);

    const {session, status} = useSession();

    return (
        <DashboardLayout current="users">
            <div className="overflow-x-auto mt-20">

                <div className="text-xl mb-4">List all users of the organization</div>
                <table className="table w-full">
                    {/* head */}
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Tenant</th>
                    </tr>
                    </thead>
                    <tbody>
                    {userProfiles.map((user, index) => (
                        <tr>
                            <td>{user.firstName} {user.lastName}</td>
                            <td>{user.tenantId}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}

// export default DashboardPage;
export default requireNextAuth({
    redirectIfAuthenticated: false,
    redirectTo: "/login",
})(DashboardPage);
