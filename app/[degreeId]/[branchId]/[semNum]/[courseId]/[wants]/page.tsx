import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { db } from "@/db/drizzle";
import { branchCourse, branches, pyqs } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import Link from "next/link";


export async function generateStaticParams() {
    let data= await db.select({
                                degreeId: branches.degreeId,
                                branchId: branchCourse.branchId,
                                semNum: branchCourse.semester,
                                courseId: branchCourse.courseId
                            })
                            .from(branchCourse)
                            .innerJoin(branches, eq(branchCourse.branchId, branches.branchId))

    data.forEach( (singleData) => {
        //@ts-ignore
        singleData.degreeId= singleData.degreeId.toString();
        //@ts-ignore
        singleData.branchId= singleData.branchId.toString();
        //@ts-ignore
        singleData.semNum= singleData.semNum.toString();
        //@ts-ignore
        singleData.courseId= singleData.courseId.toString();
        //@ts-ignore
        singleData.wants= "pyqs"
    } )

    console.log(data)
    return data
}


async function getPyqs(courseId: string, branchId: number, semNum: number) {
    const pyqList= await db.select().from(pyqs).where(and(eq(pyqs.branchId, branchId),
                                                            eq(pyqs.courseId, courseId),
                                                            eq(pyqs.semester, semNum)
                                                        ))
                                                        .orderBy(desc(pyqs.academicYear))
    
    return pyqList
}


export default async function Page ({params}: {params: {
    degreeId: number,
    branchId: number,
    semNum: number,
    courseId: string,
    wants: string
}}) {

    let data;
    if (params.wants === "pyqs") {
        data= await getPyqs(params.courseId, params.branchId, params.semNum)
    }
    // else if (params.wants === "books") {
    //     // const data= await getBooks()

    //     console.log("Asked for books")
    //     return (
    //         <div className=" flex justify-center items-center font-bold text-4xl">
    //             Books Not Available Right Now
    //         </div>
    //     )
    // }

    console.log(data)

    return (
        <div>
            <div className="font-semibold text-4xl flex justify-center items-center w-screen p-10">
                PYQs for {params.courseId}
            </div>

            {
                data && data.map( (pyq, index) => (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-stretch p-20" key={index}>
                        <Card className="pt-5 w-full">
                            <Link href={`${pyq.pdfUrl}`} target="_blank">
                                <CardContent>
                                    <CardTitle className=" flex justify-between">
                                        { pyq.endSem ? "End Sem" : "Mid Sem" }
                                    </CardTitle>
                                    <CardDescription>
                                        <p>Semester: {pyq.semester}</p>
                                        <p>Academic Year: {pyq.academicYear}</p>
                                    </CardDescription>
                                </CardContent>
                            </Link> 
                        </Card>
                    </div>
                ) )
            }
        </div>
    )
}