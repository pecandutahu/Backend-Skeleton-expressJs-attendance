const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const db = require('./models');

const employeeRoutes = require('./routes/employee');
const presenceRoutes = require('./routes/presence');
const presenceTypeRoutes = require('./routes/presenceType');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));
app.use('/employee', employeeRoutes);
app.use('/presence', presenceRoutes);
app.use('/presence-type', presenceTypeRoutes);

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});
