const db = require('../models');

const Op = db.Op;
const Tour = db.tours;

const testo = {
  duration: { gte: '7' },
  page: '2',
  limit: '3',
  fields: 'name,duration,price'
};

class APIFeatures {
  constructor(query, queryJSON) {
    this.query = query;
    this.queryJSON = queryJSON;
  }

  limitFields() {
    if (Object.keys(this.queryJSON).includes('fields')) {
      this.queryJSON.attributes = this.queryJSON.fields.split(',');
      delete this.queryJSON.fields;
    }
  }

  paginate() {
    // let pageNumber;
    // let offset;
    if (Object.keys(this.queryJSON).includes('page')) {
      this.queryJSON.page = this.queryJSON.page * 1;
    } else {
      this.queryJSON.page = 1;
    }
    if (Object.keys(this.queryJSON).includes('limit')) {
      this.queryJSON.offset = (this.queryJSON.page - 1) * (this.queryJSON.limit * 1); //(pageNumber - 1) * limitNumber
    } else {
      this.queryJSON.offset = (this.queryJSON.page - 1) * 5;
    }
    delete this.queryJSON.limit;
    console.log(this.queryJSON);
  }
}

const features = new APIFeatures(Tour.findAll(), testo).paginate();
