module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Presence', {
      presenceId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nik: DataTypes.STRING,
      presenceTypeId: DataTypes.INTEGER,
      checkIn: DataTypes.DATE,
      checkOut: DataTypes.DATE,
      images: DataTypes.STRING,
      coordinates: DataTypes.GEOMETRY("POINT", 4326),
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
  }, {
      paranoid : true //soft deletes
  });
  };
  