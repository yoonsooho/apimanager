import ProjectList from "@/components/projectList/ProjectList";
import RowList from "@/components/rowList/RowList";
import { Suspense } from "react";

export default async function Home({ searchParams }: { searchParams: { project: string } }) {
    const projectId = searchParams.project;
    return (
        <div className="p-2">
            <Suspense fallback={<div>Loading...</div>}>
                <ProjectList />
                {projectId && <RowList />}
            </Suspense>
        </div>
    );
}
