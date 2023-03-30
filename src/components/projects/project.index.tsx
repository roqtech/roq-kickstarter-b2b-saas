import { useState } from 'react';
import ProjectList from './project.list';
import ProjectForm from './project.form';
import useSWR, { Fetcher } from "swr";
import { fetcher } from 'library/fetcher';

const ProjectIndex = (): JSX.Element => {
    const { data, mutate } = useSWR(
        '/api/projects',
        fetcher
      );

    return (
        <div>
            <ProjectForm refetch={() => mutate()} />
            <ProjectList refetch={() => mutate()} data={data?.data ?? []} />
        </div>
    );
};

export default ProjectIndex;
