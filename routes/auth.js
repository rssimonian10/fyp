var express = require('express');
var router = express.Router();
const validate = require('../middlewares/validate');
const authValidation = require('../validations/auth.validation');
var authController = require('../controllers/auth.controller');

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log(req.session.user);
    console.log(req.session);
    res.send(`auth route sessionId: ${req.session.user.name}`);
});

router.get('/register',  authController.registerGet);
router.post('/register', validate(authValidation.register), authController.register);

// router.post("/register", (req, res) => {
//     const email = req.body.email;
//     const password = req.body.password;
//
//     User.register(new User({ email }), password, (err, user) => {
//         if (err) {
//             console.log(err);
//             return res.render("auth/register");
//         }
//
//         passport.authenticate("local")(req, res, () => {
//             req.flash('success', 'You have logged in');
//             res.redirect("/");
//         });
//     });
// });

router.get("/login", (req, res) => {
    res.render("auth/login", {
        title: "Login",
        email: "",
        password: "",
        messages: {},
    });
});

router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    passport.authenticate("local", {
        successRedirect: "/home",
        failureRedirect: "/login",
    })(req, res);
});
// Apply session middleware to the router
router.use(function(req, res, next) {
    if (!req.session.user) {
        req.redirect('/auth/login')
    } else {
        next();
    }
});
module.exports = router;
