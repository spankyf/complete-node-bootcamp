const testQuery = { duration: { gte: '8' }, price: { lte: '2000' }, difficulty: 'medium' };

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

const a = adjustQuery(testQuery);
console.log(a);
