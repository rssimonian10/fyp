const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, } = require('../services');

const register = catchAsync(async (req, res) => {
  try {
    req.session.user = await userService.createUser(req.body);

    res.redirect('/');
  } catch (error) {
    let emailValidationError;
    if (error.keyPattern && error.keyPattern.email === 1) {
      emailValidationError = { field: 'email', message: 'Email already taken' };
    }

    if (error.name === 'ValidationError') {
      error.validationErrors = Object.keys(error.errors).map(field => ({
        field,
        message: error.errors[field].message
      }));
    }

    res.render('auth/register', {
      error: error,
      emailValidationError: emailValidationError
    });
  }
});

const registerGet = catchAsync(async (req, res) => {
  res.render("auth/register", {
    title: "Registration Page",
    name: "",
    email: "",
    password: "",
    messages: {},
  });
});

const login = catchAsync(async (req, res) => {
  try {
    const { email, password } = req.body;
    req.session.user = await authService.loginUserWithEmailAndPassword(email, password);
    res.redirect('/');
  } catch (error) {
    res.render('/login', {
      error: error,
    });
  }
});

const getLogin = catchAsync(async (req, res) => {
  res.render("auth/login", {
    title: "Login",
    email: "",
    password: "",
    messages: {},
  });
});

const logout = catchAsync(async (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = {
  register,
  registerGet,
  login,
  logout,
  getLogin,
};
