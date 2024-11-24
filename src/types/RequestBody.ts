export type LoginBody = {
  client_id: string;
  client_secret: string;
  grant_type: string;
  scope: string;
  username: string;
  password: string;
};

export type InvoiceBody = {
  invoices: [
    {
      bankAccount: {
        accountName: string;
        accountNumber: string;
        bankId: string;
        sortCode: string;
      };
      customer: {
        firstName: string;
        lastName: string;
        contact: {
          email: string;
          mobileNumber: string;
        };
        addresses: [
          {
            premise: string;
            countryCode: string;
            postcode: string;
            county: string;
            city: string;
            addressType: string;
          }
        ];
      };
      invoiceReference: string;
      invoiceNumber: string;
      currency: string;
      invoiceDate: string;
      dueDate: string;
      description?: string;
      items: [
        {
          itemReference: string;
          itemName: string;
          quantity: number;
          rate: number;
          itemUOM: string;
          description?: string;
        }
      ];
    }
  ];
};
