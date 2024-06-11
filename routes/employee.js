const express = require('express');
const {check, validationResult } = require('express-validator');
const router = express.Router();
const db = require('../models');
const { where, Op } = require('sequelize');

const validateEmployee = [
    check('nik').isLength({min: 3 }).withMessage("NIK minimal 3 karakter / angka.").custom( value => {
        return db.Employee.findOne({ where: { nik: value } }).then(employee => {
            if(employee!=null){
                return Promise.reject("NIK " + employee.nik + " sudah terdaftar!")
            }
        })
    }),
    
    check('name').isString().withMessage('Nama harus berupa string').isLength({ min:2 }).withMessage("Nama minimal harus 2 karakter"),
    check('unit').isLength({min: 2}).withMessage("Unit minimal harus 2 karakter")
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

router.put('/:id', async (req, res) => {
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
