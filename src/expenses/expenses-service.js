const ExpensesService = {

    getAllExpenses(knex) {
        return knex.select('*').from('expenses')
    },

    insertExpense(knex, newExpense) {
        return knex
            .insert(newExpense)
            .into('expenses')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getExpensebyId(knex, userID) {
        return knex
            .select('*')
            .from('expenses')
            .where('userid', userID)
    },

    getExpenseCategories(knex, userID) {
        return knex
            .selectDistinct('category')
            .from('expenses')
            .where('userid', userID)
    },

    deleteExpense(knex, id) {
        return knex('expenses')
            .where('id', id)
            .delete()
    }
}

module.exports = ExpensesService