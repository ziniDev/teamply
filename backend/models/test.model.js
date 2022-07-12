"use strict"
import response from "~/libs/response"
import moment from "moment"
import Sequelize from "sequelize"

const Op = Sequelize.Op

module.exports = (sequelize, DataTypes) => {
  const test1234 = sequelize.define(
    "test1234",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "company_id",
      },
      fcmCode: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "fcm_code",
      },
      type: {
        type: DataTypes.STRING,
      },
      title: {
        type: DataTypes.STRING,
      },
      message: {
        type: DataTypes.TEXT,
      },
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at",
        defaultValue: Sequelize.NOW,
        get: function (val) {
          if (this.getDataValue(val)) {
            return moment(this.getDataValue(val)).format('YYYY-MM-DD HH:mm:ss')
          }
        }
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at",
        defaultValue: Sequelize.NOW,
        get: function (val) {
          if (this.getDataValue(val)) {
            return moment(this.getDataValue(val)).format('YYYY-MM-DD HH:mm:ss')
          }
        }
      },
      deletedAt: {
        type: DataTypes.DATE,
        field: "deleted_at",
        get: function (val) {
          if (this.getDataValue(val)) {
            return moment(this.getDataValue(val)).format('YYYY-MM-DD HH:mm:ss')
          }
        }
      },
    },
    {
      schema: "public",
      tableName: "test1234",
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  )

  return test1234
}
