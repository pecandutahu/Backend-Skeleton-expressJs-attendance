module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Presence', {
      presenceId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      employeeId: DataTypes.INTEGER,
      presenceTypeId: DataTypes.INTEGER,
      checkIn: DataTypes.DATE,
      checkOut: DataTypes.DATE,
      checkInImages: DataTypes.STRING,
      checkOutImages: DataTypes.STRING,
      checkInCoordinates: DataTypes.STRING,
      checkOutCoordinates: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
  }, {
      paranoid : true //soft deletes
  });
  };
  