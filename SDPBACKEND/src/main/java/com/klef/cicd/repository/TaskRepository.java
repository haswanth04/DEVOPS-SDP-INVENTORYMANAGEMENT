package com.klef.cicd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.klef.cicd.model.Task;
import com.klef.cicd.model.TaskStatus;
import com.klef.cicd.model.User;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    // Find tasks assigned to a specific user
    List<Task> findByAssignedTo(User assignedTo);
    
    // Find tasks created by a specific user
    List<Task> findByCreatedBy(User createdBy);
    
    // Find tasks by status
    List<Task> findByStatus(TaskStatus status);
    
    // Find tasks assigned to a user with specific status
    List<Task> findByAssignedToAndStatus(User assignedTo, TaskStatus status);
    
    // Find overdue tasks
    @Query("SELECT t FROM Task t WHERE t.dueDate < CURRENT_TIMESTAMP AND t.status != 'COMPLETED'")
    List<Task> findOverdueTasks();
    
    // Find tasks assigned to a user that are overdue
    @Query("SELECT t FROM Task t WHERE t.assignedTo = :user AND t.dueDate < CURRENT_TIMESTAMP AND t.status != 'COMPLETED'")
    List<Task> findOverdueTasksByUser(@Param("user") User user);
    
    // Count tasks by status for a specific user
    @Query("SELECT COUNT(t) FROM Task t WHERE t.assignedTo = :user AND t.status = :status")
    Long countByAssignedToAndStatus(@Param("user") User user, @Param("status") TaskStatus status);
    
    // Find tasks created by manager for staff
    @Query("SELECT t FROM Task t WHERE t.createdBy = :manager AND t.assignedTo.role = 'STAFF'")
    List<Task> findTasksCreatedByManagerForStaff(@Param("manager") User manager);
}
