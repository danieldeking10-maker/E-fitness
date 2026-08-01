import { Body, Controller, Post } from '@nestjs/common';
import type {
  WellnessAssessmentRequest,
  WellnessAssessmentResponse,
  WorkoutGeneratorRequest,
  WorkoutGeneratorResponse,
  WellnessCompanionChatRequest,
  WellnessCompanionChatResponse,
} from '@e-fitness/shared';

@Controller('ai')
export class AiController {
  @Post('wellness-assessment')
  async wellnessAssessment(
    @Body() body: WellnessAssessmentRequest,
  ): Promise<WellnessAssessmentResponse> {
    return {
      ok: true,
      assessment: {
        summary: 'Stub: wellness assessment generated',
        inputs: body,
      },
    };
  }

  @Post('workout-generator')
  async workoutGenerator(
    @Body() body: WorkoutGeneratorRequest,
  ): Promise<WorkoutGeneratorResponse> {
    return {
      ok: true,
      workout: {
        title: 'Stub: workout plan',
        inputs: body,
      },
    };
  }

  @Post('wellness-companion/chat')
  async wellnessCompanionChat(
    @Body() body: WellnessCompanionChatRequest,
  ): Promise<WellnessCompanionChatResponse> {
    const lastUserMessage = body.message?.trim() || '';

    return {
      ok: true,
      reply: {
        message: `Stub: I received "${lastUserMessage}". Next: integrate LLM + context.`,
      },
    };
  }
}
