/* This query will retrieve the employee list together wirh their manager
 * information whilst filtering the information to retrieve the latest and
 * current state of the employee and match it to the current and latest state of
 * their manager.
*/
select
  emp.name, emp.lvl, emp.position,
  mgr.name, mgr.lvl, mgr.position
from
  employees emp
  inner join
    (select distinct name, max(change_date) as change_date 
      from employees group by name order by name) latest
      on latest.change_date = emp.change_date and latest.name = emp.name
  left join 
    (select e1.* from  employees e1
        inner join
          (select distinct name, max(change_date) as change_date 
            from employees e3 group by e3.name) e2
          on e1.change_date = e2.change_date and e1.name = e2.name) mgr
      on mgr.employee = emp.manager_id
order by
  emp.lvl desc,
  emp.name asc;
