const express = require ('express');
const xss = require('xss');
const path = require('path');
const GoalsService = require('./goals-service');

const goalRouter = express.Router()
const bodyParser = express.json()

const serializeGoal = goal => ({
    id: goal.id,
    amount: xss(goal.amount),
    category: xss(goal.category),
    userID: goal.userid
})

goalRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        GoalsService.getAllGoals(knexInstance)
            .then(goals => {
                res.json(goals.map(serializeGoal))
            })
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const { id, amount, category, userid } = req.body
        const newGoal = { id, amount, category, userid }

        for(const [key, value] of Object.entries(newGoal)) {
            if(value == null) {
                return res.status(400).json({
                    error: {message: `Missing '${key}' in request body`}
                })
            }
        }

        GoalsService.insertGoal(
            req.app.get('db'),
            newGoal
        )

        .then(goal => {
            res
                .status(201)
                .json(serializeGoal(goal))
        })
        .catch(next)
    })

goalRouter
    .route('/:goal_id')
    .get((req, res, next) => {

        const { goal_id } = req.params

        GoalsService.getById(
            req.app.get('db'),
            goal_id
        )
        .then(goals => {
            if(goals.length === 0) {
                return res.status(404).json({
                    error: {message: `Goal doesn't exist`}
                })
            }
            res
                .json(goals)
        })
        .catch(next)
    })
    .delete((req, res, next) => {
        const { goal_id } = req.params

        GoalsService.deleteGoal(
            req.app.get('db'),
            goal_id
        )
        .then(deleted => {
            if(!deleted) {
                res
                    .status(404)
                    .json(
                        {message: `Goal not found`}
                    )
                }
                res
                    .send('Deleted')
                    .status(204)
                    .end()
        })
        .catch(next)
    })

module.exports = goalRouter