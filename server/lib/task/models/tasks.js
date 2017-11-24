'use strict';

module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    'Task',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'Task',
      classMethods: {
        associate(db) {
          this.hasMany(db.Tag, {
            as: 'tags',
            foreignKey: 'taskId',
            onDelete: 'CASCADE',
          });
        },
      },
    }
  );

  return Task;
};
