import { Body, Controller, HttpStatus, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRoadmapUseCase } from '../../../application/usecases/create-roadmap/create-roadmap.usecase';
import { CreateRoadmapRequestDto } from '../../dto/create-roadmap.request.dto';
import { CreateRoadmapResponseDto } from '../../dto/create-roadmap.response.dto';
import { RoadmapsMapper } from '../../mappers/roadmaps.mapper';

@ApiTags('Roadmaps')
@Controller('/roadmaps')
export class RoadmapsController {
  private readonly logger: Logger;

  constructor(private readonly createRoadmapUseCase: CreateRoadmapUseCase) {
    this.logger = new Logger(RoadmapsController.name);
  }

  @ApiOperation({
    summary: 'Create a new roadmap',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateRoadmapResponseDto,
    description: 'Roadmap created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found for roadmap creation',
  })
  @Post()
  async create(
    @Body() createRoadmapDto: CreateRoadmapRequestDto,
  ): Promise<CreateRoadmapResponseDto> {
    this.logger.log(`Call ${RoadmapsController.name}.create method`);
    try {
      this.logger.log(
        `CreateRoadmapRequestDto received: ${JSON.stringify(createRoadmapDto)}`,
      );

      const input =
        RoadmapsMapper.mapCreateRoadmapRequestDtoToCreateRoadmapUseCaseInput(
          createRoadmapDto,
        );

      this.logger.log(`Mapped input for use case ${JSON.stringify(input)}`);

      const result = await this.createRoadmapUseCase.execute(input);

      if (result.isLeft()) {
        throw result.value;
      }

      this.logger.log(`Roadmap created successfully - ${result.value.id}`);

      return RoadmapsMapper.mapCreateRoadmapUseCaseOutputToCreateRoadmapResponseDto(
        result.value,
      );
    } catch (error) {
      const handledError =
        error instanceof Error ? error : new Error('Failed to create roadmap');
      this.logger.error(
        `Error creating roadmap: ${handledError.message} stack: ${handledError.stack}`,
      );
      throw handledError;
    }
  }
}
