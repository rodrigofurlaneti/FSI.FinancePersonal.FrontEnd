// src/services/registerService.ts
import api from "../api/api";
import type { Register, CreateRegisterPayload } from "../types/register";

const base = "/api/users";

export const RegisterService = {
  create: async (payload: CreateRegisterPayload): Promise<Register> => {
    const { name, email, password } = payload;

    const { data } = await api.post<Register>(base, {
      name: name.trim(),
      email: email.trim(),
      password: password,
    });

    return data;
  },
};

export default RegisterService;
