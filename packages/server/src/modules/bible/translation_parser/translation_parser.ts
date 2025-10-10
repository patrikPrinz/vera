import xml2js from 'xml2js';
import { z } from 'zod';

import { BibleVerse } from '../bible.types.js';

export interface TranslationParser {
  getData(): Promise<Array<BibleVerse>>;
}

const schemaXml = z.object({
  XMLBIBLE: z.object({
    INFORMATION: z.array(
      z.object({
        identifier: z.array(z.string()),
      }),
    ),
    BIBLEBOOK: z.array(
      z.object({
        $: z.object({
          bnumber: z.string(),
        }),
        CHAPTER: z.array(
          z.object({
            $: z.object({
              cnumber: z.string(),
            }),
            VERS: z.array(
              z.object({
                $: z.object({
                  vnumber: z.string(),
                }),
                _: z.string(),
              }),
            ),
          }),
        ),
      }),
    ),
  }),
});
export class TranslationParserXml implements TranslationParser {
  protected rawData: string;
  protected data: Array<BibleVerse>;

  public constructor(data: string) {
    this.data = [];
    this.rawData = data;
  }

  protected async parseData(): Promise<Array<BibleVerse>> {
    try {
      const parser = new xml2js.Parser();
      const verses: Array<BibleVerse> = [];
      const parsedDocument: unknown = await parser.parseStringPromise(
        this.rawData,
      );
      if (!schemaXml.parse(parsedDocument)) {
        throw new Error();
      }
      const parsedData = schemaXml.parse(parsedDocument).XMLBIBLE;
      const translationCode = parsedData.INFORMATION[0].identifier[0];
      console.log(parsedData.BIBLEBOOK);
      parsedData.BIBLEBOOK.forEach((book) => {
        const bookId: unknown = book.$.bnumber;
        book.CHAPTER.forEach((chapter) => {
          const chapterId: unknown = chapter.$.cnumber;
          console.log(chapterId);
          chapter.VERS.forEach((verse) => {
            const verseId: unknown = verse.$.vnumber;
            const verseData = {
              translation: translationCode,
              book: bookId as number,
              chapter: chapterId as number,
              verse: verseId as number,
              text: verse._,
              isHeader: false,
            };
            verses.push(verseData);
          });
        });
      });
      console.log('ggg');
      console.log(verses);
      return verses;
    } catch (err) {
      console.trace(err);
      throw new Error('Failed parsing XML. Structure is invalid.');
    }
  }

  public async getData(): Promise<Array<BibleVerse>> {
    if (this.data.length == 0) {
      this.data = await this.parseData();
    }
    return this.data;
  }
}
