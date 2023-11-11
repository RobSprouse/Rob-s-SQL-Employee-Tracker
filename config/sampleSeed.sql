
USE employee_tracker;

-- Insert into department
INSERT INTO
     department (id, name)
VALUES
     (1, 'Sales'),
     (2, 'Engineering'),
     (3, 'HR');

-- Insert into role
INSERT INTO
     role (
          id,
          title,
          salary,
          department_id
     )
VALUES
     (1, 'Sales Manager', 80000, 1),
     (2, 'Sales Associate', 60000, 1),
     (3, 'Engineer', 90000, 2),
     (4, 'HR Manager', 85000, 3),
     (5, 'HR Associate', 65000, 3);

-- Insert into employee
INSERT INTO
     employee (
          id,
          first_name,
          last_name,
          role_id,
          manager_id
     )
VALUES
     (1, 'John', 'Doe', 1, NULL),
     (2, 'Jane', 'Smith', 2, 1),
     (3, 'Emily', 'Johnson', 3, NULL),
     (4, 'Michael', 'Brown', 4, NULL),
     (5, 'Sarah', 'Davis', 5, 4);
     -- John Doe is the Sales Manager and has no manager (2, 'Jane', 'Smith', 2, 1),
     -- Jane Smith is a Sales Associate and her manager is John Doe (3, 'Emily', 'Johnson', 3, NULL),
     -- Emily Johnson is an Engineer and has no manager (4, 'Michael', 'Brown', 4, NULL),
     -- Michael Brown is the HR Manager and has no manager (5, 'Sarah', 'Davis', 5, 4);
     -- Sarah Davis is an HR Associate and her manager is Michael Brown

     SELECT * FROM employee