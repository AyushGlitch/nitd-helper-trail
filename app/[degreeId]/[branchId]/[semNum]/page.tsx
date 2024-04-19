import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { db } from "@/db/drizzle"
import { branchCourse, branches, courses } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import Link from "next/link"


export async function generateStaticParams() {
    const branchIds= await db.select({degreeId: branches.degreeId, branchId: branches.branchId}).from(branches)
    branchIds.forEach(branch => {
        //@ts-ignore
        branch.degreeId = branch.degreeId.toString();
        //@ts-ignore
        branch.branchId = branch.branchId.toString();
    });

    let semNums: Object[] = []; 

    branchIds.forEach((branchId) => {
        //@ts-ignore
        if (branchId.degreeId === "1") {
            for (let i = 1; i <= 8; i++) {
                semNums.push({
                    degreeId: branchId.degreeId,
                    branchId: branchId.branchId,
                    semNum: `${i}`
                });
            }
        }
        //@ts-ignore
        else if (branchId.degreeId === "2") {
            for (let i = 1; i <= 4; i++) {
                semNums.push({
                    degreeId: branchId.degreeId,
                    branchId: branchId.branchId,
                    semNum: `${i}`
                });
            }
        }
        else {
            console.log("Idiot")
        }
    });
    console.log("SemNums: ", semNums)
    return semNums
}


async function getCourses(branchId: number, semNum: number) {
    try {
        const coursesList= await db.select()
                                    .from(branchCourse)
                                    .innerJoin(courses, eq(branchCourse.courseId, courses.courseId))
                                    .where(and(eq(branchCourse.branchId, branchId),
                                                eq(branchCourse.semester, semNum)
                                            ))

        return coursesList
    }

    catch (err) {
        console.log("Error on /degreeId/branchId/semNum page \n\n", err)
    }
}


export default async function Page ( {params} : {params: {
    degreeId: number,
    branchId: number,
    semNum: number,
}}) {

    const data= await getCourses(params.branchId, params.semNum)
    console.log(data)

    return (
        <div>
            <div className="font-semibold text-4xl flex justify-center items-center w-screen p-10">
                List of Courses / Subjects
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-stretch p-20">
                { data && data.map( (course, index) => (
                    <Link href={`/${params.degreeId}/${params.branchId}/${params.semNum}/${course.courses.courseId}`} key={index}>
                        <Card className="pt-5 w-full">
                            <CardContent>
                                <CardTitle>
                                    {course.courses.courseId}
                                </CardTitle>
                                <CardDescription>
                                    {course.courses.courseName}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>   
    )
}