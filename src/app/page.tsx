import ProjectList from "@/components/projectList/ProjectList";
import RowList from "@/components/rowList/RowList";

export default function Home({ searchParams }: { searchParams: { project: string } }) {
    return (
        <div>
            <ProjectList />
            <RowList projectId={Number(searchParams?.project)} />
        </div>
    );
}
