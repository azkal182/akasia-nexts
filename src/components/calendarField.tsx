import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { ControllerRenderProps } from 'react-hook-form';

type CalendarFieldProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, any>;
  label?: string;
  description?: string;
  disabledDate?: (date: Date) => boolean;
};

export const CalendarField = ({
  field,
  label,
  description,
  disabledDate = (date) => date > new Date() || date < new Date('1900-01-01')
}: CalendarFieldProps) => {
  return (
    <FormItem className='flex flex-col'>
      {label && <FormLabel>{label}</FormLabel>}
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant='outline'
              className={cn(
                'full pl-3 text-left font-normal',
                !field.value && 'text-muted-foreground'
              )}
            >
              {field.value ? (
                format(field.value, 'PPP')
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            mode='single'
            selected={field.value}
            onSelect={field.onChange}
            // disabled={disabledDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
};
