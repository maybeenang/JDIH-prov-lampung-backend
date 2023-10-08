import axios from "axios";
import * as cheerio from "cheerio";
import * as fs from "fs";
import readFile from "./readFile.js";

async function getPageLength() {
  try {
    const response = await axios.get(
      "https://jdih.lampungprov.go.id/post/berita"
    );
    const $ = cheerio.load(response.data);
    const pageLength = $(".pagination .pagination li").last().prev().text();
    return pageLength;
  } catch (error) {
    console.error(error);
  }
}

async function scrapeData(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const articles = $("article");
    const data = [];

    articles.each((index, element) => {
      const title = $(element).find("h4").text().trim();
      const image = $(element).find("img").attr("src");
      const keterangan = $(element).find(".card-body p").first().text();

      const tanggal = keterangan.split("|")[0].trim();
      const dilihat = keterangan.split("|")[1].trim().split("x")[0];

      const url = $(element).find("a").attr("href");
      data.push({
        title,
        image,
        tanggal,
        dilihat,
        keterangan,
        url,
      });
    });

    for (let i = 0; i < data.length; i++) {
      const content = await getContent(data[i].url);
      data[i].content = content;
      await axios.post("http://localhost:4000/api/v1/berita", data[i]);
      console.log(`Data ${i + 1} saved`);
    }

    return data;
  } catch (error) {
    console.error(error);
  }
}

async function getContent(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const content = $("article .card-body .card-body p").text().trim();

    return content;
  } catch (error) {
    console.error(error);
  }
}

async function main() {
  console.log("Start Scraping");
  const pageLength = await getPageLength();
  console.log(`Total page: ${pageLength}`);
  const urls = [];
  const data = [];
  for (let i = 1; i <= pageLength; i++) {
    urls.push(`https://jdih.lampungprov.go.id/post/berita?page=${i}`);
  }
  for (let i = 0; i < urls.length; i++) {
    console.log(`Scraping page ${i + 1}`);
    const result = await scrapeData(urls[i]);
    data.push(result);
    console.log(`Page ${i + 1} done`);
  }

  try {
    fs.writeFileSync("./result.json", JSON.stringify(data));
    console.log("Data saved success");
    // file written successfully
  } catch (err) {
    console.error(err);
  }
}

main();
