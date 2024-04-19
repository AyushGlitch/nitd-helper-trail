import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db/drizzle";
import { degrees } from "@/db/schema";
import Link from "next/link";


async function getDegrees() {
  try{
    const degreesList= await db.select().from(degrees)
    return degreesList
  }
  catch(err) {
    console.log(err)
  }
}


export default async function Home() {

  const degrees= await getDegrees()
  console.log(degrees)

  return (
    <div className=" h-screen w-screen flex flex-col items-center justify-center gap-16 ">
      <div className="flex flex-col items-center justify-center gap-10">
        <div className="text-6xl font-extrabold mx-auto">
          NITD - HELPER
        </div>
        <div className="text-2xl font-medium">
          Find all the resources you need to get through your college life.
        </div>
      </div>

      <div className="flex gap-5 justify-evenly items-center">
        { degrees && degrees.map( (degree) => (
          <Link href={`/${degree.degreeId}`} key={degree.degreeId}>
            <Card className="w-60 pt-5 h-32">
              <CardContent>
                <CardTitle>
                  {degree.degreeName?.toUpperCase()}
                </CardTitle>
              </CardContent>

              <CardFooter>
                <CardDescription className=" text-lg">
                  Num of Semesters: {degree.numOfSems}
                </CardDescription>
              </CardFooter>
            </Card>
          </Link>
        ) )}
      </div>
    </div>
  );
}
