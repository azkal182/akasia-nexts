import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Car } from "@prisma/client";
import React from "react";

interface CarListingProps {
  cars: Car[];
}

const CarListing = ({ cars }: CarListingProps) => {
  return (
    <div>
      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Plat</TableHead>
              <TableHead>Tersedia</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cars?.map((car, index) => (
              <TableRow key={car.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{car.name}</TableCell>
                <TableCell>{car.licensePlate}</TableCell>
                <TableCell>
                  {car.status === "AVAILABLE" ? (
                    <span className="text-xs py-0.5 px-2 bg-green-200 dark:bg-green-600 rounded-full">
                      AVAILABLE
                    </span>
                  ) : (
                    <span>IN USE</span>
                  )}
                </TableCell>
                <TableCell>Edit</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default CarListing;
