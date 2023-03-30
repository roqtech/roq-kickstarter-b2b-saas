import WorkspaceList from './workspace.list';
import WorkspaceForm from './workspace.form';
import useSWR from "swr";
import { fetcher } from 'library/fetcher';

const WorkspaceIndex = (): JSX.Element => {
    const { data, mutate } = useSWR(
        '/api/workspaces',
        fetcher
      );
    

    return (
        <div>
            <WorkspaceForm refetch={() => mutate()} />
            <WorkspaceList data={data?.data ?? []} refetch={() => mutate()} />
        </div>
    );
};

export default WorkspaceIndex;
