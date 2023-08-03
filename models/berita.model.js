export default (sequelize, Sequelize) => {
  const Berita = sequelize.define("berita", {
    judul: {
      type: Sequelize.STRING,
    },
    isi: {
      type: Sequelize.STRING,
    },
    gambar: {
      type: Sequelize.STRING,
    },
    tanggal: {
      type: Sequelize.DATE,
    },
    terlihat: {
      type: Sequelize.INTEGER,
    },
  });

  return Berita;
};
