const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Employee = require('./employee')(sequelize, DataTypes);
db.Presence = require('./presence')(sequelize, DataTypes);
db.PresenceType = require('./presenceType')(sequelize, DataTypes);

db.Employee.hasMany(db.Presence, { foreignKey: 'employeeId' });
db.Presence.belongsTo(db.Employee, { foreignKey: 'employeeId' });

db.PresenceType.hasMany(db.Presence, {foreignKey: 'presenceTypeId'});
db.Presence.belongsTo(db.PresenceType, {foreignKey: 'presenceTypeId'});

module.exports = db;