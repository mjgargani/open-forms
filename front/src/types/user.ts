export interface User { id: string; name: string; user: string; role: 'USER' | 'ADMIN'; } export type CreateUserPayload = Omit<User, 'id'> & { password?: string; };
