import Sequelize from 'sequelize'
const Op = Sequelize.Op

// eslint-disable-next-line
Number.prototype.format = function () {
  if (this === 0) return 0
  let reg = /(^[+-]?\d+)(\d{3})/
  let n = (this + '')
  // eslint-disable-next-line
  while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2')
  return n
}

// eslint-disable-next-line
String.prototype.format = function () {
  let num = parseFloat(this)
  if (isNaN(num)) return '0'
  return num.format()
}

// eslint-disable-next-line
String.prototype.dayFormat = function () {
  return this.replace('Sunday', '(일)').replace('Monday', '(월)')
  .replace('Tuesday', '(화)').replace('Wednesday', '(수)')
  .replace('Thursday', '(목)').replace('Friday', '(금)')
  .replace('Saturday', '(토)').replace('Sunday', '(일)')
  .replace('Mon', '(월)').replace('Tue', '(화)')
  .replace('Wed', '(수)').replace('Thu', '(목)')
  .replace('Fri', '(금)').replace('Sat', '(토)')
}

export const convertMinute2HourMinute = (m) => {
  let hour = parseInt(m / 60)
  let minute = m % 60

  if (minute < 10) minute = '0' + minute 

  return (hour > 0 ? hour + '시간' : '') + (minute + '분')
}

export const buildSearch = (_, like) => {
  let search = {} 
  if (_.count) {
    search.limit = _.count
    delete _.count
  }
  if (_.offset) {
    search.offset = _.offset
    delete _.offset
  }
  if (_.order) {
    search.order = [[_.order, _.desc || 'asc']]
    delete _.order
    delete _.desc
  }

  if (like) {
    for (let i in _) {
      if (i === 'id' || i.indexOf('Id') > -1)
        _[i] = parseInt(_[i])
      else
        _[i] = { [Op.like]: '%' + _[i] + '%'}
    }

    search.where = _
  }

  return search
}

export const buildList = async (search, models, tableName, where, includes) => {
  let notnull = {id: {[Op.ne]: null}}

  if (includes) {
    search.include = []
    let keys = Object.keys(includes)
    for (let k in keys) {
      let where = Object.assign(includes[keys[k]], notnull)
      search.include.push({ model: models[keys[k]], where: where })
    }
  }

  if (where) {
    if (search.where) {
      search.where = Object.assign(search.where, where)
    } else {
      search.where = where
    }
  }

  const list = await models[tableName].findAll(search)
  const total = await models[tableName].count(search)

  const result = {
    list,
    etc: {
      total,
      count: search.limit || total,
      offset: search.offset || 0,
    }
  }

  return result
}
