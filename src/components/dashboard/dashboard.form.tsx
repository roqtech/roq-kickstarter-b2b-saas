import {ErrorMessage, Field, Form, Formik} from 'formik';
import {carSchema} from '../validation/car.schema';

interface DashboardFormProps {
    handleTouch: () => void;
}

const DashboardForm = ({handleTouch}: DashboardFormProps): JSX.Element => {
    const save = async (values: any, {resetForm}: any) => {
        try {
            const response = await fetch('/api/cars', {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify(values),
            });
            handleTouch();
            resetForm();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1 className="text-2xl">Add a car!</h1>

            <Formik initialValues={{name: '', price: ''}} validationSchema={carSchema} onSubmit={save}>
                <Form className="form-control">
                    <label className="label" htmlFor="name">
                        <span className="label-text">Name of car:</span>
                    </label>
                    <Field
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Type here"
                        className="input input-bordered input-primary w-full max-w-xs"
                    />

                    <ErrorMessage name="name" component="div" className="text-red-500"/>

                    <label className="label" htmlFor="name">
                        <span className="label-text">Price:</span>
                    </label>

                    <Field
                        type="text"
                        id="price"
                        name="price"
                        placeholder="Type here"
                        className="input input-bordered input-primary w-full max-w-xs"
                    />

                    <ErrorMessage name="price" component="div" className="text-red-500"/>

                    <button type="submit" className="btn btn-sm mt-4 w-20">
                        Submit
                    </button>
                </Form>
            </Formik>
        </div>
    );
};

export default DashboardForm;
