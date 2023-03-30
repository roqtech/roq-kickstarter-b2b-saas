import {ErrorMessage, Field, Form, Formik} from 'formik';
import { fetcher } from 'library/fetcher';
import useSWR from "swr";
import { Workspace } from 'components/workspace/workspace.list';

interface TestFlightFormProps {
    refetch: () => void;
}

const TestFlightForm = ({refetch}: TestFlightFormProps): JSX.Element => {
    const { data } = useSWR<{ data: Workspace[] }>(
        '/api/workspaces',
        fetcher
      );
    const save = async (values: any, {resetForm}: any) => {
        try {
            await fetch('/api/testflights', {
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
            <h1 className="text-2xl">New TestFlight</h1>

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

                    <label className="label" htmlFor="workspaceId">
                        <span className="label-text">Workspace</span>
                    </label>
                    <Field as="select" name="workspaceId" id="workspaceId" className='select select-bordered select-primary w-full max-w-xs'>
                        <option key={'empty'} value=''>Select Workspace</option>
                        {data?.data.map(option => (
                            <option key={option.id} value={option.id}>{option.name}</option>
                        ))}
                    </Field>
                    <ErrorMessage name="workspaceId" component="div" className="text-red-500"/>

                    <button type="submit" className="btn btn-sm mt-4 w-20">
                        Submit
                    </button>
                </Form>
            </Formik>
        </div>
    );
};

export default TestFlightForm;
