import { elasticAdapter } from "../../shared/es/elastic_provider.js";
import BibleRepository from "./bible.repository.js";

export const bibleServiceInjector = async (req, _res, next) => {
    req.services = {
        bibleRepository: new BibleRepository(elasticAdapter)
    };
    next();
};