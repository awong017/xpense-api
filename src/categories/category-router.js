const express = require('express')
const CategoriesService = require('./categories-service')

categoryRouter = express.Router();

categoryRouter
        .route('/:user_id')
        .get((req, res, next) => {
            const { user_id } = req.params

            if(!user_id) {
                return res
                    .status(404)
                    .json({error: `Please submit a user id`})
            }

            CategoriesService.getExpenseCategories(
                req.app.get('db'),
                user_id
            )

            .then(categories => {
                if(categories.length === 0) {
                    return res.status(404).json({
                        error: {message: `Categories do not exist`}
                    })
                }
                res.json(categories)
            })
            .catch(next)

        })

module.exports = categoryRouter