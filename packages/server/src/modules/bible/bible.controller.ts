import { elasticAdapter } from '../../shared/es/index.js';
import BibleRepository from './bible.repository.js';
import { TranslationParserXml } from './translation_parser/translation_parser.js';

export default class BibleController {
  private repository: BibleRepository;
  public constructor(repository: BibleRepository) {
    this.repository = repository;
  }
  public getVerse(id: string) {
    return id;
  }

  public async parseData() {
    const testData = `
            <?xml version="1.0" encoding="utf-8"?>
<XMLBIBLE xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="zef2005.xsd" version="2.0.1.18" status="v" biblename="Czech Ekumenicky Cesky preklad" type="x-bible" revision="0">
  <INFORMATION>
    <subject>holy bible</subject>
    <format>Zefania XML Bible Markup Language</format>
    <date>2009-01-23</date>
    <title>Czech Ekumenicky Cesky preklad</title>
    <creator>Pan Tau</creator>
    <description>Czech Ekumenicky Cesky preklad: Bible Pismo svate Stareho i Noveho Zakona podle ekumenickeho vydani z r. 1985 (c) Ekumenicka par rada cirkvi v CR.</description>
    <publisher>graphic artist</publisher>
    <contributors>Sword Project</contributors>
    <type>bible text</type>
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
      <VERS vnumber="2">Země byla pustá a prázdná a nad propastnou tůní byla tma. Ale nad vodami vznášel se duch Boží.</VERS>
      <VERS vnumber="3">I řekl Bůh: "Buď světlo!" A bylo světlo.</VERS>
      <VERS vnumber="4">Viděl, že světlo je dobré, a oddělil světlo od tmy.</VERS>
    </CHAPTER>
    <CHAPTER cnumber="2">
      <VERS vnumber="1">Tak byla dokončena nebesa i země se všemi svými zástupy.</VERS>
      <VERS vnumber="2">Sedmého dne dokončil Bůh své dílo, které konal; sedmého dne přestal konat veškeré své dílo.</VERS>
      <VERS vnumber="3">A Bůh požehnal a posvětil sedmý den, neboť v něm přestal konat veškeré své stvořitelské dílo.</VERS>
      <VERS vnumber="4">Toto je rodopis nebe a země, jak byly stvořeny. V den, kdy Hospodin Bůh učinil zemi a nebe,</VERS>
      <VERS vnumber="5">nebylo na zemi ještě žádné polní křovisko ani nevzcházela žádná polní bylina, neboť Hospodin Bůh nezavlažoval zemi deštěm, a nebylo člověka, který by zemi obdělával.</VERS>
    </CHAPTER>
    <CHAPTER cnumber="3">
      <VERS vnumber="1">Nejzchytralejší ze vší polní zvěře, kterou Hospodin Bůh učinil, byl had. Řekl ženě: "Jakže, Bůh vám zakázal jíst ze všech stromů v zahradě?"</VERS>
      <VERS vnumber="2">Žena hadovi odvětila: "Plody ze stromů v zahradě jíst smíme.</VERS>
      <VERS vnumber="3">Jen o plodech ze stromu, který je uprostřed zahrady, Bůh řekl: »Nejezte z něho, ani se ho nedotkněte, abyste nezemřeli.«"</VERS>
      <VERS vnumber="4">Had ženu ujišťoval: "Nikoli, nepropadnete smrti.</VERS>
      <VERS vnumber="5">Bůh však ví, že v den, kdy z něho pojíte, otevřou se vám oči a budete jako Bůh znát dobré i zlé."</VERS>
    </CHAPTER>
  </BIBLEBOOK>
  <BIBLEBOOK bnumber="2" bname="2 Mose" bsname="2Mo">
    <CHAPTER cnumber="1">
      <VERS vnumber="1">Toto jsou jména synů Izraelových, kteří přišli do Egypta s Jákobem; každý přišel se svou rodinou:</VERS>
      <VERS vnumber="2">Rúben, Šimeón, Lévi a Juda,</VERS>
      <VERS vnumber="3">Isachar, Zabulón a Benjamín,</VERS>
      <VERS vnumber="4">Dan a Neftalí, Gád a Ašer.</VERS>
      <VERS vnumber="5">Všech, kdo vzešli z Jákobových beder, bylo sedmdesát. Josef už byl v Egyptě.</VERS>
      </CHAPTER>
  </BIBLEBOOK>
</XMLBIBLE>
        `;

    const parser = new TranslationParserXml(testData);
    const data = await parser.getData();
    //console.dir(data);
    const repository = new BibleRepository(elasticAdapter);
    await repository.bulkInsert(data);
    return data;
  }

  public async getTranslations() {
    const repository = new BibleRepository(elasticAdapter);
    //const data = await repository.getTranslationVerses("LATVULG");
    const data = await repository.getTranslations();
    return data;
  }
}
