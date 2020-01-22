const express = require('express')
const xss = require('xss')
const BudgetsService = require('./budgets-service')

budgetRouter = express.Router()
bodyParser = express.json()

const serializeBudget = (budget) => ({
    id: xss(budget.id),
    budget: xss(budget.budget),
    userID: budget.userid,
    timeFrame: budget.timeframe
})

budgetRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        BudgetsService.getAllBudgets(knexInstance)

        .then(budgets => {
            res.json(budgets.map(serializeBudget))
        })
        .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const { id, budget, userid, timeframe } = req.body
        const newBudget = { id, budget, userid, timeframe }

        for(const [key, value] of Object.entries(newBudget)) {
            if(value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key} in request body`}
                })
            }
        }

        BudgetsService.insertBudget(
            req.app.get('db'),
            newBudget
        )

        .then(budget => {
            res
                .status(200)
                .json(serializeBudget(budget))
        })
        .catch(next)
    })

budgetRouter
    .route('/:user_id/:budget/:timeframe')
    .put((req, res, next) => {
        const { user_id, budget, timeframe } = req.params
        const knexInstance = req.app.get('db')

        BudgetsService.updateBudget(knexInstance, user_id, budget, timeframe)

        .then(
            res
                .send('Budget updated')
        )
        .catch(next)
    })

budgetRouter
    .route('/:budget_id')
    .get((req, res, next) => {
        const { budget_id } = req.params
        const knexInstance = req.app.get('db')

        BudgetsService.getBudgetById(knexInstance, budget_id)

        .then(budget => {
            if(budget.length === 0) {
                return res.status(404).json({
                    error: `budget with id of ${budget_id} not found`
                })
            }
            res
                .status(200)
                .json(budget)
        })
        .catch(next)
    })
    .delete((req, res, next) => {
        const { budget_id } = req.params
        const knexInstance = req.app.get('db')

        BudgetsService.deleteBudget(knexInstance, budget_id)

        .then(
            res
                .send('Deleted')
        )
        .catch(next)
    })


module.exports = budgetRouter;