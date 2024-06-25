module.exports = (sequelize, DataTypes) => {
  const Presence = sequelize.define('Presence', {
    presenceId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    presenceTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    checkIn: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    checkOut: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    checkInImages: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    checkOutImages: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    checkInCoordinates: {
      type: DataTypes.GEOMETRY('POINT', 4326),
      allowNull: true,
    },
    checkOutCoordinates: {
      type: DataTypes.GEOMETRY('POINT', 4326),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    paranoid: true, // enable soft deletes
    timestamps: true, // automatically adds createdAt and updatedAt fields
  });


  Presence.associate = models => {
    Presence.belongsTo(models.Employee, {
        foreignKey: 'employeeId',
        as: 'Employee'
    });
    Presence.belongsTo(models.PresenceType, {
      foreignKey: 'presenceTypeId',
      as: 'PresenceType'
    });
  };
  return Presence;
};

  