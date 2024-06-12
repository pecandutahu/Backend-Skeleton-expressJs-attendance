const express = require('express');
const router = express.Router();
const db = require('../models');
const { check, validationResult } = require('express-validator');
const presence = require('../models/presence');
const presenceType = require('../models/presenceType');
const { where, Op } = require('sequelize');

const validatePersenceType = [
  check('presenceType').isLength({ min: 2}).withMessage("Type of presence requires a minimum of 2 characters.")
];

router.get('/', async (req, res) => {
  const PresenceType = await db.PresenceType.findAll();
  res.json(PresenceType);
});

router.get('/trash', async (req, res) => {
  const PresenceType = await db.PresenceType.findAll({where : {deletedAt: { [Op.not]: null }}, paranoid:false});
  res.json(PresenceType);
})

router.get('/:id', async (req, res) => {
  const PresenceType = await db.PresenceType.findOne({ where : {presenceTypeId : req.params.id}});
  if(!PresenceType) {
    return res.status(404).json('Not found');
  }
  res.json(PresenceType);
})

router.post('/', validatePersenceType, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()})
  }
  const newPresenceType = await db.PresenceType.create(req.body);
  res.json(newPresenceType);
});

router.put('/:id', validatePersenceType, async (req, res) => {
  const updatedPresenceType = await db.PresenceType.update(req.body, {
    where: { presenceTypeId: req.params.id }
  });
  res.json("Success update data");
});

router.delete('/:id', async (req, res) => {
  await db.PresenceType.destroy({ where: { presenceTypeId: req.params.id } });
  res.json('Success delete data');
});

module.exports = router;
