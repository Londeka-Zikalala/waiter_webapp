CREATE TABLE waiters (id SERIAL PRIMARY KEY, 
waiter_name VARCHAR(255) NOT NULL
);
CREATE TABLE admin (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,

)
CREATE TABLE scheduling.day_of_the_week (
    id SERIAL PRIMARY KEY,
    day VARCHAR(255),
    available BOOLEAN,
    waiter_id INT,
    FOREIGN KEY (waiter_id) REFERENCES scheduling.waiters(id)
);


