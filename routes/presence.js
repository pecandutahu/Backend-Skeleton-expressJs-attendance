const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../models');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/checkin', upload.single('image'), async (req, res) => {
  const { nik, tipePresensiId, coordinates } = req.body;
  const newPresensi = await db.Presensi.create({
    nik,
    tipePresensiId,
    checkIn: new Date(),
    images: req.file.path,
    coordinates
  });
  res.json(newPresensi);
});

router.post('/checkout', async (req, res) => {
  const { nik } = req.body;
  const presensi = await db.Presensi.findOne({
    where: { nik, checkOut: null }
  });
  if (presensi) {
    presensi.checkOut = new Date();
    await presensi.save();
    res.json(presensi);
  } else {
    res.status(400).send('No active check-in found');
  }
});

module.exports = router;
