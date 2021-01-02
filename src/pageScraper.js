const scraperObject = {
  async scraper(browser, startingUrl) {
    let page = await browser.newPage();
    await page.goto(startingUrl);
    let scrapedData = [];

    const scrapeCurrentPage = async () => {
      console.log(`Navigating to ${await page.url()}`);
      await page.waitForSelector(".inner");
      let productLinks = await page.$$eval("ul > li.product", (links) => {
        links = links.map((el) => el.querySelector("li > a").href);

        return links;
      });

      let getSingleItem = (url) =>
        new Promise(async (resolve, reject) => {
          let newPage = await browser.newPage();
          await newPage.goto(url);

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

          const supplier = await newPage.$eval(
            "span#ctl01_ctl01_Label_ProductSeller",
            (text) => text.textContent,
          );

          let packaging = "";

          try {
            packaging = await newPage.$eval(
              "span#ctl01_ctl01_Label_ProductPackaging",
              (text) => text.textContent,
            );
          } catch (error) {
            packaging = "n/a";
          }

          const volume = await newPage.$eval(
            "span#ctl01_ctl01_Label_ProductBottledVolume",
            (text) => text.textContent,
          );

          let imageUrl = "";

          try {
            const url = await newPage.$eval(
              "div.slick-slide.slick-current.slick-active div div a",
              (el) => el.href,
            );

            imageUrl = url;
          } catch (error) {
            imageUrl = "n/a";
          }

          resolve({
            title,
            productId,
            price,
            pricePerLiter,
            alcoholByVolume,
            countryOfOrigin,
            producer,
            supplier,
            packaging,
            volume,
            imageUrl,
          });

          await newPage.close();
        });

      for (link of productLinks) {
        let currentPageData = await getSingleItem(link);
        scrapedData.push(currentPageData);
      }

      const isDisabled =
        (await page.$("ul.pagination li:last-child.disabled")) !== null;

      if (!isDisabled) {
        await page.click("ul.pagination li:last-child");
        await page.waitForSelector(".loader", { visible: true });
        await page.waitForSelector(".loader", { visible: false });

        return scrapeCurrentPage();
      }

      await page.close();

      return scrapedData;
    };

    let data = await scrapeCurrentPage();
    return data;
  },
};

module.exports = scraperObject;
