import { User as AppUser } from 'src/modules/user/entities/user.entity';

declare global {
  namespace Express {
    interface User extends AppUser {}
  }
}
