export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

enum ItemsList {
  BRIE = "Aged Brie",
  PASSES = "Backstage passes to a TAFKAL80ETC concert",
  SULFURAS = "Sulfuras, Hand of Ragnaros",
  Conjured = "Conjured",
}

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  // The method that was originally provided with the problem
  updateQualityOriginal() {
    for (let i = 0; i < this.items.length; i++) {
      if (
        this.items[i].name != "Aged Brie" &&
        this.items[i].name != "Backstage passes to a TAFKAL80ETC concert"
      ) {
        if (this.items[i].quality > 0) {
          if (this.items[i].name != "Sulfuras, Hand of Ragnaros") {
            this.items[i].quality = this.items[i].quality - 1;
          }
        }
      } else {
        if (this.items[i].quality < 50) {
          this.items[i].quality = this.items[i].quality + 1;
          if (
            this.items[i].name == "Backstage passes to a TAFKAL80ETC concert"
          ) {
            if (this.items[i].sellIn < 11) {
              if (this.items[i].quality < 50) {
                this.items[i].quality = this.items[i].quality + 1;
              }
            }
            if (this.items[i].sellIn < 6) {
              if (this.items[i].quality < 50) {
                this.items[i].quality = this.items[i].quality + 1;
              }
            }
          }
        }
      }
      if (this.items[i].name != "Sulfuras, Hand of Ragnaros") {
        this.items[i].sellIn = this.items[i].sellIn - 1;
      }
      if (this.items[i].sellIn < 0) {
        if (this.items[i].name != "Aged Brie") {
          if (
            this.items[i].name != "Backstage passes to a TAFKAL80ETC concert"
          ) {
            if (this.items[i].quality > 0) {
              if (this.items[i].name != "Sulfuras, Hand of Ragnaros") {
                this.items[i].quality = this.items[i].quality - 1;
              }
            }
          } else {
            this.items[i].quality =
              this.items[i].quality - this.items[i].quality;
          }
        } else {
          if (this.items[i].quality < 50) {
            this.items[i].quality = this.items[i].quality + 1;
          }
        }
      }
    }
    return this.items;
  }

  // My implementation
  updateQuality() {
    this.items.forEach((item) => {
      // exception case for Sulfuras, don't alter quality or sellIn
      if (item.name === ItemsList.SULFURAS) return;
      // update quality
      switch (item.name) {
        // handle case for BRIE separately
        case ItemsList.BRIE: {
          item.quality += item.sellIn <= 0 ? 2 : 1;
          break;
        }
        // handle case for PASSES separately
        case ItemsList.PASSES: {
          if (item.sellIn <= 0) item.quality = 0;
          else if (item.sellIn < 6) item.quality += 3;
          else if (item.sellIn < 11) item.quality += 2;
          else item.quality += 1;
          break;
        }
        // handle all other possibilities here
        default: {
          // if item falls in "Conjured" category, such as Conjured Mana Cake
          if (item.name.includes(ItemsList.Conjured)) {
            item.quality -= 2;
          }
          // any items except BRIE, PASSES and Conjured come here
          else {
            if (item.sellIn <= 0) item.quality -= 2;
            else item.quality -= 1;
          }
          break;
        }
      }
      // update sellIn
      item.sellIn -= 1;
      // protective cover if item (is not Sulfuras and) goes beyond these constraints 0 < quality < 50
      if (item.name !== ItemsList.SULFURAS) {
        if (item.quality < 0) item.quality = 0;
        else item.quality = Math.min(item.quality, 50);
      }
    });
    return this.items;
  }
}
