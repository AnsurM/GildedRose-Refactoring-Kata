import { Item, GildedRose } from "@/gilded-rose";

enum ItemNames {
  AgedBrie = "Aged Brie",
  Conjured = "Conjured Mana Cake",
  Vest = "+5 Dexterity Vest",
  Elixir = "Elixir of the Mongoose",
  Passes = "Backstage passes to a TAFKAL80ETC concert",
  Sulfuras = "Sulfuras, Hand of Ragnaros",
}

const ItemsDictionary = {
  AgedBrie: new Item(ItemNames.AgedBrie, 2, 0),
  Conjured: new Item(ItemNames.Conjured, 3, 6),
  Vest: new Item(ItemNames.Vest, 10, 20),
  Elixir: new Item(ItemNames.Elixir, 5, 7),
  Passes: new Item(ItemNames.Passes, 15, 20),
  Sulfuras: new Item(ItemNames.Sulfuras, -1, 80),
};

describe("Gilded Rose", () => {
  it("Both implementations should return the same output after multiple days", () => {
    const gildedRoseOriginal = new GildedRose([
      { ...ItemsDictionary.Sulfuras },
      { ...ItemsDictionary.AgedBrie },
      { ...ItemsDictionary.Vest },
      { ...ItemsDictionary.Elixir },
      { ...ItemsDictionary.Passes },
    ]);
    const gildedRose = new GildedRose([
      { ...ItemsDictionary.Sulfuras },
      { ...ItemsDictionary.AgedBrie },
      { ...ItemsDictionary.Vest },
      { ...ItemsDictionary.Elixir },
      { ...ItemsDictionary.Passes },
    ]);

    let itemsOriginal = gildedRoseOriginal.updateQualityOriginal();
    let items = gildedRose.updateQuality();
    for (let index = 0; index < 19; index++) {
      itemsOriginal = gildedRoseOriginal.updateQualityOriginal();
      items = gildedRose.updateQuality();
    }
    expect(items).toMatchObject(itemsOriginal);
  });

  it("Non(Sulfuras/Aged Brie/Pass/Conjured) items quality should decrease by 1", () => {
    const gildedRose = new GildedRose([
      { ...ItemsDictionary.Vest },
      { ...ItemsDictionary.Elixir },
      // some random item to be treated like naturally degrading items
      new Item("Baby Shark Doo Doo", 4, 10),
    ]);
    const items = gildedRose.updateQuality();
    expect(items).toMatchObject([
      new Item(ItemNames.Vest, 9, 19),
      new Item(ItemNames.Elixir, 4, 6),
      new Item("Baby Shark Doo Doo", 3, 9),
    ]);
  });

  it("Conjured items quality should decrease by 2", () => {
    const gildedRose = new GildedRose([{ ...ItemsDictionary.Conjured }]);
    const items = gildedRose.updateQuality();
    expect(items[0]).toMatchObject(new Item(ItemNames.Conjured, 2, 4));
  });
  it("Sulfuras attributes should always be unaltered", () => {
    const gildedRose = new GildedRose([{ ...ItemsDictionary.Sulfuras }]);
    const items = gildedRose.updateQuality();
    expect(items[0]).toMatchObject({ ...ItemsDictionary.Sulfuras });
  });
  it("Quality should not exceed 50 after multiple days", () => {
    const gildedRose = new GildedRose([
      { ...ItemsDictionary.AgedBrie, sellIn: 0, quality: 48 },
    ]);
    let items = gildedRose.updateQuality();
    items = gildedRose.updateQuality();
    expect(items[0]).toMatchObject(new Item(ItemNames.AgedBrie, -2, 50));
  });
  describe("Aged Brie tests", () => {
    it("quality should increase by 1 before sell date passes", () => {
      const gildedRose = new GildedRose([{ ...ItemsDictionary.AgedBrie }]);
      const items = gildedRose.updateQuality();
      expect(items[0]).toMatchObject(new Item(ItemNames.AgedBrie, 1, 1));
    });
    it("quality should increase by 2 if sell date has passed", () => {
      const gildedRose = new GildedRose([
        { ...ItemsDictionary.AgedBrie, sellIn: 0 },
      ]);
      const items = gildedRose.updateQuality();
      expect(items[0]).toMatchObject(new Item(ItemNames.AgedBrie, -1, 2));
    });
  });

  describe("Backstage Pass tests", () => {
    it("quality should increase by 1 if more than 11 days remain", () => {
      const gildedRose = new GildedRose([{ ...ItemsDictionary.Passes }]);
      const items = gildedRose.updateQuality();
      expect(items[0]).toMatchObject(new Item(ItemNames.Passes, 14, 21));
    });
    it("quality should increase by 2 if less than 11 days remain", () => {
      const gildedRose = new GildedRose([
        { ...ItemsDictionary.Passes, sellIn: 10 },
      ]);
      const items = gildedRose.updateQuality();
      expect(items[0]).toMatchObject(new Item(ItemNames.Passes, 9, 22));
    });
    it("quality should increase by 3 if less than 6 days remain", () => {
      const gildedRose = new GildedRose([
        { ...ItemsDictionary.Passes, sellIn: 5 },
      ]);
      const items = gildedRose.updateQuality();
      expect(items[0]).toMatchObject(new Item(ItemNames.Passes, 4, 23));
    });
    it("quality should become 0 if sell by date passes", () => {
      const gildedRose = new GildedRose([
        { ...ItemsDictionary.Passes, sellIn: 0 },
      ]);
      const items = gildedRose.updateQuality();
      expect(items[0]).toMatchObject(new Item(ItemNames.Passes, -1, 0));
    });
  });
});
