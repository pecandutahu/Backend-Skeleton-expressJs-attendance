const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../models');
const { check, validationResult } = require('express-validator');
const { deleteFile } = require('../utils/fileUtils');
const upload = require('../middlewares/upload');

const validatePresence = [
  check('employeeId').isLength({min:1}).withMessage("Employe is required").custom( value => {
    
    return db.Employee.findOne({ where: { employeeId: value } }).then(employee => {
      if (!employee) {
        return Promise.reject('Employee does not valid');
      }
    })
    
  }),
  check('presenceTypeId').optional().isLength({min:1}).withMessage("Presence type is required"),
  check('coordinates').isLength({min:1}).withMessage("Location is required"),
];

router.post('/checkin', upload.single('images'), validatePresence, async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: "File not found!",
      });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if(req.file && req.file.path) {
        await deleteFile(req.file.path);
      }
      return res.status(422).json({ errors: errors.array() });
    }
    const { employeeId, presenceTypeId } = req.body;
    const newPresence = await db.Presence.create({
      employeeId,
      presenceTypeId,
      checkIn: new Date(),
      checkInImages: req.file.path,
      checkInCoordinates: req.body.coordinates
    });
    res.json(newPresence);
    
  } catch (error) {
    // Hapus file yang diupload jika ada error
    if (req.file && req.file.path) {
      await deleteFile(req.file.path);
    }

    // Mengembalikan response error
    res.status(500).json({ error: 'An error occurred during check-in', details: error.message });
  }
});

router.post('/checkout',upload.single('images'), validatePresence, async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: "File not found!",
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if(req.file && req.file.path) {
        await deleteFile(req.file.path);
      }
      return res.status(422).json({ errors: errors.array() });
    }

    const { employeeId } = req.body;
    const presence = await db.Presence.findOne({
      where: { employeeId, checkOut: null }
    });

    if (presence) {
      presence.checkOut = new Date();
      presence.checkOutImages= req.file.path;
      presence.checkOutCoordinates = req.body.coordinates;
      await presence.save();
      
      upload.single('checkOutImages');
      res.json(presence);
      
    } else {
      res.status(400).send('No active check-in found');
    }
  } catch (error) {
    
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    res.status(500).json({ error: 'An error occurred during check-in', details: error.message });
  }
});

router.get('/', async (req, res) => {
  const presences = await db.Presence.findAll();
  res.json(presences);
});

module.exports = router;
