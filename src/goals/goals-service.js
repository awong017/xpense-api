const GoalsService = {
    
    getAllGoals(knex) {
        return knex.select('*').from('goals')
    },

    insertGoal(knex, newGoal) {
        return knex 
            .insert(newGoal)
            .into('goals')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getById(knex, userID) {
        return knex
            .from('goals')
            .select('*')
            .where('userid', userID)
    },

    deleteGoal(knex, id) {
        return knex('goals')
            .where('userid', id)
            .delete()
    }
}

module.exports = GoalsService