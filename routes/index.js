var express = require('express');
const userRoute = require('./users');
const authRoute = require('./auth');

var router = express.Router();

const defaultRoutes = [
  {
    path: '/users',
    route: userRoute
  },
  {
    path: '/auth',
    route: authRoute,
  }
];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route)
});

module.exports = router;
