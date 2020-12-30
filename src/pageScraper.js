const scraperObject = {
  url: "https://www.vinbudin.is/heim/vorur",
  async scraper(browser, category) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);
    await page.goto(this.url);
    await page.waitForSelector(".category-links-wrapper");

    let scrapedItems = [];

    let categories = await page.$$eval(
      `.voru-link-wrapper.${category} > div`,
      (links) => {
        links = links.map((el) => el.querySelector("div > a").href);
        return links;
      },
    );

    const getAllItems = (link) =>
      new Promise(async (resolve, reject) => {
        let newPage = await browser.newPage();
        await newPage.goto(link);
        const bla = await newPage.$$eval("ul > li.product", (links) => {
          links = links.map((el) => el.querySelector("li > a").href);
          return links;
        });

        resolve(bla);
        await newPage.close();
      });

    let getSingleItem = (link) =>
      new Promise(async (resolve, reject) => {
        let newPage = await browser.newPage();
        await newPage.goto(link);

        const title = await newPage.$eval(
          "h3 > span.product-info-text",
          (text) => text.textContent,
        );

        const productId = await newPage.$eval(
          "h3 > span.product-info-text.product-number-text",
          (text) => text.textContent.replace(/[()]/g, ""),
        );

        const price = await newPage.$eval(
          "div.price > span.money",
          (text) => text.textContent,
        );

        const pricePerLiter = await newPage.$eval(
          "div.price > span.price-per-liter",
          (text) => text.textContent.replace(/[^0-9.]/g, ""),
        );

        const alcoholByVolume = await newPage.$eval(
          "span#ctl01_ctl01_Label_ProductAlchoholVolume",
          (text) => text.textContent,
        );

        const countryOfOrigin = await newPage.$eval(
          "span#ctl01_ctl01_Label_ProductCountryOfOrigin",
          (text) => text.textContent,
        );

        const producer = await newPage.$eval(
          "span#ctl01_ctl01_Label_Producer",
          (text) => text.textContent,
        );

        const wholeSaler = await newPage.$eval(
          "span#ctl01_ctl01_Label_ProductSeller",
          (text) => text.textContent,
        );

        const packaging = await newPage.$eval(
          "span#ctl01_ctl01_Label_ProductPackaging",
          (text) => text.textContent,
        );

        const volume = await newPage.$eval(
          "span#ctl01_ctl01_Label_ProductBottledVolume",
          (text) => text.textContent,
        );

        const imageUrl = await newPage.$eval(
          "div.slick-slide.slick-current.slick-active div div a",
          (el) => el.href,
        );

        resolve({
          title,
          productId,
          price,
          pricePerLiter,
          alcoholByVolume,
          countryOfOrigin,
          producer,
          wholeSaler,
          packaging,
          volume,
          imageUrl,
        });

        await newPage.close();
      });

    for (link in categories) {
      let items = await getAllItems(categories[link]);
      scrapedItems.push(items);
    }

    for (const link of scrapedItems.flat()) {
      let item = await getSingleItem(link);
      console.log(item);
    }
  },
};

module.exports = scraperObject;
