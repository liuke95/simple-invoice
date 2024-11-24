import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import axiosInstance from '@/lib/api';
import { useState } from 'react';
import { DataTable } from './components/data-table';
import { columns } from './components/columns';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { FILTER_MAPPER } from '@/constants';

export default function Invoices() {
  const [data, setData] = useState({
    data: [],
    paging: {
      totalRecords: 0,
      pageIndex: 0,
      pageSize: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const onFetchData = async (
    pagination: PaginationState,
    sorting: SortingState,
    globalFilter?: string
  ) => {
    try {
      setIsLoading(true);
      let url = `/invoice-service/1.0.0/invoices?pageNum=${pagination.pageIndex}&pageSize=${pagination.pageSize}`;
      if (sorting.length) {
        url += `&sortBy=${FILTER_MAPPER.get(sorting[0].id)}&ordering=${
          sorting[0].desc ? 'DESCENDING' : 'ASCENDING'
        }`;
      }

      if (globalFilter) {
        url += `&keyword=${globalFilter}`;
      }
      const response = await axiosInstance.get(url);
      setData(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header className='flex h-16 shrink-0 items-center gap-2'>
        <div className='flex items-center gap-2 px-4'>
          <SidebarTrigger className='-ml-1' />
          <Separator orientation='vertical' className='mr-2 h-4' />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className='hidden md:block'>
                <BreadcrumbLink href='#'>Simple Invoice</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className='hidden md:block' />
              <BreadcrumbItem>
                <BreadcrumbPage>Invoices</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className='container px-5'>
        <DataTable
          columns={columns}
          data={data}
          onFetchData={onFetchData}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
