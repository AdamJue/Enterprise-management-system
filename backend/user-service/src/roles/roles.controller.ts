import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: any) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: any) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }

  // 微服务消息处理
  @MessagePattern('role.find')
  async findRoleById(@Payload() id: number) {
    return this.rolesService.findOne(id);
  }

  @MessagePattern('role.findByName')
  async findRoleByName(@Payload() name: string) {
    return this.rolesService.findByName(name);
  }

  @MessagePattern('role.create')
  async createRole(@Payload() createRoleDto: any) {
    return this.rolesService.create(createRoleDto);
  }

  @MessagePattern('role.list')
  async listRoles() {
    return this.rolesService.findAll();
  }
} 