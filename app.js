const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const NotFound = require('./errors/NotFound');
const usersController = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorMiddlewares = require('./middlewares/errorMiddlewares');
const { validateSignIn, validateSignUp } = require('./middlewares/validations');

const app = express();
const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/mestodb', {});

app.use(helmet());
app.use(express.json());

app.post('/signin', validateSignIn, usersController.loginUser);
app.post('/signup', validateSignUp, usersController.createUser);

app.use(auth);
app.use(usersRouter);
app.use(cardsRouter);

app.use('*', (req, res, next) => next(new NotFound('По этому адресу ничего нет')));

app.use(errors());
app.use(errorMiddlewares);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
