import { entitySchema } from 'components/validation/entity.schema';
import {ErrorMessage, Field, Form, Formik} from 'formik';

interface ProjectFormProps {
    handleTouch: () => void;
}

const ProjectForm = ({handleTouch}: ProjectFormProps): JSX.Element => {
    const save = async (values: any, {resetForm}: any) => {
        try {
            const response = await fetch('/api/projects', {
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
            <h1 className="text-2xl">New Project</h1>

            <Formik initialValues={{name: ''}} validationSchema={entitySchema} onSubmit={save}>
                <Form className="form-control">
                    <label className="label" htmlFor="name">
                        <span className="label-text">Name</span>
                    </label>
                    <Field
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Type here"
                        className="input input-bordered input-primary w-full max-w-xs"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500"/>

                    <button type="submit" className="btn btn-sm mt-4 w-20">
                        Submit
                    </button>
                </Form>
            </Formik>
        </div>
    );
};

export default ProjectForm;
