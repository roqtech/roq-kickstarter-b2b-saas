import {requireNextAuth, useSession} from "@roq/nextjs";
import DashboardLayout from "../layout/dashboard.layout";
import useSWR from "swr";
import { fetcher } from "library/fetcher";

function UsersPage() {

    const { data } = useSWR<{ users: { data: any[] } }>(
        '/api/users',
        fetcher
      );

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
                    {data?.users.data?.map((user, index) => (
                        <tr key={user.id}>
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

// export default UsersPage;
export default requireNextAuth({
    redirectIfAuthenticated: false,
    redirectTo: "/login",
})(UsersPage);
