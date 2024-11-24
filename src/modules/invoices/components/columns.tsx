import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { get } from 'lodash';

export type Invoice = {
  invoiceNumber: string;
  customer?: {
    firstName: string;
    lastName: string;
  };
  currencySymbol: string;
  totalAmount: number;
  invoiceDate: string;
  dueDate: string;
  status: {
    key: string;
    value: boolean;
  }[];
};

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: 'invoiceNumber',
    header: 'Invoice Number',
  },
  {
    accessorKey: 'customer',
    header: () => <div className='text-center'>Customer</div>,
    cell: ({ row }) => {
      const customer = row.getValue<{
        firstName: string;
        lastName: string;
      }>('customer');

      return (
        <div className='text-center font-medium'>
          {get(customer, 'firstName', '') + ' ' + get(customer, 'lastName', '')}
        </div>
      );
    },
  },
  {
    accessorKey: 'totalAmount',
    header: ({ column }) => {
      return (
        <div className='text-center'>
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Total Amount
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('totalAmount'));
      const currencySymbol = row.original.currencySymbol || '$';

      return (
        <div className='text-center font-medium'>
          {currencySymbol + ' ' + amount}
        </div>
      );
    },
  },
  {
    accessorKey: 'invoiceDate',
    header: ({ column }) => {
      return (
        <div className='text-center'>
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Invoice Date
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const invoiceDate = row.getValue<string>('invoiceDate');
      return <div className='text-center font-medium'>{invoiceDate}</div>;
    },
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => {
      return (
        <div className='text-center'>
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Due Date
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const dueDate = row.getValue<string>('dueDate');
      return <div className='text-center font-medium'>{dueDate}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <div className='text-center'>
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Status
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue<
        {
          key: string;
          value: boolean;
        }[]
      >('status');

      return (
        <div
          className={`text-center font-medium ${
            status[0].key === 'Paid' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {status[0].key}
        </div>
      );
    },
  },
];
