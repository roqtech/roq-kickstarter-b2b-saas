import {requireNextAuth, UserInvitesTable} from "@roq/nextjs";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {useEffect, useState} from "react";
import DashboardLayout from "../layout/dashboard.layout";

function DashboardPage() {
    return (
        <DashboardLayout current="userinvite">
            <UserInvitesTable style={{ background: "#FFF" }} />
        </DashboardLayout>
    );
}

// export default DashboardPage;
export default requireNextAuth({
    redirectIfAuthenticated: false,
    redirectTo: "/login",
})(DashboardPage);
