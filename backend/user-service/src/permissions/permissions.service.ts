import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(permissionData: Partial<Permission>): Promise<Permission> {
    const permission = this.permissionRepository.create(permissionData);
    return this.permissionRepository.save(permission);
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }

  async findOne(id: number): Promise<Permission> {
    return this.permissionRepository.findOne({
      where: { id: id.toString() },
    });
  }

  async findByName(name: string): Promise<Permission> {
    return this.permissionRepository.findOne({
      where: { name },
    });
  }

  async update(id: number, updateData: Partial<Permission>): Promise<Permission> {
    await this.permissionRepository.update(id.toString(), updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.permissionRepository.delete(id.toString());
  }
} 