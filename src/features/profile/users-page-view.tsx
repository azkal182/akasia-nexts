// 'use client';
// import { activateUser, UsersResponse } from '@/actions/users';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader } from '@/components/ui/card';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger
// } from '@/components/ui/dropdown-menu';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow
// } from '@/components/ui/table';
// import { MoreHorizontal } from 'lucide-react';
// import React from 'react';
// import { toast } from 'sonner';

// interface UsersPageViewProps {
//   users: UsersResponse[];
// }
// const UsersPageView = ({ users }: UsersPageViewProps) => {
//   const handleActivate = (userId: string) => {
//     try {
//       activateUser(userId);
//       toast.success('User activated successfully');
//     } catch (error) {
//       toast.error('Failed to activate user');
//     }
//   };
//   return (
//     <Card className={'max-w-[calc(100vw-2rem)] md:max-w-full'}>
//       <CardContent>
//         <CardHeader>
//           <h2 className='text-xl font-semibold mb-4'>Daftar Pengguna</h2>
//         </CardHeader>
//         <div>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className='w-10'>No</TableHead>
//                 <TableHead>Nama</TableHead>
//                 <TableHead>Username</TableHead>
//                 <TableHead className='w-24'>Status</TableHead>
//                 <TableHead className='w-16'>Aksi</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {users.map((user, index) => (
//                 <TableRow key={user.id}>
//                   <TableCell className='text-center'>{index + 1}</TableCell>
//                   <TableCell>{user.name}</TableCell>
//                   <TableCell>{user.username}</TableCell>
//                   <TableCell className='text-center'>
//                     {user.active ? 'Aktif' : 'Tidak Aktif'}
//                   </TableCell>
//                   <TableCell>
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant='ghost' className='h-8 w-8 p-0'>
//                           <span className='sr-only'>Open menu</span>
//                           <MoreHorizontal />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align='end'>
//                         <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                         <DropdownMenuItem
//                           onClick={() => handleActivate(user.id)}
//                         >
//                           Aktivasi
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem>Edit</DropdownMenuItem>
//                         <DropdownMenuItem>Reset Password</DropdownMenuItem>
//                         <DropdownMenuItem>Delete</DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default UsersPageView;

'use client';
import { activateUser, UsersResponse } from '@/actions/users';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { MoreHorizontal } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface UsersPageViewProps {
  users: UsersResponse[];
}

const UsersPageView = ({ users }: UsersPageViewProps) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isActivating, setIsActivating] = useState(false);

  const handleActivate = async (userId: string) => {
    setSelectedUserId(userId);
    setIsAlertOpen(true);
  };

  const confirmActivate = async () => {
    if (!selectedUserId) return;
    setIsActivating(true);
    try {
      await activateUser(selectedUserId);
      toast.success('User activated successfully');
    } catch (error) {
      toast.error('Failed to activate user');
    } finally {
      setIsActivating(false);
      setIsAlertOpen(false);
      setSelectedUserId(null);
    }
  };

  return (
    <Card className='max-w-[calc(100vw-2rem)] md:max-w-full'>
      <CardContent>
        <CardHeader>
          <h2 className='text-xl font-semibold mb-4'>Daftar Pengguna</h2>
        </CardHeader>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-10'>No</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className='w-24'>Status</TableHead>
                <TableHead className='w-16'>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow
                  key={user.id}
                  className={
                    user.active
                      ? ''
                      : 'bg-green-100 hover:bg-green-200 dark:hover:bg-green-900 dark:bg-green-800'
                  }
                >
                  <TableCell className='text-center'>{index + 1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.ROLE}</TableCell>
                  <TableCell className='text-center'>
                    {user.active ? 'Aktif' : 'Tidak Aktif'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0'>
                          <span className='sr-only'>Open menu</span>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleActivate(user.id)}
                          disabled={user.active || isActivating}
                        >
                          Aktivasi
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Reset Password</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Aktivasi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin mengaktifkan pengguna ini? Tindakan ini
              tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isActivating}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmActivate}
              disabled={isActivating}
            >
              {isActivating ? 'Mengaktifkan...' : 'Aktifkan'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default UsersPageView;
