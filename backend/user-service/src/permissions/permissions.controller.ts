import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PermissionsService } from './permissions.service';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  create(@Body() createPermissionDto: any) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermissionDto: any) {
    return this.permissionsService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(+id);
  }

  // 微服务消息处理
  @MessagePattern('permission.find')
  async findPermissionById(@Payload() id: number) {
    return this.permissionsService.findOne(id);
  }

  @MessagePattern('permission.findByName')
  async findPermissionByName(@Payload() name: string) {
    return this.permissionsService.findByName(name);
  }

  @MessagePattern('permission.create')
  async createPermission(@Payload() createPermissionDto: any) {
    return this.permissionsService.create(createPermissionDto);
  }

  @MessagePattern('permission.list')
  async listPermissions() {
    return this.permissionsService.findAll();
  }
} 