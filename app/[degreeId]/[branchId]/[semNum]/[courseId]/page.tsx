import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { db } from "@/db/drizzle";
import { branchCourse, branches } from "@/db/schema";
import { eq } from "drizzle-orm";
import { BookCopy, BookOpenCheck } from "lucide-react";
import Link from "next/link";


export async function generateStaticParams() {
    const data= await db.select({
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
    } )

    console.log(data)
    return data
}


export default async function Page ({params}: {params: {
    degreeId: number,
    branchId: number,
    semNum: number,
    courseId: string,
}}) {

    return (
        <div>
            <div className="font-semibold text-4xl flex justify-center items-center w-screen p-10">
                {params.courseId}
            </div>

            <div className="flex flex-col gap-5 w-4/5 justify-center items-center mx-auto">                
                    <Card className="pt-5 w-full">
                        <Link href={`/${params.degreeId}/${params.branchId}/${params.semNum}/${params.courseId}/pyqs`}>
                            <CardContent>
                                <CardTitle className=" flex justify-between">
                                    PYQs
                                    <BookOpenCheck size={30} />
                                </CardTitle>
                                <CardDescription>
                                    Get the previous year questions for this course.
                                </CardDescription>
                            </CardContent>
                        </Link> 
                    </Card>
                

                    <Card className="pt-5 w-full">
                        <Link href={`/${params.degreeId}/${params.branchId}/${params.semNum}/${params.courseId}/books`}>
                            <CardContent>
                                <CardTitle className=" flex justify-between">
                                    Books
                                    <BookCopy size={30} />
                                </CardTitle>
                                <CardDescription>
                                    Get the relevant books for this course.
                                </CardDescription>
                            </CardContent>
                        </Link>
                    </Card>
            </div>
        </div>
    )
}