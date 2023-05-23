const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { NOT_FOUND } = require('./utils/errors');

const app = express();
const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/mestodb', {});

app.use((req, res, next) => {
  req.user = {
    _id: '646b9b85b64c754dc6b92511', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(express.json());

app.use(usersRouter);
app.use(cardsRouter);

app.use = (req, res) => {
  res.status(NOT_FOUND).send({
    message: 'По этому адресу ничего нет',
  });
};

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
