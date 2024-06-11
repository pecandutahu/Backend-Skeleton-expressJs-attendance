module.exports = (sequelize, DataTypes) => {
    return sequelize.define('PresenceType', {
      presenceTypeId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      presenceType: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
  }, {
      paranoid : true //soft deletes
  });
};