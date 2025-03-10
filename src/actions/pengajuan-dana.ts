"use server";

import prisma from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { PengajuanInput, PengajuanSchema } from "@/schemas/pengajuanSchema";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import _ from "lodash";

async function uploadImage(file: File) {
    const fileName = `${Date.now()}-${file.name}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const compressedBuffer = await sharp(buffer)
        .resize({ width: 1024 }) // Resize jika lebih besar dari 1024px
        .jpeg({ quality: 70 }) // Kompres dengan kualitas 70%
        .toBuffer(); // Konversi langsung ke buffer
    const { data, error } = await supabase.storage
        .from("akasia")
        .upload(fileName, compressedBuffer, {
            contentType: "image/jpeg",
        });

    if (error) throw new Error("Gagal mengunggah gambar");

    const publicUrl = supabase.storage.from("akasia").getPublicUrl(data.path)
        .data.publicUrl;
    console.log("Public URL:", publicUrl);

    return publicUrl;
}
// **CREATE PENGAJUAN**
export async function createPengajuan(formData: PengajuanInput) {
    try {
        const validatedData = PengajuanSchema.parse(formData);

        const itemsWithImages = await Promise.all(
            validatedData.items.map(async (item) => {
                const imageUrl = item.image ? await uploadImage(item.image) : null;

                // **Hapus properti image sebelum menyimpan ke Prisma**
                const { image, ...itemWithoutImage } = item;

                return { ...itemWithoutImage, imageUrl };
            })
        );

        console.log(itemsWithImages);

        await prisma.pengajuan.create({
            data: {
                date: new Date(),
                items: {
                    create: itemsWithImages.map(
                        ({ cardId, requirement, estimation, imageUrl }) => ({
                            cardId,
                            requirement,
                            estimation,
                            imageUrl: imageUrl ?? "", // **Pastikan tidak null**
                        })
                    ),
                },
            },
        });

        revalidatePath("/pengajuan"); // Memperbarui tampilan
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log(error);
        return { error: error.message };
    }
}

// **GET ALL PENGAJUAN**
export async function getPengajuan() {
    try {
        return await prisma.pengajuan.findMany({
            include: { items: { include: { car: true } } },
            orderBy: { date: "desc" },
        });
    } catch (error) {
        return [];

    }
}

export async function deletePengajuan(id: string) {
    try {
        await prisma.pengajuan.delete({ where: { id } });
        revalidatePath("/dashboard/pangajuan");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return { error: error.message };
    }
}

// **GET ALL CARS**
export async function getCars() {
    return await prisma.car.findMany();
}
