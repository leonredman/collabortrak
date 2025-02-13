package com.collabortrak.collabortrak.repositories;

import com.collabortrak.collabortrak.entities.Employee;
import com.collabortrak.collabortrak.entities.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // Find employees by role
    List<Employee> findByRole(RoleType role);
}