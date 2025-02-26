import prisma from "@/lib/prisma"

export const getCars = async () => {
    return await prisma.car.findMany()
}
