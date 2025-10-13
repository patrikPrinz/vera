import xml2js from 'xml2js';
import { z } from 'zod';

import { BibleVerse } from '../bible.types.js';

abstract class TranslationParser {
  protected rawData: string;
  protected data: BibleVerse[];

  public constructor(data: string) {
    this.data = [];
    this.rawData = data;
  }

  // TODO: Renumber protestant books and drop orthodox.
  protected renumberBooks(data: BibleVerse[]): BibleVerse[] {
    return data;
  }

  public async getData(): Promise<BibleVerse[]> {
    if (this.data.length == 0) {
      this.data = await this.parseData();
    }
    return this.data;
  }

  protected abstract parseData(): Promise<BibleVerse[]>;
}

export class TranslationParserXml extends TranslationParser {
  protected readonly schema = z.object({
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

  protected async parseData(): Promise<BibleVerse[]> {
    try {
      const parser = new xml2js.Parser();
      const verses: Array<BibleVerse> = [];
      const parsedDocument: unknown = await parser.parseStringPromise(
        this.rawData,
      );

      if (!this.schema.parse(parsedDocument)) {
        throw new Error();
      }

      const parsedData = this.schema.parse(parsedDocument).XMLBIBLE;
      const translationCode = parsedData.INFORMATION[0].identifier[0];

      parsedData.BIBLEBOOK.forEach((book) => {
        const bookId: unknown = book.$.bnumber;
        book.CHAPTER.forEach((chapter) => {
          const chapterId: unknown = chapter.$.cnumber;
          chapter.VERS.forEach((verse) => {
            const verseId: unknown = verse.$.vnumber;
            const verseData = {
              translation: translationCode,
              book: Number(bookId),
              chapter: Number(chapterId),
              verse: Number(verseId),
              text: verse._,
              isHeader: false,
            };
            verses.push(verseData);
          });
        });
      });
      return verses;
    } catch (err) {
      console.trace(err);
      throw new Error('Failed parsing XML. Structure is invalid.');
    }
  }
}
