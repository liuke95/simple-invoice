import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useState } from 'react';
import axiosInstance from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { get } from 'lodash';
import { InvoiceBody } from '@/types/RequestBody';
import { useNavigate } from 'react-router-dom';
import { PhoneInput } from '@/components/phone-input';
import { isValidPhoneNumber } from 'react-phone-number-input';

// Define the schema for form validation
const invoiceSchema = z.object({
  // Bank Account
  bankId: z.string().min(1, 'Bank Id is required'),
  sortCode: z
    .string()
    .regex(/^\d{2}-\d{2}-\d{2}$/, 'Sort code must be in the format XX-XX-XX'),
  accountNumber: z.string().length(8, 'Account number must be 8 digits'),
  accountName: z.string().min(1, 'Account name is required'),

  // Customer
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  mobileNumber: z
    .string()
    .refine(isValidPhoneNumber, { message: 'Invalid phone number' })
    .or(z.literal('')),

  // Address
  premise: z.string().min(1, 'Premise is required'),
  countryCode: z.string().length(2, 'Country code must be 2 characters'),
  postcode: z.string().min(1, 'Postcode is required'),
  county: z.string().min(1, 'County is required'),
  city: z.string().min(1, 'City is required'),

  // Invoice Details
  invoiceReference: z.string().min(1, 'Invoice reference is required'),
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  currency: z.string().min(1, 'Currency is required'),
  invoiceDate: z.date(),
  dueDate: z.date(),
  description: z.string(),

  // Item Details
  itemReference: z.string().min(1, 'Item reference is required'),
  itemDescription: z.string(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  rate: z.number().min(0, 'Rate must be a positive number'),
  itemName: z.string().min(1, 'Item name is required'),
  itemUOM: z.string().min(1, 'Item UOM is required'),
});

export function InvoiceForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      bankId: '',
      sortCode: '',
      accountNumber: '',
      accountName: '',
      firstName: '',
      lastName: '',
      email: '',
      mobileNumber: '',
      premise: '',
      countryCode: '',
      postcode: '',
      county: '',
      city: '',
      invoiceReference: '',
      invoiceNumber: '',
      currency: '',
      invoiceDate: new Date(),
      dueDate: new Date(),
      description: undefined,
      itemReference: '',
      itemDescription: undefined,
      quantity: 1,
      rate: 0,
      itemName: '',
      itemUOM: '',
    },
  });

  async function onSubmit(values: z.infer<typeof invoiceSchema>) {
    console.log(values);
    try {
      setLoading(true);
      const data: InvoiceBody = {
        invoices: [
          {
            bankAccount: {
              bankId: values.bankId,
              sortCode: values.sortCode,
              accountNumber: values.accountNumber,
              accountName: values.accountName,
            },
            customer: {
              firstName: values.firstName,
              lastName: values.lastName,
              contact: {
                email: values.email,
                mobileNumber: values.mobileNumber,
              },
              addresses: [
                {
                  premise: values.premise,
                  countryCode: values.countryCode,
                  postcode: values.postcode,
                  county: values.county,
                  city: values.city,
                  addressType: 'BILLING',
                },
              ],
            },
            invoiceReference: values.invoiceReference,
            invoiceNumber: values.invoiceNumber,
            currency: values.currency,
            invoiceDate: format(values.invoiceDate, 'yyyy-MM-dd'),
            dueDate: format(values.dueDate, 'yyyy-MM-dd'),
            description: values.description,
            items: [
              {
                itemReference: values.itemReference,
                itemName: values.itemName,
                quantity: values.quantity,
                rate: values.rate,
                itemUOM: values.itemUOM,
                description: values.description,
              },
            ],
          },
        ],
      };
      await axiosInstance.post('/invoice-service/1.0.0/invoices', data);
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Create Invoice Success',
      });
      navigate('/invoices');
    } catch (err) {
      const msg = get(err, 'response.data.errors[0].message', 'Invalid Data');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <Card>
          <CardHeader>
            <CardTitle>Invoice Form</CardTitle>
            <CardDescription>
              Create a new invoice using the form below.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Bank Account Section */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Bank Account</h3>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='bankId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Bank Id <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='sortCode'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Sort Code <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='XX-XX-XX' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='accountNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Account Number <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='accountName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Account Name <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Customer Section */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Customer</h3>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='firstName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        First Name <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='lastName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Last Name <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='mobileNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Mobile Number <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        {/* <Input {...field} /> */}
                        <PhoneInput
                          defaultCountry='SG'
                          placeholder='Enter a phone number'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Address Section */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Address</h3>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='premise'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Premise <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='countryCode'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Country Code <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='postcode'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Postcode <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='city'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        City <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name='county'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    County <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Invoice Details Section */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Invoice Details</h3>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='invoiceReference'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Invoice Reference{' '}
                        <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='invoiceNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Invoice Number <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='currency'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Currency <span className='text-red-500'>*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a currency' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='GBP'>GBP</SelectItem>
                        <SelectItem value='USD'>USD</SelectItem>
                        <SelectItem value='EUR'>EUR</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='invoiceDate'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>Invoice Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-[240px] pl-3 text-left font-normal',
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
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='dueDate'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-[240px] pl-3 text-left font-normal',
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
                            disabled={(date) => date < new Date('1900-01-01')}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Item Details Section */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Item Details</h3>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='itemReference'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Item Reference <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='itemName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Item Name <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid grid-cols-3 gap-4'>
                <FormField
                  control={form.control}
                  name='quantity'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Quantity <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type='number'
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='rate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Rate <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type='number'
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='itemUOM'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        UOM <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='itemDescription'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type='submit' disabled={loading}>
              {loading ? (
                <div className='flex items-center gap-4'>
                  <LoaderCircle className='animate-spin' />
                  Loading...
                </div>
              ) : (
                <div>Create Invoice</div>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
