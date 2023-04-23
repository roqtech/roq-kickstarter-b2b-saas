import useSWR from "swr";
import { fetcher } from 'library/fetcher';
import { ErrorMessage, Field, Form, Formik, FormikValues, useFormik } from 'formik';
import { Fragment, useMemo, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import * as yup from "yup";

export const entitySchema = yup.object().shape({
  name: yup.string().max(32).required('Name is required'),
});

interface PayrollFormProps {
  refetch: () => void;
}

const PayrollForm = ({ refetch }: PayrollFormProps): JSX.Element => {
  const { data, mutate, isLoading } = useSWR(
    '/api/departments',
    fetcher
  );

  const save = async (values: any, { resetForm, ...rest }: any) => {
    console.log('save -> values:', values)
    try {
      const response = await fetch('/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(values),
      });
      resetForm();
      refetch();
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div>
      <h1 className="text-2xl">New Department</h1>
      <Formik initialValues={{ name: '' }} validationSchema={entitySchema} onSubmit={save}>
        {({ isSubmitting, errors }) => {
          return (

          <Form className="form-control">
            <label className="label" htmlFor="name">
              <span className="label-text">Name</span>
            </label>
            <Field
              type="text"
              id="name"
              name="name"
              className="input input-bordered input-primary w-full max-w-xs"
            />
            <ErrorMessage name="name" component='div' className="text-red-500" />

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

export default PayrollForm;
