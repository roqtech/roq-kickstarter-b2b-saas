import useSWR from "swr";
import { fetcher } from 'library/fetcher';
import { ErrorMessage, Field, Form, Formik, FormikValues, useFormik } from 'formik';
import { Fragment, useMemo, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import * as yup from "yup";
import { Employee, Payroll, Payslip } from "@prisma/client";

export const entitySchema = yup.object().shape({
  payroll_id: yup.string().max(32).required('Payroll is required'),
  gross_salary: yup.number().required(),
  net_salary: yup.number().required(),
});

interface PayslipFormProps {
  refetch: () => void;
}

type PayrollData = Payroll & {
  employee: Employee
}


const PayslipForm = ({ refetch }: PayslipFormProps): JSX.Element => {
  const { data, mutate, isLoading } = useSWR(
    '/api/payrolls',
    fetcher
  );
  const [selected, setSelected] = useState<any>()
  const payrolls = useMemo<PayrollData[]>(() => isLoading ? [] : data.data, [isLoading, data])

  const save = async (values: any, { resetForm, ...rest }: any) => {
    console.log('save -> values:', values)
    try {
      const response = await fetch('/api/payslips', {
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
      <h1 className="text-2xl">New Payslip</h1>
      <Formik initialValues={{ payroll_id: null, gross_salary: 10, net_salary: 8 }} validationSchema={entitySchema} onSubmit={save}>
        {({ isSubmitting, errors }) => {
          return (

          <Form className="form-control">
            <label className="label" htmlFor="payroll_id">
              <span className="label-text">Employee</span>
            </label>
            <Field name='payroll_id' >
              {({ form }: { form: FormikValues }) => {
                return (
                  <Listbox disabled={isLoading} value={selected} onChange={(value) => {
                    setSelected(value)
                    form.setValues({
                      ...form.values,
                      payroll_id: value.id
                    })
                  }}>
                    <div className="relative mt-1">
                      <Listbox.Button className="max-w-lg h-9 relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                        {selected && <span className="block truncate">{selected?.id}|{selected.employee?.email}</span>}
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
                        <Listbox.Options className="max-w-lg absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {payrolls.map((payroll, personIdx) => (
                            <Listbox.Option
                              key={personIdx}
                              className={({ active }) =>
                                `relative max-w-lg cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                }`
                              }
                              value={payroll}
                            >
                              {({ selected }) => (
                                <>
                                  <span
                                    className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                      }`}
                                  >
                                    {payroll.id}|{payroll.employee?.email}
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
            <ErrorMessage name="payroll_id" component='div' className="text-red-500" />
            <label className="label" htmlFor="gross_salary">
              <span className="label-text">Gross Salary</span>
            </label>
            <Field
              id="gross_salary"
              name="gross_salary"
              className="input input-bordered input-primary w-full max-w-xs"
            />
            <ErrorMessage name="feedback" component='div' className="text-red-500" />
            <label className="label" htmlFor="net_salary">
              <span className="label-text">Net Salary</span>
            </label>
            <Field
              type="number"
              id="net_salary"
              name="net_salary"
              className="input input-bordered input-primary w-full max-w-xs"
            />
            <ErrorMessage name="net_salary" component='div' className="text-red-500" />

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

export default PayslipForm;
