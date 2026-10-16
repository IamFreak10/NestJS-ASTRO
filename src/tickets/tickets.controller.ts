import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TicketsService } from './tickets.service.js';

@Controller('tickets')
export class TicketsController {
  //Dependency injection
  constructor(private readonly ticketsService: TicketsService) {}
  @Get()
  getHello() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id',ParseIntPipe) id: number) {
    
    return this.ticketsService.findOne(id);
  }
}
