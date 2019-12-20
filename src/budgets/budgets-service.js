const BudgetsService = {

    getAllBudgets(knex) {
        return knex.select('*').from('budgets')
    },

    insertBudget(knex, newBudget) {
        return knex
            .insert(newBudget)
            .into('budgets')
            .returning('*')
            .then(rows => {
                return rows[0]
        })
    },

    getBudgetById(knex, userID) {
        return knex
            .select('*')
            .from('budgets')
            .where('userid', userID)
    },

    deleteBudget(knex, id) {
        return knex('budgets')
            .where('id', id)
            .delete()
    }
}

module.exports = BudgetsService