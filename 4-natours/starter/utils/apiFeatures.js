const db = require('../models');

const Op = db.Op;
const Tour = db.tours;

const testo = {
  attributes: ['name', 'duration', 'price'],
  where: { page: '1', limit: '3', price: { gte: '1000' } },
  order: [['price', 'ASC']]
};

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter(query) {
    const keys = Object.keys(query);
    for (let i = 0; i < keys.length; i += 1) {
      const test = Object.getOwnPropertyNames(query[keys[i]]).toString();

      switch (test) {
        case 'gte':
          query[keys[i]] = { [Op.gte]: query[keys[i]].gte };
          break;
        case 'lte':
          query[keys[i]] = { [Op.lte]: query[keys[i]].lte };
          break;
        case 'lt':
          query[keys[i]] = { [Op.lt]: query[keys[i]].lt };
          break;
        case 'gt':
          query[keys[i]] = { [Op.gt]: query[keys[i]].gt };
          break;
        default:
          break;
      }
    }
    return { where: query };
  }
}

const features = new APIFeatures(Tour.findAll(), testo).filter();
const tours = features.query;
console.log(tours);
