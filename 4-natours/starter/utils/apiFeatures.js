const db = require('../models');

const Op = db.Op;

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
    this.queryJSON.offset = Object.keys(this.queryJSON).includes('limit') ? this.queryJSON.limit * 1 : 0;
    //console.log('The offset is', this.queryJSON.offset);
    delete this.queryJSON.limit;
    // console.log('Pagination complete');

    return this;
  }

  filter() {
    //console.log('                  ***');
    //console.log(this);
    const filteredArray = Object.keys(this.queryJSON).filter(
      (word) => !['page', 'attributes', 'order', 'offset', 'limit', 'sort', 'fields'].includes(word)
    );
    if (filteredArray.indexOf('where') === -1) {
      this.queryJSON.where = {};
    }
    //console.log(this);
    //console.log(filteredArray);
    for (let i = 0; i < filteredArray.length; i += 1) {
      const operatorStr = Object.getOwnPropertyNames(this.queryJSON[filteredArray[i]]).toString();
      let newObj = {};
      //console.log(operatorStr);
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
          //console.log(this.queryJSON[filteredArray[i]]);
          newObj = this.queryJSON[filteredArray[i]];
          break;
      }

      this.queryJSON.where[filteredArray[i]] = newObj;
      delete this.queryJSON[filteredArray[i]];
    }
    //console.log(this);
    return this;
  }
}

module.exports = APIFeatures;

// const Tour = db.tours;
// const testo = {
//   duration: { gte: '7' },
//   price: { gt: 1000 },
//   page: '2',
//   limit: '3',
//   sort: '-price,duration',
//   fields: 'name,duration,price'
// };

//const query = new APIFeatures(Tour, testo).filter().paginate().order().limitFields();
//const testQuery = db.sequelize.query('SELECT *,UNNEST("startDates") AS "unwound" FROM tours');
//const res = query.sequelizeModel.findAll(testQuery);
// console.log(testQuery);

// console.log(query.queryJSON);

// const { sequelize } = db.sequelize;
// const statsQuery = {
//   // where: {},
//   attributes: [
//     'difficulty',
//     [db.sequelize.fn('COUNT', db.sequelize.col('duration')), 'numTours'],
//     [db.sequelize.fn('AVG', db.sequelize.col('ratingsAverage')), 'avgRating'],
//     [db.sequelize.fn('AVG', db.sequelize.col('price')), 'avgPrice'],
//     [db.sequelize.fn('MIN', db.sequelize.col('price')), 'minPrice'],
//     [db.sequelize.fn('MAX', db.sequelize.col('price')), 'maxPrice'],
//     [db.sequelize.fn('SUM', db.sequelize.col('ratingsQuantity')), 'numRatings']
//   ],
//   group: ['difficulty'],
//   order: [[db.sequelize.fn('AVG', db.sequelize.col('ratingsAverage')), 'DESC']]
// };
// // const res = query.sequelizeModel.findAll(query.queryJSON);
// const res = query.sequelizeModel.findAll(statsQuery);
