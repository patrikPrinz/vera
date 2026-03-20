import { httpClient } from '@/shared/httpClient/HttpProvider';
import { AdminService } from './admin.service';

export const adminService = new AdminService(httpClient);
