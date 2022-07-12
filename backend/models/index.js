"use strict"
import fs from "fs"
import path from "path"
import config from "config"
import Sequelize from "sequelize"

let db = {}

let dbConfig = {
  modelPattern: __dirname + "/*.model.js",
  logging: console.log,
}

let dbSetting = appConfig.get("dbConfig")

dbConfig = Object.assign(dbConfig, dbSetting)
let sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
)

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.slice(-9) === ".model.js"
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    )
    db[model.name] = model
  })

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

sequelize.sync().then(
  function () {
    console.log("DB connection sucessful.")
  },
  function (err) {
    console.log(err)
  }
)

module.exports = db
