const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const aboutRouter = require('./routes/about');
const teamRouter = require('./routes/team');
const contactRouter = require('./routes/contacts');
const cartRouter = require('./routes/cart');
const productRouter = require('./routes/product');
const checkoutRouter = require('./routes/checkout');
const newProductRouter = require('./routes/newproduct');
const removeProductRouter = require('./routes/removeproduct');
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');
const purchasesRouter = require('./routes/purchases');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', loginRouter);
app.use('/', signupRouter);
app.use('/', aboutRouter);
app.use('/', teamRouter);
app.use('/', contactRouter);
app.use('/', cartRouter);
app.use('/', productRouter);
app.use('/', checkoutRouter);
app.use('/', newProductRouter);
app.use('/', removeProductRouter);
app.use('/', adminRouter);
app.use('/', userRouter);
app.use('/', purchasesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
