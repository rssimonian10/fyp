var express = require('express');
var router = express.Router();
const validate = require('../middlewares/validate');
const authValidation = require('../validations/auth.validation');
var authController = require('../controllers/auth.controller');


router.get('/register',  authController.registerGet);
router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.get('/logout', validate(authValidation.logout), authController.logout);

router.get("/login", authController.getLogin);


router.use(function(req, res, next) {
    if (!req.session.user) {
        req.redirect('/auth/login')
    } else {
        next();
    }
});
module.exports = router;
