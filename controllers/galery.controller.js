import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllGalery = async (req, res) => {
  try {
    let artikel = await prisma.galery.findMany({});

    if (!artikel || artikel.length === 0) {
      return res.status(404).send({ message: "Data not found" });
    }

    return res.status(200).send(artikel);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const createGalery = async (req, res) => {
  try {
    const { title, videoUrl, image } = req.body;

    const arikel = await prisma.galery.create({
      data: {
        title,
        videoUrl,
        image,
      },
    });

    return res.status(201).send(arikel);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
