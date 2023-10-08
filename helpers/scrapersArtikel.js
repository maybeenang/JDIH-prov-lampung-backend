import axios from "axios";
import * as cheerio from "cheerio";

async function scrapeArtikel() {
  try {
    const response = await axios.get(
      "https://jdih.lampungprov.go.id/download/artikel-hukum"
    );
    const $ = cheerio.load(response.data);
    const articles = $("article");
    const data = [];

    articles.each((index, element) => {
      const title = $(element).find(".post-content h2").text().trim();
      const content = $(element).find(".post-content p").text().trim();
      const tanggal = $(element).find(".post-meta span").text().trim();
      const documentUrl = $(element).find(".post-meta a").attr("href");
      data.push({
        title,
        content,
        tanggal,
        documentUrl,
      });
    });

    for (let i = 0; i < data.length; i++) {
      await axios.post("http://localhost:4000/api/v1/artikel", data[i]);
      console.log(`Data ${i + 1} saved`);
    }
    return data;
  } catch (error) {
    console.error(error);
  }
}

scrapeArtikel();
