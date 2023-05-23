var express = require('express');
var router = express.Router();
const validate = require('../middlewares/validate');
const authValidation = require('../validations/auth.validation');
var authController = require('../controllers/auth.controller');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//     console.log(req.session.user);
//     console.log(req.session);
//     res.send(`auth route sessionId: ${req.session.user.name}`);
// });

router.get('/register',  authController.registerGet);
router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.get('/logout', validate(authValidation.logout), authController.logout);

router.get("/login", authController.getLogin);

// router.post("/login", (req, res) => {
//     const email = req.body.email;
//     const password = req.body.password;
//
//     passport.authenticate("local", {
//         successRedirect: "/home",
//         failureRedirect: "/login",
//     })(req, res);
// });
// Apply session middleware to the router
router.use(function(req, res, next) {
    if (!req.session.user) {
        req.redirect('/auth/login')
    } else {
        next();
    }
});
module.exports = router;
