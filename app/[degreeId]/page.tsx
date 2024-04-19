import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { db } from "@/db/drizzle"
import { branches, degrees } from "@/db/schema"
import { eq } from "drizzle-orm"
import Link from "next/link"


export async function generateStaticParams() {
    const degreeIds= await db.select({degreeId: degrees.degreeId}).from(degrees)
    degreeIds.forEach(degree => {
        //@ts-ignore
        degree.degreeId = degree.degreeId.toString();
    });
    console.log(degreeIds)
    return degreeIds
}

async function getBranches(degreeId: number) {
    try {
        const branchesList = await db.select().from(branches).where(eq(branches.degreeId, degreeId))
        return branchesList
    }
    catch(err) {
        console.log("Error on /degreeId page", err)
    }   
}


export default async function Page ({params}: {params: {degreeId: string}}) {
    const degreeId= parseInt(params.degreeId)
    const branches= await getBranches(degreeId)
    console.log(branches)

    return (
        <div>
            <div className="font-semibold text-4xl flex justify-center items-center w-screen p-10">
                List of the Branches
            </div>

            <div className="grid grid-cols-2 gap-4 justify-items-center p-20">
                { branches && branches.map( (branch) => (
                    <Link href={`/${params.degreeId}/${branch.branchId}`} key={branch.branchId}>
                        <Card className="w-60 pt-5">
                            <CardContent>
                                <CardTitle>
                                    {branch.branchName?.toUpperCase()}
                                </CardTitle>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}