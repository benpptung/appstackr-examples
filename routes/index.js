var path = require('path'),
    join = path.join;

var router = require('express').Router();

var pkg = require(join(__dirname, '..', 'package.json'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: pkg.name });
});

router.use('/examples', require('./examples'));

module.exports = router;
