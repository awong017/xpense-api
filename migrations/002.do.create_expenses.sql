CREATE TABLE expenses(
    id TEXT NOT NULL,
    date BIGINT,
    name TEXT NOT NULL,
    description TEXT,
    cost FLOAT NOT NULL,
    userID TEXT REFERENCES users(id)
);