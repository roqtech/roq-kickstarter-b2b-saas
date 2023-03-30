import { Project } from 'components/projects/project.list';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import { fetcher } from 'library/fetcher';
import useSWR, { Fetcher } from "swr";

interface WorkspaceFormProps {
    refetch: () => void;
}

const WorkspaceForm = ({refetch}: WorkspaceFormProps): JSX.Element => {
    const { data } = useSWR<{ data: Project[] }>(
        '/api/projects',
        fetcher
      );
    const save = async (values: any, {resetForm}: any) => {
        try {
            await fetch('/api/workspaces', {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify(values),
            });
            refetch();
            resetForm();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1 className="text-2xl">New Workspace</h1>

            <Formik initialValues={{name: ''}} onSubmit={save}>
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

                    <label className="label" htmlFor="projectId">
                        <span className="label-text">Project</span>
                    </label>
                    <Field as="select" id='projectId' name="projectId" className='select select-bordered select-primary w-full max-w-xs'>
                        <option key={'empty'} value=''>Select Project</option>
                        {data?.data?.map(project => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                    </Field>
                    <ErrorMessage name="projectId" component="div" className="text-red-500"/>

                    <button type="submit" className="btn btn-sm mt-4 w-20">
                        Submit
                    </button>
                </Form>
            </Formik>
        </div>
    );
};

export default WorkspaceForm;
