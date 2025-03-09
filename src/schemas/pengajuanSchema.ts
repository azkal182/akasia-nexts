import { z } from "zod";

// Schema Validasi
export const PengajuanSchema = z.object({
  items: z.array(
    z.object({
      requirement: z.string().min(1, "Kebutuhan harus diisi"),
      cardId: z.string().min(1, "Pilih kendaraan"),
      estimation: z.number().min(1, "Estimasi harus lebih dari 0"),
      image: z.instanceof(File).optional(),
    })
  ),
});

export type PengajuanInput = z.infer<typeof PengajuanSchema>;
