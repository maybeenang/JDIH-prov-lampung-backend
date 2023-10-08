import * as puppeteer from "puppeteer";
import axios from "axios";

async function scrapeData() {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto("https://jdih.lampungprov.go.id/katalog-buku", {
    waitUntil: "networkidle2",
  });

  const data = await page.evaluate(() => {
    const books = document.querySelectorAll("#renderbuku .row .col-lg-3");
    const result = [];

    books.forEach((book) => {
      const title = book.querySelector(".thumb-info-title a").textContent;
      const image = book.querySelector("img").src;
      const url = book.querySelector("a").href;

      result.push({
        title,
        image,
        url,
      });
    });

    return result;
  });

  console.log(data);

  for (let i = 0; i < data.length; i++) {
    await axios.post("http://localhost:4000/api/v1/monografi", data[i]);
    console.log(`Data ${i + 1} saved`);
  }

  await browser.close();
}

scrapeData();
