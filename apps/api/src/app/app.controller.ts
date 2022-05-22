import { Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { AppService } from './app.service';

@Controller('todos')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get(':index')
  getDataIndexed(@Param('index') index: string) {
    return this.appService.getDataIndexed(index);
  }

  @Post('add')
  addTodo() {
    return this.appService.addTodo();
  }

  @Delete(':id')
  deleteTodo(@Param('id') id: string) {
    return this.appService.deleteTodo(id);
  }
}
