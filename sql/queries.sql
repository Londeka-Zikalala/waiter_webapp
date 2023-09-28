INSERT INTO scheduling.day_of_the_week (day, available) VALUES ('Monday', TRUE);
INSERT INTO scheduling.day_of_the_week (day, available) VALUES ('Tuesday', TRUE);
INSERT INTO scheduling.day_of_the_week (day, available) VALUES ('Wednesday', TRUE);
INSERT INTO scheduling.day_of_the_week (day, available) VALUES ('Thursday', TRUE);
INSERT INTO scheduling.day_of_the_week (day, available) VALUES ('Friday', TRUE);
INSERT INTO scheduling.day_of_the_week (day, available) VALUES ('Saturday', TRUE);
INSERT INTO scheduling.day_of_the_week (day, available) VALUES ('Sunday', TRUE);

ALTER TABLE scheduling.day_of_the_week
ADD CONSTRAINT fk_waiters
FOREIGN KEY (waiter_id) REFERENCES scheduling.waiters(id);

