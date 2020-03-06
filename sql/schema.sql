begin;

create table employees (
  change_id serial primary key,
  employee int,
  name varchar(255),
  position varchar(255),
  lvl varchar(255),
  manager_id int,
  change_date date
);

insert into employees (employee, name, position, lvl, manager_id, change_date) values (1, 'John Doe', 'Manager', 'L3', null, '2020-01-01');
insert into employees (employee, name, position, lvl, manager_id, change_date) values (2, 'Jane Doe', 'Clerk', 'L2', 1, '2020-01-02');
insert into employees (employee, name, position, lvl, manager_id, change_date) values (3, 'Job Doe', 'Clerk', 'L2', 1, '2020-01-02');
insert into employees (employee, name, position, lvl, manager_id, change_date) values (4, 'Hugh Doe', 'Clerk','L2',  null, '2020-01-02');
insert into employees (employee, name, position, lvl, manager_id, change_date) values (1, 'John Doe', 'Sr. Manager', 'L4', null, '2020-01-10');
insert into employees (employee, name, position, lvl, manager_id, change_date) values (2, 'Jane Doe', 'Sr. Clerk', 'L3', 1, '2020-01-11');

commit;
