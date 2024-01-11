import CourseCard from "../coursecard/page";
export default async function LearnPage() {

    return (
        <div>
            <div className="p-10">
                <h2>Search by topics</h2>
                <CourseCard />
            </div>
        </div>
    );
}