import { Response } from 'express';

import { InjectionRequest } from './bible.types.js';
import { TranslationParserXml } from './translation_parser/translation_parser.js';
import { z, ZodError } from 'zod';

export default class BibleController {
  getTranslations = async (req: InjectionRequest, res: Response) => {
    try {
      const data = await req.repository.getTranslations();
      res.send(data);
    } catch (_error) {
      res.status(500).json({ error: 'Server error.' });
    }
  };

  getBooks = async (req: InjectionRequest, res: Response) => {
    try {
      const schema = z.object({
        translation: z.string(),
      });
      const { translation } = schema.parse(req.params);
      const data = await req.repository.getBooks(translation);
      res.send(data);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: 'Invalid request.' });
      }
      res.status(500).json({ error: 'Server error.' });
    }
  };

  getChapters = async (req: InjectionRequest, res: Response) => {
    try {
      const schema = z.object({
        translation: z.string(),
        book: z.string(),
      });
      const { translation, book } = schema.parse(req.params);
      const data = await req.repository.getChapters(translation, Number(book));
      res.send(data);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: 'Invalid request.' });
      }
      res.status(500).json({ error: 'Server error.' });
    }
  };

  getVerses = async (req: InjectionRequest, res: Response) => {
    try {
      const schema = z.object({
        translation: z.string(),
        book: z.string(),
        chapter: z.string(),
      });
      const { translation, book, chapter } = schema.parse(req.params);
      const data = await req.repository.getVerses(
        translation,
        Number(book),
        Number(chapter),
      );
      res.send(data);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: 'Invalid request.' });
      }
      res.status(500).json({ error: 'Server error.' });
    }
  };

  getVerse = async (req: InjectionRequest, res: Response) => {
    try {
      const data = await req.repository.getVerseById(req.params.id);
      res.send(data);
    } catch (_error) {
      res.status(500).json({ error: 'Server error.' });
    }
  };

  public async parseData(req: InjectionRequest, _res: Response) {
    const testData = `
            <?xml version="1.0" encoding="utf-8"?>
<XMLBIBLE xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="zef2005.xsd" version="2.0.1.18" status="v" biblename="Czech Ekumenicky Cesky preklad" type="x-bible" revision="0">
  <INFORMATION>
    <date>2009-01-23</date>
    <title>Czech Ekumenicky Cesky preklad</title>
    <identifier>CZECEP</identifier>
    <source>http://www.crosswire.org/sword/servlet/SwordMod.Verify?modName=CzeCEP</source>
    <language>CZE</language>
    <coverage>provide the bible to the world</coverage>
    <rights>
    </rights>
  </INFORMATION>
  <BIBLEBOOK bnumber="1" bname="1 Mose" bsname="1Mo">
    <CHAPTER cnumber="1">
      <VERS vnumber="1">Na počátku stvořil Bůh nebe a zemi.</VERS>
     </CHAPTER>
  </BIBLEBOOK>
</XMLBIBLE>
        `;

    const parser = new TranslationParserXml(testData);
    const data = await parser.getData();

    await req.repository.bulkInsert(data);
    return data;
  }
}
