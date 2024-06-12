const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../models');
const { check, validationResult } = require('express-validator');
const { deleteFile } = require('../utils/fileUtils');
const upload = require('../middlewares/upload');
const moment = require('moment-timezone');
const { where, Op } = require('sequelize');

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
    const checkInTime = req.currentTime().format(); // Waktu GMT +7
    const newPresence = await db.Presence.create({
      employeeId,
      presenceTypeId,
      checkIn: checkInTime,
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
    
    const now = req.currentTime().format();

    const presence = await db.Presence.findOne({
      where: {
        employeeId, 
        checkOut: null,
        checkIn : {
            [db.Sequelize.Op.gte]: moment(now).startOf('day'),
            [db.Sequelize.Op.lt]: moment(now).endOf('day'),
        }
      },
      order: [['checkIn', 'ASC']]
    });

    if (presence) {
      presence.checkOut = req.currentTime().format();
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
      await deleteFile(req.file.path);
    }
    res.status(500).json({ error: 'An error occurred during check-in', details: error.message });
  }
});

router.get('/', async (req, res) => {
  const presences = await db.Presence.findAll({
    include: [
      {
        model : db.Employee
      },
      {
        model : db.PresenceType
      }
    ]})
  res.json(presences);
});

router.get('/trash', async (req, res) => {
  const presences = await db.Presence.findAll({ where : { deletedAt : {[Op.not]: null}}, paranoid : false });
  res.json(presences);
})

router.get('/:id', async (req, res) => {
  try {
    const presence = await db.Presence.findByPk(req.params.id);
    if (!presence) {
      return res.status(400).json({
        message: "Presence not found!",
      });
    }
    res.json(presence);
    
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during process', details: error.message });
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await db.Presence.destroy({ where: {
      presenceId: req.params.id
    }});
    res.json({ message: 'Presence deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during delete process', details: error.message });
  }
})

module.exports = router;
