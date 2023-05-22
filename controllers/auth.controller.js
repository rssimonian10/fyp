const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, } = require('../services');

const register = catchAsync(async (req, res) => {
  try {
    req.session.user = await userService.createUser(req.body);

    res.redirect('/auth');
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

// const login = catchAsync(async (req, res) => {
//   const { email, password } = req.body;
//   const user = await authService.loginUserWithEmailAndPassword(email, password);
//   const tokens = await tokenService.generateAuthTokens(user);
//   res.send({ user, tokens });
// });

// const logout = catchAsync(async (req, res) => {
//   await authService.logout(req.body.refreshToken);
//   res.status(httpStatus.NO_CONTENT).send();
// });
//
// const refreshTokens = catchAsync(async (req, res) => {
//   const tokens = await authService.refreshAuth(req.body.refreshToken);
//   res.send({ ...tokens });
// });

module.exports = {
  register,
  registerGet,
  // login,
  // logout,
  // refreshTokens,
};
