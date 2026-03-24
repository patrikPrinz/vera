import { httpClient } from '@/shared/httpClient/HttpProvider';
import { GroupsService } from './groups.service';

export const groupsService = new GroupsService(httpClient);
