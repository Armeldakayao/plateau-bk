import { Controller, Post, Body, Patch, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginOtpDto } from './dto/login-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ 
    summary: 'Inscription d\'un nouvel utilisateur',
    description: 'Créer un compte et envoyer un code OTP par email pour vérification'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Inscription réussie, code OTP envoyé',
    schema: {
      example: {
        message: 'Inscription réussie. Vérifiez votre email pour le code OTP.',
        userId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'user@example.com'
      }
    }
  })
  @ApiResponse({ status: 409, description: 'Utilisateur déjà existant' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ 
    summary: 'Première étape de connexion',
    description: 'Vérifier les identifiants et envoyer un code OTP'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Code OTP envoyé pour finaliser la connexion',
    schema: {
      example: {
        message: 'Code de vérification envoyé. Vérifiez votre email.',
        requiresOtp: true,
        email: 'user@example.com',
        userId: '550e8400-e29b-41d4-a716-446655440000'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Identifiants incorrects' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('verify-otp')
  @ApiOperation({ 
    summary: 'Vérifier le code OTP après inscription',
    description: 'Vérifier le code OTP et activer le compte (connexion automatique)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Code vérifié, utilisateur connecté automatiquement',
    schema: {
      example: {
        message: 'Email vérifié avec succès. Vous êtes maintenant connecté.',
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'user@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Code incorrect ou expiré' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Post('login-with-otp')
  @ApiOperation({ 
    summary: 'Finaliser la connexion avec le code OTP',
    description: 'Vérifier le code OTP reçu après login et obtenir le token d\'accès'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Connexion finalisée avec succès',
    schema: {
      example: {
        message: 'Connexion réussie',
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'user@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Code OTP incorrect ou expiré' })
  async loginWithOtp(@Body() loginOtpDto: LoginOtpDto) {
    return this.authService.verifyOtpAndLogin(loginOtpDto);
  }

  @Post('resend-otp')
  @ApiOperation({ 
    summary: 'Renvoyer le code OTP',
    description: 'Renvoyer un nouveau code OTP par email'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Nouveau code envoyé',
    schema: {
      example: {
        message: 'Nouveau code OTP envoyé',
        userId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'user@example.com'
      }
    }
  })
  async resendOtp(@Body() body: { email: string }) {
    return this.authService.resendOtp(body.email);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Demande de réinitialisation de mot de passe' })
  @ApiResponse({ status: 200, description: 'Email de réinitialisation envoyé' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Réinitialisation du mot de passe avec token' })
  @ApiResponse({ status: 200, description: 'Mot de passe réinitialisé' })
  @ApiResponse({ status: 400, description: 'Token invalide' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Changement de mot de passe (utilisateur connecté)' })
  @ApiResponse({ status: 200, description: 'Mot de passe modifié' })
  @ApiResponse({ status: 400, description: 'Mot de passe actuel incorrect' })
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Request() req) {
    return this.authService.changePassword(changePasswordDto, req.user.id);
  }
}