import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllBerita = async (req, res) => {
  try {
    let berita = await prisma.berita.findMany({});

    if (!berita || berita.length === 0) {
      return res.status(404).send({ message: "Berita not found" });
    }

    return res.status(200).send(berita);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getBeritaById = async (req, res) => {
  try {
    const { id } = req.params;

    let berita = await prisma.berita.findUnique({
      where: {
        id: id,
      },
    });

    if (!berita) {
      return res.status(404).send({ message: "Berita not found" });
    }

    berita = await prisma.berita.update({
      where: {
        id: id,
      },
      data: {
        dilihat: berita.dilihat + 1,
      },
    });

    return res.status(200).send(berita);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const createBerita = async (req, res) => {
  try {
    const { title, content, image, tanggal, dilihat } = req.body;

    const berita = await prisma.berita.create({
      data: {
        title,
        content,
        image,
        tanggal,
        dilihat: parseInt(dilihat),
      },
    });

    return res.status(201).send(berita);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const updateBerita = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({ message: "Id cannot be empty" });
    }

    const { title, content, image } = req.body;

    if (!title || !content || !image) {
      return res
        .status(400)
        .send({ message: "Title, content, and image cannot be empty" });
    }

    const berita = await prisma.berita.update({
      where: {
        id: id,
      },
      data: {
        title,
        content,
        image,
        updatedAt: new Date(),
      },
    });

    if (!berita) {
      return res.status(404).send({ message: "Berita not found" });
    }

    return res.status(200).send(berita);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const deleteBerita = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({ message: "Id cannot be empty" });
    }

    const berita = await prisma.berita.delete({
      where: {
        id: id,
      },
    });

    if (!berita) {
      return res.status(404).send({ message: "Berita not found" });
    }

    return res.status(200).send(berita);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
