import { UsageStatus } from "@prisma/client";
import { z } from "zod";

export const CreateUsageRecordSchema = z.object({
    userId: z.string(),
    carId: z.string(),
    purpose: z.string(),
    destination: z.string(),
    startTime: z.date(),
    status: z.nativeEnum(UsageStatus),
});

export const UpdateUsageRecordSchema = CreateUsageRecordSchema.partial().extend({
    endTime: z.date().optional(),
});

export type CreateUsageRecordSchemaInput = z.infer<typeof CreateUsageRecordSchema>;
export type UpdateUsageRecordSchemaInput = z.infer<typeof UpdateUsageRecordSchema>;
