import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, primaryKey, serial, text } from "drizzle-orm/pg-core";


export const degrees= pgTable('degrees', {
    degreeId: serial("degreeId").primaryKey(),
    degreeName: text("degreeName"),
    numOfSems: integer("numOfSems"),
})


export const degreesBranchesRelation= relations(degrees, ({many}) => ({
    branches: many(branches)
}))


export const branches= pgTable("branches", {
    branchId: serial("branchId").primaryKey(),
    branchName: text("branchName"),
    degreeId: integer("degreeId"),
})


export const branchesRelation= relations(branches, ({one, many}) => ({
    degrees: one(degrees, {
        fields: [branches.degreeId],
        references: [degrees.degreeId],
    }),
    branchCourse: many(branchCourse)
}))


export const courses= pgTable("courses", {
    courseId: text("courseId").primaryKey(),
    courseName: text("courseName"),
})


export const coursesRelation= relations(courses, ({many}) => ({
    branchCourse: many(branchCourse)
}))


export const branchCourse= pgTable("branchCourse", {
    branchId: integer("branchId"),
    courseId: text("courseId"),
    semester: integer("semester"),
}, (table) => {
    return {
        pk: primaryKey({columns: [table.branchId, table.courseId]})
    }
})


export const branchCourseRelation= relations(branchCourse, ({one, many}) => ({
    branches: one(branches, {
        fields: [branchCourse.branchId],
        references: [branches.branchId]
    }),
    courses: one(courses, {
        fields: [branchCourse.courseId],
        references: [courses.courseId]
    }),
    pyqs: many(pyqs)
}))


export const pyqs= pgTable("pyqs", {
    paperId: serial("paperId").primaryKey(),
    courseId: text("courseId"),
    branchId: integer("branchId"),
    academicYear: text("academicYear"),
    semester: integer("semester"),
    endSem: boolean("endSem"),
    pdfUrl: text("pdfUrl"),
})


export const pyqsRelation= relations(pyqs, ({one}) => ({
    branchCourse: one(branchCourse, {
        fields: [pyqs.branchId, pyqs.courseId],
        references: [branchCourse.branchId, branchCourse.courseId]
    })
}))