package com.klef.cicd.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.cicd.model.Task;
import com.klef.cicd.model.TaskStatus;
import com.klef.cicd.model.User;
import com.klef.cicd.repository.TaskRepository;
import com.klef.cicd.repository.UserRepository;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    // Create a new task
    public Task createTask(Task task, String createdByUsername, String assignedToUsername) {
        User createdBy = userRepository.findByUsername(createdByUsername)
                .orElseThrow(() -> new RuntimeException("Creator user not found"));
        
        User assignedTo = userRepository.findByUsername(assignedToUsername)
                .orElseThrow(() -> new RuntimeException("Assigned user not found"));

        // Only managers and admins can create tasks
        if (!createdBy.getRole().equals(User.Role.MANAGER) && !createdBy.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("Only managers and admins can create tasks");
        }

        // Only staff can be assigned tasks
        if (!assignedTo.getRole().equals(User.Role.STAFF)) {
            throw new RuntimeException("Tasks can only be assigned to staff members");
        }

        task.setCreatedBy(createdBy);
        task.setAssignedTo(assignedTo);
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());

        return taskRepository.save(task);
    }

    // Get all tasks
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // Get tasks assigned to a specific user
    public List<Task> getTasksByAssignedUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return taskRepository.findByAssignedTo(user);
    }

    // Get tasks created by a specific user
    public List<Task> getTasksByCreatedUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return taskRepository.findByCreatedBy(user);
    }

    // Get task by ID
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    // Update task
    public Task updateTask(Long id, Task taskDetails, String username) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user can update this task
        if (!task.getAssignedTo().getUsername().equals(username) && 
            !task.getCreatedBy().getUsername().equals(username) &&
            !user.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("You don't have permission to update this task");
        }

        // Update fields
        if (taskDetails.getTitle() != null) {
            task.setTitle(taskDetails.getTitle());
        }
        if (taskDetails.getDescription() != null) {
            task.setDescription(taskDetails.getDescription());
        }
        if (taskDetails.getStatus() != null) {
            task.setStatus(taskDetails.getStatus());
        }
        if (taskDetails.getPriority() != null) {
            task.setPriority(taskDetails.getPriority());
        }
        if (taskDetails.getDueDate() != null) {
            task.setDueDate(taskDetails.getDueDate());
        }

        task.setUpdatedAt(LocalDateTime.now());

        return taskRepository.save(task);
    }

    // Delete task
    public void deleteTask(Long id, String username) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Only creator or admin can delete task
        if (!task.getCreatedBy().getUsername().equals(username) && 
            !user.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("You don't have permission to delete this task");
        }

        taskRepository.delete(task);
    }

    // Get overdue tasks for a user
    public List<Task> getOverdueTasks(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return taskRepository.findOverdueTasksByUser(user);
    }

    // Get task statistics for a user
    public TaskStats getTaskStats(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long pending = taskRepository.countByAssignedToAndStatus(user, TaskStatus.PENDING);
        Long inProgress = taskRepository.countByAssignedToAndStatus(user, TaskStatus.IN_PROGRESS);
        Long completed = taskRepository.countByAssignedToAndStatus(user, TaskStatus.COMPLETED);
        Long overdue = (long) taskRepository.findOverdueTasksByUser(user).size();

        return new TaskStats(pending, inProgress, completed, overdue);
    }

    // Get all staff members for task assignment
    public List<User> getStaffMembers() {
        return userRepository.findByRole(User.Role.STAFF);
    }

    // Inner class for task statistics
    public static class TaskStats {
        private Long pending;
        private Long inProgress;
        private Long completed;
        private Long overdue;

        public TaskStats(Long pending, Long inProgress, Long completed, Long overdue) {
            this.pending = pending;
            this.inProgress = inProgress;
            this.completed = completed;
            this.overdue = overdue;
        }

        // Getters
        public Long getPending() { return pending; }
        public Long getInProgress() { return inProgress; }
        public Long getCompleted() { return completed; }
        public Long getOverdue() { return overdue; }
    }
}
