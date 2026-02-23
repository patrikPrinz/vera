import { httpClient } from '@/shared/httpClient/HttpProvider';
import { AuthService } from './auth.service';

export const authService = new AuthService(httpClient);
