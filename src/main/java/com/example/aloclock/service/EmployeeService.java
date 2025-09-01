package com.example.aloclock.service;

import com.example.aloclock.model.Employee;
import com.example.aloclock.model.Role;
import com.example.aloclock.repository.EmployeeRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeService(EmployeeRepository employeeRepository, PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Employee createEmployee(String nombre, String email, String password, Role rol) {
        Employee employee = new Employee(nombre, email, passwordEncoder.encode(password), rol);
        return employeeRepository.save(employee);
    }

    public List<Employee> findAll() {
        return employeeRepository.findAll();
    }

    public Optional<Employee> findByEmail(String email) {
        return employeeRepository.findByEmail(email);
    }

    public Employee save(Employee employee) {
        return employeeRepository.save(employee);
    }
}
