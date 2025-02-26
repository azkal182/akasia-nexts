import { Car, PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient()

const main = async () => {
    const cars = [
        {
            name: "INOVA",
            licensePlate: "HGHDG",
            status: "AVAILABLE"
        },
        {
            name: "L300",
            licensePlate: "JJHK",
            status: "AVAILABLE"
        },
        {
            name: "KIJANG MERAH",
            licensePlate: "KJDJD",
            status: "AVAILABLE"
        }
    ]

    // await prisma.car.createMany({
    //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //     // @ts-ignore
    //     data: cars
    // })

    await prisma.user.create({
        data: {
            name: "admin",
            username: "admin",
            password: hashSync("admin")
        }
    })
}

main()
    .then(() => console.log('create cars successful'))
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
