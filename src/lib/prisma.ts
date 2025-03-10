// import { PrismaClient } from '@prisma/client'

// let prisma: PrismaClient

// declare global {
//     // eslint-disable-next-line no-var
//     var prisma: PrismaClient | undefined
// }

// if (process.env.NODE_ENV === 'production') {
//     prisma = new PrismaClient()
// } else {
//     if (!global.prisma) {
//         global.prisma = new PrismaClient()
//     }
//     prisma = global.prisma
// }

// export default prisma
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma
