const CategoriesService = {

    getExpenseCategories(knex, userID) {
        return knex
            .distinct('category')
            .from('expenses')
            .where('userid', userID)
    }
}

module.exports = CategoriesService;