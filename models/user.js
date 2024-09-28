'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Url, { foreignKey: 'user_id' });
      User.hasMany(models.Click, { foreignKey: 'user_id' });
    }
  }
  User.init({
    username: DataTypes.STRING,
    password_hash: DataTypes.STRING, 
    email: DataTypes.STRING,
    full_name: DataTypes.STRING, 
    address1: DataTypes.STRING,
    address2: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    mobile: DataTypes.STRING,
    withdrawal_method: DataTypes.STRING,
    withdrawal_account: DataTypes.STRING,
    CPM: DataTypes.DECIMAL(10, 2),
    is_active: DataTypes.BOOLEAN, 
    user_type: DataTypes.ENUM('admin', 'worker'),
    createdAt: DataTypes.DATE, 
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
    underscored: false, 
  });
  return User;
};
