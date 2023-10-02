CREATE TABLE scheduling.waiters (
    id SERIAL PRIMARY KEY, 
    waiter_name VARCHAR(255) NOT NULL
);

CREATE TABLE scheduling.day_of_the_week (
    id SERIAL PRIMARY KEY,
    day VARCHAR(255)
);

CREATE TABLE scheduling.schedule (
    id SERIAL PRIMARY KEY,
    waiter_id INT,
    day_id INT,
    available BOOLEAN,
    FOREIGN KEY (waiter_id) REFERENCES scheduling.waiters(id),
    FOREIGN KEY (day_id) REFERENCES scheduling.day_of_the_week(id)
);
