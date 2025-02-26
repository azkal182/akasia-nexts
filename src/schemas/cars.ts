import { CarStatus } from "@prisma/client";
import { z } from "zod";

export const CreateCarSchema = z.object({
    name: z.string(),
    licensePlate: z.string().optional().nullable(),
    status: z.nativeEnum(CarStatus)
})

export type CreateCarSchemaInput = z.infer<typeof CreateCarSchema>
