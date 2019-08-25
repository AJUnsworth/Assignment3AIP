var express = require('express');
var router = express.Router();

const members = [
    {name: 'Andrew', rank: '#1'},
    {name: 'Bela', rank: '#2'},
    {name: 'Chloe', rank: '#3'},
    {name: 'James', rank: '#4'},
    {name: 'Josh', rank: '#5'},
    {name: 'Andrew', rank: '#6'},
    {name: 'Bela', rank: '#7'},
    {name: 'Chloe', rank: '#8'},
    {name: 'James', rank: '#9'},
    {name: 'Josh', rank: '#10'}
];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json(members);
});

module.exports = router;
