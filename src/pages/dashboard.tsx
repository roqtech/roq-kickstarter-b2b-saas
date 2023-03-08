import {requireNextAuth} from "@roq/nextjs";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {useEffect, useState} from "react";
import {menuValidation} from "../components/validation/menu.validation";
import DashboardLayout from "../layout/dashboard.layout";

function DashboardPage() {

    const [touch, setTouch] = useState(0);
    const [menus, setMenus] = useState([]);
    const [userProfiles, setUserProfiles] = useState([]);

    useEffect(() => {
        async function fetchMenus() {
            const res = await fetch('/api/menus');
            const json = await res.json();
            setMenus(json.result.menus);
            setUserProfiles(json.result.users.userProfiles.data);
        }

        fetchMenus();
    }, [touch]);

    const userProfile = ((userId: string) => userProfiles.find((item: { id: string; }) => item.id === userId));

    return (
        <DashboardLayout current="dashboard">
            <div>
                <div>
                    <h1 className="text-2xl">Add a menu!</h1>

                    <Formik
                        initialValues={{
                            name: ''
                        }}
                        validationSchema={menuValidation}

                        onSubmit={async (values, {resetForm, setSubmitting}) => {

                            try {
                                const response = await fetch('/api/savemenu', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(values),
                                });
                                const newMenu = await response.json();
                                setTouch(touch + 1);
                                resetForm();
                            } catch (error) {
                                console.error(error);
                            }

                        }}
                    >
                        <Form className="form-control">
                            <label className="label" htmlFor="name">
                                <span className="label-text">Name of menu:</span>
                            </label>
                            <Field type="text"
                                   id="name"
                                   name="name"
                                   placeholder="Type here"
                                   className="input input-bordered input-primary w-full max-w-xs"/>

                            <ErrorMessage name="name" component="div" className="text-red-500"/>

                            <button type="submit" className="btn btn-sm mt-4 w-20">Submit</button>
                        </Form>
                    </Formik>

                </div>

                {/*Show menus*/}
                <div className="overflow-x-auto mt-20">
                    <table className="table w-full">
                        {/* head */}
                        <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Created by</th>
                        </tr>
                        </thead>
                        <tbody>
                        {menus.map((menu, index) => (
                            <tr>
                                <th>{menu.id}</th>
                                <td>{menu.name}</td>
                                <td>
                                    {userProfile(menu.roqUserId).firstName} {userProfile(menu.roqUserId).lastName}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}

// export default DashboardPage;
export default requireNextAuth({
    redirectIfAuthenticated: false,
    redirectTo: "/login",
})(DashboardPage);
