var express = require('express');
const userRoute = require('./users');
const authRoute = require('./auth');
var liraController = require('../controllers/liraRate.controller');
var chatbotController = require('../controllers/chatbot.controller');


var router = express.Router();

const defaultRoutes = [
  {
    path: '/users',
    route: userRoute
  },
  {
    path: '/',
    route: authRoute,
  }
];

/* GET home page. */
router.get('/', liraController.index);
router.get('/chatbot', chatbotController.index);
router.post('/api/chatbot', chatbotController.api);
router.get('/news', function(req, res, next) {
  res.render('news', { title: 'FYP', session: req.session });
});
router.get('/about-us', function(req, res, next) {
  res.render('about-us', { title: 'FYP', session: req.session });
});
router.get('/contact-us', function(req, res, next) {
  res.render('contact-us', { title: 'FYP', session: req.session });
});

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route)
});

module.exports = router;
