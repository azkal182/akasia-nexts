import { z } from 'zod';

export const CreateCarSchema = z.object({
  name: z.string().min(1, 'Nama Harus di isi'),
  licensePlate: z.string().optional(),
  barcodeString: z.string().optional()
  //   taxAnnual: z.date(),
  //   fiveYear: z.date()
});

export type CreateCarSchemaInput = z.infer<typeof CreateCarSchema>;
