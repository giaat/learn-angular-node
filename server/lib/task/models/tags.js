'use strict';

module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    'Tag',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'Tag',
      classMethods: {
        associate(db) {
          this.belongsTo(db.Task, { as: 'task', foreignKey: 'taskId' });
        },
      },
    }
  );

  return Tag;
};
