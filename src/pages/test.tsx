import {requireNextAuth, UserAccountDropdown, UserProfile, useSession} from "@roq/nextjs";
import {useEffect, useState} from "react";
import DashboardLayout from "../layout/dashboard.layout";
import {UserButton} from "@roq/ui-react/dist/features/auth/components/user-button";

function DashboardPage() {

    const [userProfiles, setUserProfiles] = useState([]);

    const notify = async () => {
        const res = await fetch('/api/test');
    }


    return (
        <DashboardLayout current="users">
                {/*<UserProfile className="w-80" />*/}


        </DashboardLayout>
    );
}

// export default DashboardPage;
export default requireNextAuth({
    redirectIfAuthenticated: false,
    redirectTo: "/login",
})(DashboardPage);
