import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRoadmapUseCase } from '../../../application/usecases/create-roadmap/create-roadmap.usecase';
import { FetchRoadmapUseCase } from '../../../application/usecases/fetch-roadmap/fetch-roadmap.usecase';
import { SearchRoadmapUseCase } from '../../../application/usecases/search-roadmap/search-roadmap.usecase';
import { CreateRoadmapRequestDto } from '../../dto/create-roadmap.request.dto';
import { CreateRoadmapResponseDto } from '../../dto/create-roadmap.response.dto';
import { FetchRoadmapRequestDto } from '../../dto/fetch-roadmap.request.dto';
import { FetchRoadmapResponseDto } from '../../dto/fetch-roadmap.response.dto';
import { SearchRoadmapRequestDto } from '../../dto/search-roadmap.request.dto';
import { SearchRoadmapResponseDto } from '../../dto/search-roadmap.response.dto';
import { RoadmapsMapper } from '../../mappers/roadmaps.mapper';

@ApiTags('Roadmaps')
@Controller('/roadmaps')
export class RoadmapsController {
  private readonly logger: Logger;

  constructor(
    private readonly createRoadmapUseCase: CreateRoadmapUseCase,
    private readonly fetchRoadmapUseCase: FetchRoadmapUseCase,
    private readonly searchRoadmapUseCase: SearchRoadmapUseCase,
  ) {
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

  @ApiOperation({
    summary: 'Fetch a roadmap',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: FetchRoadmapResponseDto,
    description: 'Roadmap fetched successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Roadmap not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request data',
  })
  @Get(':id')
  async fetchById(
    @Param() fetchRoadmapDto: FetchRoadmapRequestDto,
  ): Promise<FetchRoadmapResponseDto> {
    this.logger.log(`Call ${RoadmapsController.name}.fetchById method`);
    try {
      this.logger.log(
        `Fetch roadmap request received with id=${fetchRoadmapDto.id}`,
      );

      const input =
        RoadmapsMapper.mapFetchRoadmapRequestDtoToFetchRoadmapUseCaseInput(
          fetchRoadmapDto,
        );

      this.logger.log(`Mapped input for use case ${JSON.stringify(input)}`);

      const result = await this.fetchRoadmapUseCase.execute(input);

      if (result.isLeft()) {
        throw result.value;
      }

      this.logger.log(`Roadmap fetched successfully - ${result.value.id}`);

      return RoadmapsMapper.mapFetchRoadmapUseCaseOutputToFetchRoadmapResponseDto(
        result.value,
      );
    } catch (error) {
      const handledError =
        error instanceof Error ? error : new Error('Failed to fetch roadmap');
      this.logger.error(
        `Error fetching roadmap: ${handledError.message} stack: ${handledError.stack}`,
      );
      throw handledError;
    }
  }

  @ApiOperation({
    summary: 'Search roadmaps by filters',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SearchRoadmapResponseDto,
    description: 'Roadmaps retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request parameters',
  })
  @Get()
  async searchRoadmaps(
    @Query() searchRoadmapDto: SearchRoadmapRequestDto,
  ): Promise<SearchRoadmapResponseDto> {
    this.logger.log(`Call ${RoadmapsController.name}.searchRoadmaps method`);
    try {
      this.logger.log(
        `SearchRoadmapRequestDto received: ${JSON.stringify(searchRoadmapDto)}`,
      );

      const input =
        RoadmapsMapper.mapSearchRoadmapRequestDtoToSearchRoadmapUseCaseInput(
          searchRoadmapDto,
        );

      this.logger.log(`Mapped input for use case ${JSON.stringify(input)}`);

      const result = await this.searchRoadmapUseCase.execute(input);

      if (result.isLeft()) {
        throw result.value;
      }

      this.logger.log(
        `Roadmaps retrieved successfully - count=${result.value.data.length}, total=${result.value.total}`,
      );

      return RoadmapsMapper.mapSearchRoadmapUseCaseOutputToSearchRoadmapResponseDto(
        result.value,
      );
    } catch (error) {
      const handledError =
        error instanceof Error ? error : new Error('Failed to search roadmaps');
      this.logger.error(
        `Error searching roadmaps: ${handledError.message} stack: ${handledError.stack}`,
      );
      throw handledError;
    }
  }
}
