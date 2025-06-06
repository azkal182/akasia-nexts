import { Car, PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

const main = async () => {
  const armadaList = [
    { id: '4c862f61-515a-48df-8adb-d524d86247eb', name: 'INNOVA' },
    { id: 'ba0a3c77-d3d6-4b0e-8ce1-ef7e2fc35dfc', name: 'KIJANG MERAH' },
    { id: '6d4046ae-34ba-4da1-9f96-e5c6b781cc4e', name: 'L300 ORANGE' },
    { id: '6b129baf-6fe1-4182-a505-3c1b6c85cce3', name: 'L300 BIRU' },
    { id: 'd44b803e-d743-4eea-96d4-61a9e79a42bc', name: 'ELF LONG' },
    { id: '1e8ac18e-85ed-4c92-947e-db368b18dbd8', name: 'ELF SHORT' },
    { id: '955819e1-9656-43ff-92e3-addc3af97a64', name: 'DUM IJO' },
    { id: '478c39c2-1554-4329-bd77-c2bff4a7d5b7', name: 'DUM KUNING' },
    { id: 'f22a3515-a6a5-4d2b-b023-567347b86b9e', name: 'VENTURER' },
    { id: '2a95494c-fb39-429f-b618-90cbc674d32d', name: 'FORTUNER' },
    { id: 'e0f359bc-4616-48d0-af67-c9d4788af000', name: 'AVANZA BARU' },
    { id: '6ef6a0b7-7f3c-40a2-93e7-c1e31cb19289', name: 'AVANZA VELOZ' },
    { id: '0c96a8f7-6cdb-4e48-b30b-270ede71becc', name: 'LUXIO' },
    { id: 'aa589841-2519-419b-b3c8-910e501207a6', name: 'PANTHER' },
    { id: '9f136c24-b4ae-4530-8eda-f112709eb95a', name: 'TAYO IJO' },
    { id: 'e310c90a-4e0a-4518-abb1-931fb06a0941', name: 'TAYO MERAH' },
    { id: '85235c1b-4b00-4a62-9aec-5cf2a5f8a3bf', name: 'TAYO ORANGE' },
    { id: '63ae5ed6-aa6b-4bc6-aa59-6306a3a73edd', name: 'BIS 1' },
    { id: '41f11cad-6a44-4257-9dfb-f957955ef0a1', name: 'BIS 2' },
    { id: 'e5c0372e-c703-4012-82dd-e316e22ea39e', name: 'AMBULANCE' },
    { id: 'ca3dd982-a906-4c69-ab75-1aad2d1d3232', name: 'HI ACE' },
    { id: '706a0c85-038e-4350-a9b7-91fe28c18d97', name: 'X-PANDER' }
  ];

  await prisma.car.createMany({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    data: armadaList
  });

  await prisma.user.create({
    data: {
      name: 'admin',
      username: 'admin',
      password: hashSync('admin')
    }
  });
};

main()
  .then(() => console.log('create cars successful'))
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
