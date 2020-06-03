// const testQuery = { duration: { gte: '8' }, price: { lte: '2000' }, difficulty: 'medium' };
const testQuery = {
  price: { gte: '1500' },
  duration: { lt: '14' },
  sort: '-price,ratingsAverage'
};
// -price,ratingsAverage

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
  function sortOrder(str) {
    return str.charAt(0) === '-' ? [str.substring(1), 'DESC'] : [str, 'ASC'];
  }

  const sortKeys = Object.keys(query);
  for (let i = 0; i < sortKeys.length; i += 1) {
    if (sortKeys[i].toString() === 'sort') {
      const sortingFields = query[sortKeys[i]].split(',');
      const orderArray = [];
      sortingFields.forEach((element) => {
        orderArray.push(sortOrder(element));
      });
      query.order = orderArray;
      // console.log(sortKeys);
      delete query.sort;
      //  this needs to have separate where and order objects.The where can come from the other filterQuery
    }
  }
  return query;
}
// const a = adjustQuery(testQuery);
// console.log(a);
// console.log('               ************');
// const b = sortQuery(testQuery);
// console.log(b);

function sortOrder(str) {
  return str.charAt(0) === '-' ? [str.substring(1), 'DESC'] : [str, 'ASC'];
}

if (Object.keys(testQuery).includes('sort')) {
  console.log('has a sort fn');
} else {
  console.log('no sort');
}
