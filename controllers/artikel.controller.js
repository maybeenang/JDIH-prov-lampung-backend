import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllArtikel = async (req, res) => {
  try {
    let artikel = await prisma.article.findMany({});

    if (!artikel || artikel.length === 0) {
      return res.status(404).send({ message: "Article not found" });
    }

    return res.status(200).send(artikel);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const createArtikel = async (req, res) => {
  try {
    const { title, content, tanggal, documentUrl } = req.body;

    const arikel = await prisma.article.create({
      data: {
        title,
        content,
        tanggal,
        documentUrl,
      },
    });

    return res.status(201).send(arikel);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
