const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');

const employeeRoutes = require('./routes/employee');
const presenceRoutes = require('./routes/presence');
const presenceTypeRoutes = require('./routes/presenceType');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/employee', employeeRoutes);
app.use('/presence', presenceRoutes);
app.use('/presence-type', presenceTypeRoutes);

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});
