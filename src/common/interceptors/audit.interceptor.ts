/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line prettier/prettier
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AdminService } from '../../admin/admin.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private adminService: AdminService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, ip, headers } = request;
    const userAgent = headers['user-agent'];

    // Déterminer le type d'action
    const actionType = this.getActionType(method);

    // Extraire l'entité depuis l'URL
    const entity = this.extractEntityFromUrl(url);

    return next.handle().pipe(
      tap(async (response) => {
        // Logger uniquement les actions importantes
        if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(method) && user) {
          try {
            await this.adminService.createAuditLog(
              actionType,
              entity,
              response?.id || request.params?.id,
              user?.id,
              null, // oldValues - à implémenter si nécessaire
              response,
              ip,
              userAgent,
            );
          } catch (error) {
            // Logger l'erreur mais ne pas interrompre la requête
            console.error("Erreur lors de la création du log d'audit:", error);
          }
        }
      }),
    );
  }

  private getActionType(method: string): string {
    switch (method) {
      case 'POST':
        return 'CREATE';
      case 'PATCH':
      case 'PUT':
        return 'UPDATE';
      case 'DELETE':
        return 'DELETE';
      default:
        return 'READ';
    }
  }

  private extractEntityFromUrl(url: string): string {
    const segments = url.split('/').filter((s) => s);
    return segments[0] || 'unknown';
  }
}
