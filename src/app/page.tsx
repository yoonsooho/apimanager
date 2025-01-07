import ProjectList from "@/components/projectList/ProjectList";
import RowList from "@/components/rowList/RowList";

export default function Home() {
    return (
        <div className="p-2">
            <ProjectList />
            <RowList />
        </div>
    );
}
