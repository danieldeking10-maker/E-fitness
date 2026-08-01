import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller';
import { AiController } from './ai/ai.controller';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [HealthController, AiController],
})
export class AppModule {}


