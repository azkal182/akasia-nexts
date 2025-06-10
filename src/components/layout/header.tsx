'use client';
import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { Separator } from '../ui/separator';
import { Breadcrumbs } from '../breadcrumbs';
import SearchInput from '../search-input';
import { UserNav } from './user-nav';
import ThemeToggle from './ThemeToggle/theme-toggle';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { useModeStore } from '@/store/modeStore';
import { useCurrentSession } from '@/hooks/use-current-user';

export default function Header() {
  const { mode, setMode } = useModeStore();
  const handleModeChange = (checked: boolean) => {
    setMode(checked ? 'admin' : 'driver');
  };
  const { session } = useCurrentSession();
  console.log('Current session:', session);
  return (
    <header className='flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4' />
        <Breadcrumbs />
      </div>

      <div className='flex items-center gap-2 px-4'>
        <div className='hidden md:flex'>
          <SearchInput />
        </div>
        {session?.user?.role === 'ADMIN' && (
          <div>
            <div className='flex items-center space-x-2'>
              <Switch
                id='airplane-mode'
                checked={mode === 'admin'}
                onCheckedChange={handleModeChange}
              />
              <Label htmlFor='airplane-mode'>
                {mode
                  ? `${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode`
                  : 'No Mode'}
              </Label>
            </div>
          </div>
        )}
        <UserNav />
        <ThemeToggle />
      </div>
    </header>
  );
}
