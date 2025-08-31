import { Controller, Get, Query, UseGuards } from '@nestjs/common';
// eslint-disable-next-line prettier/prettier
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Obtenir les statistiques du dashboard' })
  // eslint-disable-next-line prettier/prettier
  @ApiResponse({ status: 200, description: 'Statistiques récupérées avec succès' })
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('logs')
  @ApiOperation({ summary: "Obtenir les logs d'audit" })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'actionType', required: false })
  getLogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('userId') userId?: string,
    @Query('actionType') actionType?: string,
  ) {
    // eslint-disable-next-line prettier/prettier
    return this.adminService.getAuditLogs(+page || 1, +limit || 20, userId, actionType);
  }
}
