const fs = require('fs');
const moment = require('moment');

const tours = JSON.parse(
  fs.readFileSync('tours-simple.json')
);

// console.log(forEach(tours[0]['startDates']);
// const testArray =
// const arr = tours[0]['startDates']
// arr.forEach((element) => {
//   const res = moment(element, 'YYYY-MM-DD,hh:mm');
//   console.log(res);
// });

// console.log(tours.find('startDates'));
// const name = 'startDates';

// function search(tours, name) {
//   var results;

//   name = name.toUpperCase();
//   results = tours.filter(function (entry) {
//     return entry.name.toUpperCase().indexOf(name) !== -1;
//   });
//   return results;
// }

// search();
