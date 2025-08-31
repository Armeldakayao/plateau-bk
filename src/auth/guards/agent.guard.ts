import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AgentGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Utilisateur non authentifié');
    }

    // Vérifier si l'utilisateur a le rôle agent ou admin
    const allowedRoles = ['agent', 'admin'];
    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenException('Accès réservé aux agents et administrateurs');
    }

    return true;
  }
}