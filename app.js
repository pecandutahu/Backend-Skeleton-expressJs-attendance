const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');

const employeeRoutes = require('./routes/employee');
const presenceRoutes = require('./routes/presence');
const presenceTypeRoutes = require('./routes/presenceType');
const setTimezone = require('./middlewares/timezone');
const cors = require('cors');

const path = require('path');

const app = express();

app.use(cors());
app.use(setTimezone);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/employee', employeeRoutes);
app.use('/presence', presenceRoutes);
app.use('/presence-type', presenceTypeRoutes);

// Middleware untuk melayani file statis dari direktori 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});
