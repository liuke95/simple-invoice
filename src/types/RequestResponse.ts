export type LoginResponse = {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
};

type Membership = {
  membershipId: string;
  organisationId: string;
  organisationName: string;
  organisationNumber: string;
  roleName: string;
  token: string;
};

export type UserResponse = {
  data: {
    userName: string;
    userId: string;
    updatedAt: string;
    createdAt: string;
    memberships: Membership[];
    status: string;
    passwordExpired: boolean;
    mobileNumber: string;
    lastName: string;
    firstName: string;
    isUSCitizen: boolean;
  };
};
