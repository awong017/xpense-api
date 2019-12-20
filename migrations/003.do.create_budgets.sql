CREATE TABLE budgets(
    id TEXT NOT NULL,
    budget FLOAT NOT NULL,
    userID TEXT REFERENCES users(id)
);