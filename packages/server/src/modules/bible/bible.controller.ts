import { Response } from 'express';
import { z, ZodError } from 'zod';

import { InjectionRequest } from './bible.types.js';

export default class BibleController {
  getMetadata = async (req: InjectionRequest, res: Response) => {
    try {
      const schema = z.object({
        translation: z.string(),
      });
      const { translation } = schema.parse(req.params);
      const data =
        await req.context.repository.getTranslationMetadata(translation);
      res.send(data);
    } catch (_error) {
      res.status(500).json({ error: 'Server error.' });
    }
  };

  getTranslations = async (req: InjectionRequest, res: Response) => {
    try {
      const data = await req.context.repository.getTranslations();
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
      const data = await req.context.repository.getBooks(translation);
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
      const data = await req.context.repository.getChapters(
        translation,
        Number(book),
      );
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
      const data = await req.context.repository.getVerses(
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
      const data = await req.context.repository.getVerseById(req.params.id);
      console.log(data);
      res.send(data);
    } catch (_error) {
      res.status(500).json({ error: 'Server error.' });
    }
  };

  uploadTranslation = async (req: InjectionRequest, res: Response) => {
    try {
      const translation = await req.context.parser.getTranslation();
      const insertion =
        await req.context.repository.insertTranslation(translation);
      if (!insertion) {
        res.status(409).json('Translation already exists in datatbase');
        return;
      }
      res.status(200).send({ status: 'OK' });
      //res.send(translation);
    } catch (_error) {
      res.status(500).json({ error: 'Server error.' });
    }
  };
}
