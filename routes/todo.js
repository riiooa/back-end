const express = require("express");
const router = express.Router();
const TodoModel = require("../models/todo");
const UserModel = require("../models/users");
const { Op } = require("sequelize");

// routing endpoint utama
router.get("/:nim", async (req, res) => {
  const { nim } = req.params;
  const todo = await TodoModel.findAll({ where: { users_nim: nim } });
  res.status(200).json({
    data: todo,
    metadata: "Daftar dari user",
  });
});

router.get("/detail/:id", async (req, res) => {
  const { id } = req.params;
  const todo = await TodoModel.findOne({ where: { id: id } });
  res.status(200).json({
    data: todo,
    metadata: "Data Todo Keseluruhan",
  });
});

router.post("/add", async (req, res) => {
  try {
    const { nim, nama, tanggal, deskripsi } = req.body;
    // Check if user exists
    const user = await UserModel.findOne({
      where: { nama: nama, nim: nim },
    });

    if (!user) {
      return res.status(400).json({ error: "User tidak ditemukan!" });
    }

    // Create todo
    const todo = await TodoModel.create({
      users_nim: nim,
      users_nama: nama,
      deskripsi: deskripsi,
      tanggal: tanggal,
      status: "Belum selesai",
    });

    return res.json({ status: 200, data: todo });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Data Gagal ditambah!" });
  }
});

router.put("/", async (req, res) => {
  const { id, tanggal, deskripsi } = req.body;

  const count = await TodoModel.update(
    { deskripsi, tanggal },
    {
      where: {
        id: id,
      },
    }
  );

  if (count[0] === 1) {
    res.status(200).json({
      status: 200,
      list: { updated: count[0] },
      metadata: "Edit berhasil",
    });
  } else {
    res.status(404).json({
      error: "List tidak ditemukan",
    });
  }
});

// mengubah status menjadi checked
router.put("/check/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const todo = await TodoModel.findOne({
      where: { id: id},
    });

    if (!todo){
      res.status(400).json({ error: "Todo tidak ditemukan!"});
    } else {
      TodoModel.update(
        { status: "Selesai" },
        {
          where: {
            id: id,
          },
        }
      );
    return res.json
    ({ message: "Data berhasil diselesaikan!" });
    }
  } catch (error) {
    
  }
});

router.put("/uncheck/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const todo = await TodoModel.findOne({
      where: { id: id},
    });

    if (!todo){
      res.status(400).json({ error: "Todo tidak ditemukan!"});
    } else {
      TodoModel.update(
        { status: "Belum Selesai" },
        {
          where: {
            id: id,
          },
        }
      );
    return res.json
    ({ message: "Data berhasil diuncheck!" });
    }
  } catch (error) {
    
  }
});

// menghapus data sesuai nama dan id data
router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  const count = await TodoModel.destroy({
    where: {
      id: id,
    },
  });

  if (count === 0) {
    return res.status(404).json({ error: "Todo tidak ditemukan!" });
  }
  return res.json({ status: 200, message: "Data berhasil dihapus!" });
});

router.get("/search/all", async (req, res) => {
  const { nim, deskripsi } = req.query;
  try {
    const todos = await TodoModel.findAll({
      where: {
        [Op.and]: [
          { users_nim: nim },
          {
            deskripsi: {
              [Op.like]: `%${deskripsi}%`,
            },
          },
        ],
      },
    });
    return res.json(todos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Data gagal ditemukan!" });
  }
});

module.exports = router;
