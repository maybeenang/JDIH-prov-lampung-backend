import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllMonografi = async (req, res) => {
  try {
    let artikel = await prisma.monografi.findMany({});

    if (!artikel || artikel.length === 0) {
      return res.status(404).send({ message: "Monografi not found" });
    }

    return res.status(200).send(artikel);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const createMonografi = async (req, res) => {
  try {
    const { title, image, url } = req.body;

    const arikel = await prisma.monografi.create({
      data: {
        title,
        image,
        url,
      },
    });

    return res.status(201).send(arikel);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
