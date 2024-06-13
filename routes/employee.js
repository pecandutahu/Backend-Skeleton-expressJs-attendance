const express = require('express');
const {check, validationResult } = require('express-validator');
const router = express.Router();
const db = require('../models');
const { where, Op } = require('sequelize');

const validateEmployee = [
    check('nik').isLength({min: 3 }).withMessage("NIK requires a minimum of 2 character.").custom(async (value, { req }) => {
        const employeeId = req.params.id || null;
        const employee = await db.Employee.findOne({ where: { nik: value } });
        if(employee){
            if(employeeId != employee.employeeId){
                return Promise.reject("NIK " + employee.nik + " already registered");
            }
        }
    }),
    
    check('name').isString().withMessage('Name must be string.').isLength({ min:2 }).withMessage("The name requires a minimum of 2 characters"),
    check('unit').isLength({min: 2}).withMessage("The unit requires a minimum of 2 characters")
]

router.get('/', async (req, res) => {
    const employee = await db.Employee.findAll();
    res.json(employee);
});

router.get('/trash', async (req, res) => {
    const employee = await db.Employee.findAll({where : { deletedAt : {[Op.not]: null}}, paranoid : false });
    res.json(employee);
});

router.get('/:id', async (req, res) => {
    const employee = await db.Employee.findOne({where: {employeeId : req.params.id}});
    res.json(employee);
});

router.post('/', validateEmployee, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const newEmployee = await db.Employee.create(req.body);
    res.json(newEmployee);
});

router.put('/:id', validateEmployee, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const updateEmployee = await db.Employee.update(req.body, {
        where: { employeeId: req.params.id }
    });
    res.json(updateEmployee);
});

router.delete('/:id', async (req, res) => {
    await db.Employee.destroy({ where: { employeeId: req.params.id } });
    res.sendStatus(200);
});

module.exports = router;
