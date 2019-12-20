CREATE TABLE goals(
    id TEXT NOT NULL,
    amount FLOAT NOT NULL,
    category TEXT NOT NULL,
    userID TEXT REFERENCES users(id)
);