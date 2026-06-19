export interface RequestWithUser extends Request { user: { userId: string; username: string; role: string; }; }
