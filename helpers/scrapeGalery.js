import axios from "axios";
import * as cheerio from "cheerio";

// title String
// videoUrl String
// image String @default("https://picsum.photos/200/300")

async function scrapeData(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const articles = $(".appear-animation");
    const data = [];

    articles.each((index, element) => {
      const title = $(element).find(".card-body h4").text().trim();
      const videoUrl = $(element).find("a").attr("href");
      const image = $(element).find("img").attr("src");
      data.push({
        title,
        videoUrl,
        image,
      });
    });

    for (let i = 0; i < data.length; i++) {
      await axios.post("http://localhost:3000/api/v1/galery", data[i]);
      console.log(`Data ${i + 1} saved`);
    }
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function main() {
  console.log("Start Scraping");
  const pageLength = 3;
  console.log(`Total page: ${pageLength}`);
  const urls = [];
  const data = [];
  for (let i = 1; i <= pageLength; i++) {
    urls.push(`https://jdih.lampungprov.go.id/video/all?page=${i}`);
  }
  for (let i = 0; i < urls.length; i++) {
    console.log(`Scraping page ${i + 1}`);
    const result = await scrapeData(urls[i]);
    data.push(result);
    console.log(`Page ${i + 1} done`);
  }
}

main();
