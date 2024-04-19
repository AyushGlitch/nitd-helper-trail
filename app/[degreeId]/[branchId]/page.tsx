import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { db } from "@/db/drizzle"
import { branches, degrees, pyqs } from "@/db/schema"
import { eq } from "drizzle-orm"
import Link from "next/link"


export async function generateStaticParams() {
    const branchIds= await db.select({degreeId: branches.degreeId, branchId: branches.branchId}).from(branches)
    
    branchIds.forEach(branch => {
        //@ts-ignore
        branch.degreeId = branch.degreeId.toString();
        //@ts-ignore
        branch.branchId = branch.branchId.toString();
    });
    console.log(branchIds)
    
    return branchIds
}


async function getSemesters(degreeId: number) {
    try {
        const numOfSems= await db.select().from(degrees).where(eq(degrees.degreeId, degreeId))
        return numOfSems
    }
    catch(err) {
        console.log("Error on /degreeId/branchId page \n\n", err)
    }
}


export default async function Page({params} : {params: {
    degreeId: string,
    branchId: string,
}})  {

    const degreeId= parseInt(params.degreeId)
    const data= await getSemesters(degreeId)
    console.log(data)

    return (
        <div>
            <div className="font-semibold text-4xl flex justify-center items-center w-screen p-10">
                List of the Semesters
            </div>

            <div className="grid grid-cols-2 gap-4 justify-items-center pt-16 px-20">
                { 
                    data && data[0].numOfSems && Array.from({length: data[0].numOfSems}).map( (_, index) => (
                        <Link href={`/${params.degreeId}/${params.branchId}/${index+1}`} key={index}>
                            <Card className="w-60 pt-5">
                                <CardContent>
                                    <CardTitle>
                                        {`Semester ${index+1}`}
                                    </CardTitle>
                                    <CardDescription>
                                        { (index+1) % 2 == 0 ? "Spring Semester" : "Autumn Semester" }
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}