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

const app = express()

//TEST

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(express.json())

app.use(function errorHandler(error, req, res, next) {
    let response
      if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
      } 
      else
      {
        response = { message: error.message, error }
      }
        res.status(500).json(response)
    }
  )

app.use('/api/users', userRouter)
app.use('/api/goals', goalRouter)
app.use('/api/expenses', expenseRouter)
app.use('/api/budgets', budgetRouter)
app.use('/api/categories', categoryRouter)

module.exports = app