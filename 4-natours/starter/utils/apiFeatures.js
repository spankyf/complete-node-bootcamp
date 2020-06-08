const db = require('../models');

const Op = db.Op;
// const Tour = db.tours;

// const testo = {
//   duration: { gte: '7' },
//   price: { gt: 1000 },
//   page: '2',
//   limit: '3',
//   sort: '-price,duration',
//   fields: 'name,duration,price'
// };

class APIFeatures {
  constructor(sequelizeModel, queryJSON) {
    this.queryJSON = queryJSON;
    this.sequelizeModel = sequelizeModel;
  }

  limitFields() {
    if (Object.keys(this.queryJSON).includes('fields')) {
      this.queryJSON.attributes = this.queryJSON.fields.split(',');
      delete this.queryJSON.fields;
    }
    // console.log('Field limiting complete');
    return this;
  }

  order() {
    if (Object.keys(this.queryJSON).includes('sort')) {
      this.queryJSON.order = this.queryJSON.sort
        .split(',')
        .map((str) => (str.charAt(0) === '-' ? [str.substring(1), 'DESC'] : [str, 'ASC']));
      delete this.queryJSON.sort;
    }
    // console.log('Sorting complete');

    return this;
  }

  paginate() {
    this.queryJSON.page = Object.keys(this.queryJSON).includes('page') ? this.queryJSON.page * 1 : 1;
    this.queryJSON.offset = Object.keys(this.queryJSON).includes('limit') ? this.queryJSON.limit * 1 : 5;
    delete this.queryJSON.limit;
    // console.log('Pagination complete');

    return this;
  }

  filter() {
    const filteredArray = Object.keys(this.queryJSON).filter(
      (word) => !['page', 'attributes', 'order', 'offset', 'limit', 'sort', 'fields'].includes(word)
    );
    if (filteredArray.indexOf('where') === -1) {
      this.queryJSON.where = {};
    }
    for (let i = 0; i < filteredArray.length; i += 1) {
      const operatorStr = Object.getOwnPropertyNames(this.queryJSON[filteredArray[i]]).toString();
      let newObj = {};

      switch (operatorStr) {
        case 'gte':
          newObj = { [Op.gte]: this.queryJSON[filteredArray[i]].gte };
          break;
        case 'lte':
          newObj = { [Op.lte]: this.queryJSON[filteredArray[i]].lte };
          break;
        case 'lt':
          newObj = { [Op.lt]: this.queryJSON[filteredArray[i]].lt };
          break;
        case 'gt':
          newObj = { [Op.gt]: this.queryJSON[filteredArray[i]].gt };
          break;
        default:
          break;
      }
      this.queryJSON.where[filteredArray[i]] = newObj;
      delete this.queryJSON[filteredArray[i]];
    }
    // console.log('Filtering complete');
    return this;
  }
}

// const query = new APIFeatures(Tour, testo).filter().paginate().order().limitFields();

// const res = query.sequelizeModel.findAll(query.queryJSON);

module.exports = APIFeatures;
