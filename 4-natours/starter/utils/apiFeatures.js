const db = require('../models');

const Op = db.Op;
const Tour = db.tours;

const testo = {
  duration: { gte: '7' },
  page: '2',
  limit: '3',
  sort: '-price,duration',
  fields: 'name,duration,price'
};

class APIFeatures {
  constructor(queryJSON) {
    this.queryJSON = queryJSON;
  }

  limitFields() {
    if (Object.keys(this.queryJSON).includes('fields')) {
      this.queryJSON.attributes = this.queryJSON.fields.split(',');
      delete this.queryJSON.fields;
    }
  }

  order() {
    if (Object.keys(this.queryJSON).includes('sort')) {
      this.queryJSON.order = this.queryJSON.sort
        .split(',')
        .map((str) => (str.charAt(0) === '-' ? [str.substring(1), 'DESC'] : [str, 'ASC']));
    }
  }

  paginate() {
    this.queryJSON.page = Object.keys(this.queryJSON).includes('page') ? this.queryJSON.page * 1 : 1;
    this.queryJSON.offset = Object.keys(this.queryJSON).includes('limit') ? this.queryJSON.limit * 1 : 5;
    delete this.queryJSON.limit;
  }

  filter() {
    let found = [];
    ['page', 'limit', 'fields', 'sort'].some((r) => Object.keys(this.queryJSON).includes(r));
    console.log(found);
  }

  findAll() {
    Tour.findAll(this.queryJSON);
  }
}

const features = new APIFeatures(testo); //.findAll(); //.paginate();
console.log(features);
features.limitFields();
console.log(features);
features.order();
console.log(features);

features.paginate();
console.log(features);
features.filter();
console.log(features);
features.findAll();
