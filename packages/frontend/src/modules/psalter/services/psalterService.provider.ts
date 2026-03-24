import { httpClient } from '@/shared/httpClient/HttpProvider';
import { PsalterService } from './psalter.service';

export const psalterService = new PsalterService(httpClient);
