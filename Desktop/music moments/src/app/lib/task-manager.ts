/**
 * Persistent task manager for handling song generation tasks
 * Uses file-based storage to persist across API requests
 */

import fs from 'fs'
import path from 'path'

interface TaskData {
  taskId: string
  status: 'processing' | 'completed' | 'error'
  audioUrl?: string
  audioData?: string
  duration?: number
  voiceId?: string
  voiceCategory?: string
  voiceName?: string
  text?: string
  lyrics?: string
  error?: string
  createdAt: string
  provider: string
  requestId: string
}

class TaskManager {
  private tasksFile: string
  private readonly TASK_TTL = 30 * 60 * 1000 // 30 minutes

  constructor() {
    // Store tasks in a JSON file in the project root
    this.tasksFile = path.join(process.cwd(), '.tasks.json')
    this.ensureTasksFile()
    
    // Clean up old tasks periodically
    this.cleanupExpiredTasks()
  }

  private ensureTasksFile(): void {
    if (!fs.existsSync(this.tasksFile)) {
      fs.writeFileSync(this.tasksFile, '{}', 'utf8')
    }
  }

  private loadTasks(): Record<string, TaskData> {
    try {
      const data = fs.readFileSync(this.tasksFile, 'utf8')
      return JSON.parse(data) || {}
    } catch (error) {
      console.error('❌ [TASK-MANAGER] Failed to load tasks:', error)
      return {}
    }
  }

  private saveTasks(tasks: Record<string, TaskData>): void {
    try {
      fs.writeFileSync(this.tasksFile, JSON.stringify(tasks, null, 2), 'utf8')
    } catch (error) {
      console.error('❌ [TASK-MANAGER] Failed to save tasks:', error)
    }
  }

  /**
   * Create a new task
   */
  createTask(taskData: TaskData): void {
    const tasks = this.loadTasks()
    tasks[taskData.taskId] = {
      ...taskData,
      createdAt: new Date().toISOString()
    }
    this.saveTasks(tasks)
    
    console.log(`📦 [TASK-MANAGER] Task created: ${taskData.taskId}`)
  }

  /**
   * Update an existing task
   */
  updateTask(taskId: string, updates: Partial<TaskData>): boolean {
    const tasks = this.loadTasks()
    const existingTask = tasks[taskId]
    
    if (!existingTask) {
      console.warn(`⚠️ [TASK-MANAGER] Task not found for update: ${taskId}`)
      return false
    }

    const updatedTask = {
      ...existingTask,
      ...updates,
      taskId, // Ensure taskId doesn't get overridden
      createdAt: existingTask.createdAt // Preserve creation time
    }

    tasks[taskId] = updatedTask
    this.saveTasks(tasks)
    console.log(`🔄 [TASK-MANAGER] Task updated: ${taskId}`)
    return true
  }

  /**
   * Get a task by ID
   */
  getTask(taskId: string): TaskData | null {
    const tasks = this.loadTasks()
    const task = tasks[taskId]
    
    if (task) {
      console.log(`✅ [TASK-MANAGER] Task retrieved: ${taskId}`)
      return { ...task } // Return a copy to prevent mutation
    }
    
    console.log(`❌ [TASK-MANAGER] Task not found: ${taskId}`)
    return null
  }

  /**
   * Delete a task
   */
  deleteTask(taskId: string): boolean {
    const tasks = this.loadTasks()
    const existed = tasks[taskId] !== undefined
    
    if (existed) {
      delete tasks[taskId]
      this.saveTasks(tasks)
      console.log(`🗑️ [TASK-MANAGER] Task deleted: ${taskId}`)
    }
    
    return existed
  }

  /**
   * Get all task IDs (for debugging)
   */
  getAllTaskIds(): string[] {
    const tasks = this.loadTasks()
    return Object.keys(tasks)
  }

  /**
   * Get task count
   */
  getTaskCount(): number {
    const tasks = this.loadTasks()
    return Object.keys(tasks).length
  }

  /**
   * Clean up expired tasks
   */
  private cleanupExpiredTasks(): void {
    const tasks = this.loadTasks()
    const now = new Date()
    let cleanedCount = 0

    for (const [taskId, task] of Object.entries(tasks)) {
      const createdAt = new Date(task.createdAt)
      const age = now.getTime() - createdAt.getTime()
      
      if (age > this.TASK_TTL) {
        delete tasks[taskId]
        cleanedCount++
      }
    }

    if (cleanedCount > 0) {
      this.saveTasks(tasks)
      console.log(`🧹 [TASK-MANAGER] Cleaned up ${cleanedCount} expired tasks`)
    }
  }

  /**
   * Generate a unique task ID
   */
  static generateTaskId(provider: string = 'elevenlabs'): string {
    return `${provider}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// Singleton instance
let taskManagerInstance: TaskManager

/**
 * Get the global task manager instance
 */
export function getTaskManager(): TaskManager {
  if (!taskManagerInstance) {
    taskManagerInstance = new TaskManager()
  }
  return taskManagerInstance
}

export { TaskManager }
export type { TaskData }