import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const StatusRequestSchema = z.object({
  taskId: z.string().min(1)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = StatusRequestSchema.parse(body)

    // console.log('🎵 Checking Eleven Labs generation status:', validatedData.taskId)

    // Initialize global task storage if it doesn't exist
    (global as any).elevenLabsTasks = (global as any).elevenLabsTasks || new Map()

    // Get task from storage
    const task = (global as any).elevenLabsTasks.get(validatedData.taskId)

    if (!task) {
      return NextResponse.json(
        {
          error: 'Task not found',
          code: 'TASK_NOT_FOUND'
        },
        { status: 404 }
      )
    }

    // For Eleven Labs, since it's typically faster and more reliable,
    // we'll return completed status immediately if the task exists
    const response = {
      taskId: task.taskId,
      status: task.status,
      audioUrl: task.audioUrl,
      duration: task.duration,
      voiceId: task.voiceId,
      text: task.text,
      createdAt: task.createdAt,
      provider: 'elevenlabs'
    }

    // Add additional metadata for completed tasks
    if (task.status === 'completed') {
      response.metadata = {
        estimatedTime: 0,
        isDemoMode: false,
        provider: 'elevenlabs',
        voiceUsed: task.voiceId,
        textLength: task.text?.length || 0,
        processingTime: Date.now() - new Date(task.createdAt).getTime()
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    // console.error('Eleven Labs status error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: error.errors,
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to check generation status',
        code: 'STATUS_CHECK_FAILED'
      },
      { status: 500 }
    )
  }
}