const _ = require('lodash');

const testQuery = {
  attributes: ['name', 'duration', 'price'],
  where: { page: '1', limit: '3', price: { gte: '1000' } },
  order: [['price', 'ASC']]
};
function adjustQuery(query) {
  const keys = Object.keys(query);
  for (let i = 0; i < keys.length; i += 1) {
    const test = Object.getOwnPropertyNames(query[keys[i]]).toString();

    switch (test) {
      case 'gte':
        query[keys[i]] = { 'new Op gte': query[keys[i]].gte };
        break;
      case 'lte':
        query[keys[i]] = { 'new Op lte': query[keys[i]].lte };
        break;
      case 'lt':
        query[keys[i]] = { 'new Op lt': query[keys[i]].lt };
        break;
      case 'gt':
        query[keys[i]] = { 'new Op gt': query[keys[i]].gt };
        break;
      default:
        // test = test;
        break;
    }
  }
  return query;
}

function sortQuery(query) {
  let result;
  if (Object.keys(query.where).includes('sort')) {
    console.log('hello sort');
    const wherePart = JSON.parse(JSON.stringify(query.where)); // make a deep copy
    delete wherePart.sort;
    result = {
      order: query.where.sort
        .split(',')
        .map((str) => (str.charAt(0) === '-' ? [str.substring(1), 'DESC'] : [str, 'ASC'])),
      where: wherePart
    };
  } else {
    result = query;
  }
  return result;
}

function selectQueryFields(query) {
  let result;
  if (Object.keys(query.where).includes('fields')) {
    const wherePart = _.cloneDeep(query.where); // make a deep copy
    const sortPart = _.cloneDeep(query.sort); // make a deep copy
    delete wherePart.fields;
    result = {
      attributes: query.where.fields.split(','),
      where: wherePart,
      sort: sortPart
    };
  } else {
    result = query;
  }
  return result;
}

function paginateQuery(query) {
  let pageNumber;
  let limitNumber;
  if (Object.keys(query.where).includes('page') || Object.keys(query.where).includes('limit')) {
    if (Object.keys(query.where).includes('page')) {
      pageNumber = query.where.page * 1;
    } else {
      pageNumber = 1;
    }
    if (Object.keys(query.where).includes('limit')) {
      limitNumber = query.where.limit * 1;
    } else {
      limitNumber = 10;
    }
    query.limit = limitNumber;
    query.offset = pageNumber;
    delete query.where.page;
    delete query.where.limit;
  } else {
    console.log('no pagnation');
  }
  return query;
}

console.log(paginateQuery(selectQueryFields(sortQuery(testQuery))));
