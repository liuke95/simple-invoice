import { SidebarInset, SidebarProvider } from './ui/sidebar';
import { AppSidebar } from './app-sidebar';
import { Outlet } from 'react-router-dom';

import axiosInstance from '@/lib/api';
import { useEffect, useState } from 'react';
import { UserResponse } from '@/types/RequestResponse';
import { useToast } from '@/hooks/use-toast';
import { get } from 'lodash';

type LayoutProps = {
  children?: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axiosInstance.get<UserResponse>(
          '/membership-service/1.0.0/users/me'
        );
        setUser(response.data);
        const org_token = response.data.data.memberships[0].token;
        localStorage.setItem('org_token', org_token);
      } catch (err) {
        console.log(err);
        const msg = get(err, 'response.data.message', 'Invalid Data');
        toast({
          variant: 'destructive',
          title: 'Error',
          description: msg,
        });
      }
    };

    getUser();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>{children ? children : <Outlet />}</SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
