import useSWR from "swr";
import { fetcher } from 'library/fetcher';
import { ErrorMessage, Field, Form, Formik, FormikValues, useFormik } from 'formik';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import * as yup from "yup";
import { useSelectEmployee } from "hooks/use-select-employee";
import { useToastResponse } from "hooks/use-toast-response";

export const entitySchema = yup.object().shape({
  name: yup.string().max(32).required('Name is required'),
  department_manager_id: yup.string().max(32).required('Department manager is required'),
});

interface PayrollFormProps {
  refetch: () => void;
}

const PayrollForm = ({ refetch }: PayrollFormProps): JSX.Element => {
  const { data, mutate, isLoading } = useSWR(
    '/api/departments',
    fetcher
  );
  const toastRes = useToastResponse()
  let formRef = useRef<FormikValues>()
  const { renderSelect, selected: employeeSelected } = useSelectEmployee({ type: 'department-manager'})

  useEffect(() => {
    if (employeeSelected && formRef.current) {
      formRef.current.setValues({
        ...formRef.current.values,
        department_manager_id: employeeSelected.id,
      })
    }
  }, [employeeSelected])

  const save = async (values: any, { resetForm, ...rest }: any) => {
    console.log('save -> values:', values)
    try {
      const response = await fetch('/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(values),
      }).then(toastRes).catch(toastRes)
      resetForm();
      refetch();
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div>
      <h1 className="text-2xl">New Department</h1>
      <Formik initialValues={{ name: '', department_manager_id: '' }} validationSchema={entitySchema} onSubmit={save}>
        {({ isSubmitting, errors }) => {
          return (

            <Form className="form-control">
              <label className="label" htmlFor="department_manager_id">
                <span className="label-text">Department Manager</span>
              </label>
              <Field name='department_manager_id' >
                {({ form }: { form: FormikValues }) => {
                  formRef.current = form
                  return renderSelect
                }}
              </Field>
              <ErrorMessage name="department_manager_id" component='div' className="text-red-500" />
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
