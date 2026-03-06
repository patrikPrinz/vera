import { httpClient } from '@/shared/httpClient/HttpProvider';
import { UserService } from './user.service';

export const userService = new UserService(httpClient);
