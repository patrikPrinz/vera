import { elasticAdapter } from '../../shared/es/index.js';
import BibleRepository from './bible.repository.js';
import { TranslationParserXml } from './translation_parser/translation_parser.js';

export default class BibleController {
  public async getTranslations(req, res) {
    const data = await req.services.bibleRepository.getTranslations();
    res.send(data);
  }

  public async getBooks(req, res) {
    const data = await req.services.bibleRepository.getBooks(req.params.translation);
    res.send(data);
  }

  public async getChapters(req, res) {
    const { translation, book } = req.params;
    const data = await req.services.bibleRepository.getChapters(translation, book as number);
    res.send(data);
  }

  public async getVerses(req, res) {
    const { translation, book, chapter } = req.params;
    const data = await req.services.bibleRepository.getVerses(translation, book as number, chapter as number);
    res.send(data);
  }


    public async parseData(req, res) {
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
    
    await req.services.bibleRepository.bulkInsert(data);
    return data;
  }

  public getVerse(req, res) {
    const data = req.services.bibleRepository.getVerseById(req.params.id);
    return data;
  }
}
