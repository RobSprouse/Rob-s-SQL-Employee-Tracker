/* COMMENT: Schema to insert example SEED data */
INSERT INTO
     department (name)
VALUES
     ('Sales'),
     ('Engineering'),
     ('HR');

INSERT INTO
     role (title, salary, department_id)
VALUES
     ('Sales Manager', 80000, 1),
     ('Sales Associate', 60000, 1),
     ('Engineer', 90000, 2),
     ('HR Manager', 85000, 3),
     ('HR Associate', 65000, 3);

INSERT INTO
     employee (first_name, last_name, role_id, manager_id)
VALUES
     ('John', 'Doe', 1, NULL),
     ('Jane', 'Smith', 2, 1),
     ('Emily', 'Johnson', 3, NULL),
     ('Michael', 'Brown', 4, NULL),
     ('Sarah', 'Davis', 5, 4);
