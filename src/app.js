require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const userRouter = require('./users/user-router')
const goalRouter = require('./goals/goal-router')
const expenseRouter = require('./expenses/expense-router')
const budgetRouter = require('./budgets/budget-router')
const categoryRouter = require('./categories/category-router')
const uuid = require('uuid/v4')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(express.json())

state = [
  {
    id: 1,
    name: 'awong017',
    password: 'hello'
  },
  {
    id: 2,
    name: 'clara94',
    password: 'bun'
  },
  {
    id: 3,
    name: 'phanman',
    password: 'fck'
  }
];

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/state', (req, res) => {
  res
    .status(200)
    .json(state)
})

app.post('/state', (req, res) => {
  const { name, password } = req.body

  if(!name) {
    return res
      .status(400)
      .send('Please provide a name')
  }

  if(!password) {
    return res
      .status(400)
      .send('Please provide a password')
  }

  const newUser = {
    id: uuid(),
    name: name,
    password: password
  }

  state.push(newUser)

  res
    .status(200)
    .json(newUser)
})

app.delete('/state/:user_id', (req, res) => {
  const { user_id } = req.params;

  const findUser = state.some((user) => {
    return user.id === parseInt(user_id)
  })

  if(findUser === false) {
    return res
      .status(404)
      .send(`User with id of ${user_id} not found`)
  }

  const filteredUsers = state.filter((user) => {
    return user.id !== parseInt(user_id)
  })

  res
    .status(200)
    .json(filteredUsers)
})

app.use(function errorHandler(error, req, res, next) {
    let response
        if (NODE_ENV === 'production') {
         response = { error: { message: 'server error' } }
       } else {
         console.error(error)
         response = { message: error.message, error }
       }
       res.status(500).json(response)
     })

  app.use('/api/users', userRouter)
  app.use('/api/goals', goalRouter)
  app.use('/api/expenses', expenseRouter)
  app.use('/api/budgets', budgetRouter)
  app.use('/api/categories', categoryRouter)

module.exports = app