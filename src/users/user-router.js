const express = require('express')
const xss = require('xss')
const path = require('path')
const UsersService = require('./users-service')

const userRouter = express.Router()
const bodyParser = express.json()

const serializeUser = user => ({
    id: user.id,
    userName: xss(user.username),
    password: xss(user.password)
})

userRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        UsersService.getAllUsers(knexInstance)
            .then(users => {
                res.json(users.map(serializeUser))
            })
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const { id, username, password } = req.body
        const newUser = { id, username, password}

        for(const [key, value] of Object.entries(newUser)) {
            if(value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key} in request body`}
                })
            }
        }

        UsersService.insertUser(
            req.app.get('db'),
            newUser
        )

        .then(user => {
            res
                .status(201)
                .json(serializeUser(user))
        })
        .catch(next)
    })

module.exports = userRouter