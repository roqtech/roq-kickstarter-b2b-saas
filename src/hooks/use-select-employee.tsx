import useSWR from "swr";
import { fetcher } from 'library/fetcher';
import { Fragment, useMemo, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

type Props = {
  type?: string
}

export const useSelectEmployee = (props?: Props) => {
  const type = props?.type || 'all'
  const { data, mutate, isLoading } = useSWR(
    `/api/employees?type=${type}`,
    fetcher
  );
  const [selected, setSelected] = useState<any>()
  const people = useMemo<any[]>(() => isLoading ? [] : data.data, [isLoading, data])

  const renderSelect = useMemo(() => (
    <Listbox disabled={isLoading} value={selected} onChange={(value) => {
      setSelected(value)
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
          <Listbox.Options className="z-10 max-w-xs absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
  ), [people, selected])

  return {
    selected,
    renderSelect,
  }
}
