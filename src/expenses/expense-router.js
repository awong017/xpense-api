const express = require('express')
const xss = require('xss')
const ExpensesService = require('./expenses-service')

const expenseRouter = express.Router()
const bodyParser = express.json()

serializeExpense = (expense) => ({
    id: expense.id,
    date: expense.date,
    name: xss(expense.name),
    description: xss(expense.description),
    cost: xss(expense.cost),
    category: xss(expense.category),
    userID: expense.userid
})

expenseRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        ExpensesService.getAllExpenses(knexInstance)
            .then(expenses => {
                res.json(expenses.map(serializeExpense))
            })
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const {id, date, name, description, cost, category, userid } = req.body
        const newExpense = { id, date, name, description, cost, category, userid }

        for(const [key, value] of Object.entries(newExpense)) {
            if(value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key} in request body`}
                })
            }
        }

        const knexInstance = req.app.get('db')
        
        ExpensesService.insertExpense(
            knexInstance,
            newExpense
        )
        .then(expense => {
            res
                .status(200)
                .json(serializeExpense(expense))
        })
        .catch(next)   
    })

expenseRouter
    .route('/:expense_id')
    .get((req, res, next) => {
        const { expense_id } = req.params

        ExpensesService.getExpensebyId(
            req.app.get('db'),
            expense_id
        )
        .then(expenses => {
            if(expenses.length === 0) {
                return res.status(404).json({
                    error: {message: `Expense doesn't exist`}
                })
            }
            res.json(expenses)
        })
        .catch(next)
    })
    .delete((req, res, next) => {
        const { expense_id } = req.params

        if(!expense_id) {
            return res
                .status(400)
                .json({"error": "Please specify an expense id to delete"})
        }
        ExpensesService.deleteExpense(
            req.app.get('db'),
            expense_id
        )
        .then(
            res
                .status(200)
                .send('Deleted')
        )
        .catch(next)
    })

module.exports = expenseRouter

