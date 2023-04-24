import useSWR from "swr";
import { fetcher } from 'library/fetcher';
import { ErrorMessage, Field, Form, Formik, FormikValues, useFormik } from 'formik';
import { Fragment, useMemo, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import * as yup from "yup";

export const entitySchema = yup.object().shape({
  evaluatee_id: yup.string().max(32).required('Employee is required'),
  feedback: yup.string().required(),
  rating: yup.number().required(),
});

interface PerformanceEvaluationFormProps {
  refetch: () => void;
}

const PerformanceEvaluationForm = ({ refetch }: PerformanceEvaluationFormProps): JSX.Element => {
  const { data, mutate, isLoading } = useSWR(
    '/api/employees',
    fetcher
  );
  const [selected, setSelected] = useState<any>()
  const people = useMemo<any[]>(() => isLoading ? [] : data.data, [isLoading, data])

  const save = async (values: any, { resetForm, ...rest }: any) => {
    console.log('save -> values:', values)
    try {
      const response = await fetch('/api/performance-evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(values),
      });
      resetForm();
      setSelected(null)
      refetch();
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div>
      <h1 className="text-2xl">New Performance Evaluation</h1>
      <Formik initialValues={{ feedback: 'Good', rating: 5, evaluatee_id: undefined }} validationSchema={entitySchema} onSubmit={save}>
        {({ isSubmitting, errors }) => {
          return (

          <Form className="form-control">
            <label className="label" htmlFor="employee_id">
              <span className="label-text">Employee</span>
            </label>
            <Field name='employee_id' >
              {({ form }: { form: FormikValues }) => {
                return (
                  <Listbox disabled={isLoading} value={selected} onChange={(value) => {
                    setSelected(value)
                    form.setValues({
                      ...form.values,
                      evaluatee_id: value.id
                    })
                  }}>
                    <div className="relative mt-1">
                      <Listbox.Button className="max-w-xs h-9 relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                        {selected && <span className="block truncate">{selected?.email}</span>}
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="max-w-xs absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {people.map((person, personIdx) => (
                            <Listbox.Option
                              key={personIdx}
                              className={({ active }) =>
                                `relative max-w-xs cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                }`
                              }
                              value={person}
                            >
                              {({ selected }) => (
                                <>
                                  <span
                                    className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                      }`}
                                  >
                                    {person.email}
                                  </span>
                                  {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                )
              }}
            </Field>
            <ErrorMessage name="employee_id" component='div' className="text-red-500" />
            <label className="label" htmlFor="feedback">
              <span className="label-text">Feedback</span>
            </label>
            <Field
              id="feedback"
              name="feedback"
              className="input input-bordered input-primary w-full max-w-xs"
            />
            <ErrorMessage name="feedback" component='div' className="text-red-500" />
            <label className="label" htmlFor="rating">
              <span className="label-text">Rating</span>
            </label>
            <Field
              type="number"
              id="rating"
              name="rating"
              className="input input-bordered input-primary w-full max-w-xs"
            />
            <ErrorMessage name="rating" component='div' className="text-red-500" />

            <button type="submit" className="btn btn-sm mt-4 w-20" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )
        }}
      </Formik>
    </div>
  );
};

export default PerformanceEvaluationForm;
