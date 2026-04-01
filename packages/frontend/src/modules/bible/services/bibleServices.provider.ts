import { BibleHttpService } from './bibleHttp.service';
import { PassagesService } from './passages.service';
import { httpClient } from '@/shared/httpClient/HttpProvider';

export const bibleService = new BibleHttpService(httpClient);
export const passageService = new PassagesService(httpClient);
