import React from 'react';
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

const FuelView = () => {
    return (
        <div className={'flex flex-1 flex-col space-y-4'}>
            <div className={'flex items-center space-x-4'}>
                <Dialog>
                    <form>
                        <DialogTrigger asChild>
                            <Button variant="outline">Pemasukan</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Tambah Pemasukan</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="name-1">Keterangan</Label>
                                    <Input id="name-1" name="name" placeholder={"Keterangan"} />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="username-1">Jumlah</Label>
                                    <Input id="username-1" name="username" placeholder={"Rp.xxx.xxx"} />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </form>
                </Dialog>
                <Dialog>
                    <form>
                        <DialogTrigger asChild>
                            <Button variant="default">Isi Bahan Bakar</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Isi Bahan Bakar</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="name-1">Bensin/Solar</Label>
                                    <Select>
                                        <SelectTrigger className="">
                                            <SelectValue placeholder="BAHAN BAKAR" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="BENSIN">BENSIN</SelectItem>
                                            <SelectItem value="SOLAR">SOLAR</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>


                                <div className="grid gap-3">
                                    <Label htmlFor="username-1">Jumlah</Label>
                                    <Input id="username-1" name="username" placeholder={"Rp.xxx.xxx"} />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="name-1">Nota</Label>
                                    <Input type={"file"} name="name" placeholder={"Keterangan"} />
                                </div>

                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </form>
                </Dialog>
            </div>

            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No</TableHead>
                            <TableHead>Keterangan</TableHead>
                            <TableHead>Armada</TableHead>
                            <TableHead>Pemasukan</TableHead>
                            <TableHead>Pengaluaran</TableHead>
                            <TableHead>Saldo</TableHead>
                            <TableHead>Nota</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow className={'bg-green-900 hover:bg-green-800'}>
                            <TableCell>1</TableCell>
                            <TableCell>PEMASUKAN</TableCell>
                            <TableCell> </TableCell>
                            <TableCell>300.000</TableCell>
                            <TableCell></TableCell>
                            <TableCell>300.000</TableCell>
                            <TableCell>Nota</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>2</TableCell>
                            <TableCell>BENSIN</TableCell>
                            <TableCell>INOVA</TableCell>
                            <TableCell></TableCell>
                            <TableCell>100.000</TableCell>
                            <TableCell>200.000</TableCell>
                            <TableCell>Nota</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default FuelView;