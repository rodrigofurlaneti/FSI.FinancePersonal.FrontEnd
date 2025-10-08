export type Register = {
  id: number;
  name: string;
  email: string;
  password: string;
};

export type CreateRegisterPayload = {
  name: string;
  email: string;
  password: string;
};