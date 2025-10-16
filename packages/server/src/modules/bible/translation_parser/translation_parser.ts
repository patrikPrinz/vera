import xml2js from 'xml2js';
import { z } from 'zod';

import {
  BibleTranslationContainer,
  BibleTranslationMetadata,
  BibleVerse,
} from '../bible.types.js';

abstract class TranslationParser {
  protected rawData: string;
  protected parsedTranslation: BibleTranslationContainer;

  public constructor(data: string) {
    this.rawData = data;
    this.parsedTranslation = undefined;
  }

  public async getData(): Promise<BibleVerse[]> {
    if (this.parsedTranslation === undefined) {
      this.parsedTranslation = await this.parseTranslation();
    }
    return this.parsedTranslation.data;
  }

  public async getMetadata(): Promise<BibleTranslationMetadata> {
    if (this.parsedTranslation === undefined) {
      this.parsedTranslation = await this.parseTranslation();
    }
    return this.parsedTranslation.metadata;
  }

  protected abstract parseTranslation(): Promise<BibleTranslationContainer>;
}

export class TranslationParserXml extends TranslationParser {
  protected readonly schema = z.object({
    XMLBIBLE: z.object({
      INFORMATION: z.array(
        z.object({
          identifier: z.array(z.string()),
          language: z.array(z.string()),
          date: z.array(z.string()),
          creator: z.array(z.string()),
          source: z.array(z.string()),
        }),
      ),
      BIBLEBOOK: z.array(
        z.object({
          $: z.object({
            bnumber: z.string(),
            bname: z.string(),
            bsname: z.string(),
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

  protected async parseTranslation(): Promise<BibleTranslationContainer> {
    try {
      const parser = new xml2js.Parser();
      const parsedDocument: unknown = await parser.parseStringPromise(
        this.rawData,
      );

      const parsedData = this.schema.safeParse(parsedDocument);
      if (!parsedData.success) {
        throw new Error();
      }

      const renumberedBooks = this.renumberProtestantBooks(parsedData.data);

      return {
        data: this.parseBooks(renumberedBooks),
        metadata: this.parseMetadata(renumberedBooks),
      };
    } catch (err) {
      console.trace(err);
      throw new Error('Failed parsing XML. Structure is invalid.');
    }
  }

  protected renumberProtestantBooks(
    parsedText: z.infer<typeof this.schema>,
  ): z.infer<typeof this.schema> {
    const ret = parsedText;
    // Catholic or unknown translation type
    if (ret.XMLBIBLE.BIBLEBOOK.length != 66) {
      return ret;
    }
    const missingIndices = [17, 18, 20, 21, 25, 45, 46];
    let books: typeof parsedText.XMLBIBLE.BIBLEBOOK;
    for (const missingIndex of missingIndices) {
      for (let book = 0; book < ret.XMLBIBLE.BIBLEBOOK.length; book += 1) {
        if (Number(ret.XMLBIBLE.BIBLEBOOK[book].$.bnumber) >= missingIndex) {
          const newValue = String(
            Number(ret.XMLBIBLE.BIBLEBOOK[book].$.bnumber) + 1,
          );
          ret.XMLBIBLE.BIBLEBOOK[book].$.bnumber = newValue;
        }
      }
    }

    ret.XMLBIBLE.BIBLEBOOK = books;
    return ret;
  }

  protected parseBooks(
    parsedXml: z.infer<typeof TranslationParserXml.prototype.schema>,
  ): BibleVerse[] {
    const translationCode = parsedXml.XMLBIBLE.INFORMATION[0].identifier[0];
    const parsedData = parsedXml.XMLBIBLE;
    const verses: BibleVerse[] = [];
    parsedData.BIBLEBOOK.forEach((book) => {
      const bookId: number = Number(book.$.bnumber);
      book.CHAPTER.forEach((chapter) => {
        const chapterId: number = Number(chapter.$.cnumber);
        chapter.VERS.forEach((verse) => {
          const verseId: number = Number(verse.$.vnumber);
          const verseData = {
            translation: translationCode,
            book: bookId,
            chapter: chapterId,
            verse: verseId,
            text: verse._,
            isHeader: false,
          };
          verses.push(verseData);
        });
      });
    });
    return verses;
  }

  protected parseMetadata(
    parsedXml: z.infer<typeof TranslationParserXml.prototype.schema>,
  ): BibleTranslationMetadata {
    const xmlMetadata = parsedXml.XMLBIBLE.INFORMATION[0];
    return {
      code: xmlMetadata.identifier[0],
      language: xmlMetadata.language[0],
      date: xmlMetadata.date[0],
      creator: xmlMetadata.creator[0],
      source: xmlMetadata.source[0],
      books: parsedXml.XMLBIBLE.BIBLEBOOK.map((book) => {
        return {
          bookNumber: Number(book.$.bnumber),
          name: book.$.bname,
          code: book.$.bsname,
        };
      }),
    };
  }
}
