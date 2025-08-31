// // // import {
// // //   Injectable,
// // //   UnauthorizedException,
// // //   BadRequestException,
// // //   ConflictException,
// // // } from '@nestjs/common';
// // // import { JwtService } from '@nestjs/jwt';
// // // import { InjectRepository } from '@nestjs/typeorm';
// // // import { Repository } from 'typeorm';
// // // import * as bcrypt from 'bcryptjs';
// // // import { User } from '../users/entities/user.entity';
// // // import { EmailService } from '../common/services/email.service';
// // // import { RegisterDto } from './dto/register.dto';
// // // import { LoginDto } from './dto/login.dto';
// // // import { VerifyOtpDto } from './dto/verify-otp.dto';
// // // import { ForgotPasswordDto } from './dto/forgot-password.dto';
// // // import { ResetPasswordDto } from './dto/reset-password.dto';
// // // import { ChangePasswordDto } from './dto/change-password.dto';

// // // @Injectable()
// // // export class AuthService {
// // //   constructor(
// // //     @InjectRepository(User)
// // //     private userRepository: Repository<User>,
// // //     private jwtService: JwtService,
// // //     private emailService: EmailService,
// // //   ) {}

// // //   async register(registerDto: RegisterDto) {
// // //     // Vérifier si l'utilisateur existe déjà
// // //     const existingUser = await this.userRepository.findOne({
// // //       where: { email: registerDto.email },
// // //     });

// // //     if (existingUser) {
// // //       throw new ConflictException('Un utilisateur avec cet email existe déjà');
// // //     }

// // //     // Hasher le mot de passe
// // //     const hashedPassword = await bcrypt.hash(registerDto.password, 12);

// // //     // Générer le code OTP
// // //     const otpCode = this.generateOtpCode();
// // //     const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

// // //     // Créer l'utilisateur
// // //     const user = this.userRepository.create({
// // //       ...registerDto,
// // //       password: hashedPassword,
// // //       otpCode,
// // //       otpExpiration,
// // //     });

// // //     await this.userRepository.save(user);

// // //     // Envoyer l'email OTP
// // //     await this.emailService.sendOtpEmail(user.email, otpCode);

// // //     return {
// // //       message: 'Inscription réussie. Vérifiez votre email pour le code OTP.',
// // //       userId: user.id,
// // //     };
// // //   }

// // //   async login(loginDto: LoginDto) {
// // //     // Trouver l'utilisateur
// // //     const user = await this.userRepository.findOne({
// // //       where: { email: loginDto.email },
// // //     });

// // //     if (!user) {
// // //       throw new UnauthorizedException('Email ou mot de passe incorrect');
// // //     }

// // //     // Vérifier le mot de passe
// // //     // eslint-disable-next-line prettier/prettier
// // //     const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
// // //     if (!isPasswordValid) {
// // //       throw new UnauthorizedException('Email ou mot de passe incorrect');
// // //     }

// // //     // Vérifier si l'utilisateur est vérifié
// // //     // if (!user.isVerified) {
// // //     //   // eslint-disable-next-line prettier/prettier
// // //     //   throw new UnauthorizedException('Veuillez vérifier votre email avant de vous connecter');
// // //     // }

// // //     // Générer le token JWT
// // //     const payload = { email: user.email, sub: user.id, role: user.role };
// // //     const accessToken = this.jwtService.sign(payload);

// // //     return {
// // //       accessToken,
// // //       user: {
// // //         id: user.id,
// // //         email: user.email,
// // //         firstName: user.firstName,
// // //         lastName: user.lastName,
// // //         role: user.role,
// // //       },
// // //     };
// // //   }

// // //   async verifyOtp(verifyOtpDto: VerifyOtpDto, userId: string) {
// // //     const user = await this.userRepository.findOne({
// // //       where: { id: userId },
// // //     });

// // //     if (!user) {
// // //       throw new BadRequestException('Utilisateur non trouvé');
// // //     }

// // //     if (user.otpCode !== verifyOtpDto.code) {
// // //       throw new BadRequestException('Code OTP incorrect');
// // //     }

// // //     if (user.otpExpiration < new Date()) {
// // //       throw new BadRequestException('Code OTP expiré');
// // //     }

// // //     // Marquer l'utilisateur comme vérifié
// // //     user.isVerified = true;
// // //     user.otpCode = null;
// // //     user.otpExpiration = null;

// // //     await this.userRepository.save(user);

// // //     return { message: 'Email vérifié avec succès' };
// // //   }

// // //   async resendOtp(email: string) {
// // //     const user = await this.userRepository.findOne({
// // //       where: { email },
// // //     });

// // //     if (!user) {
// // //       throw new BadRequestException('Utilisateur non trouvé');
// // //     }

// // //     if (user.isVerified) {
// // //       throw new BadRequestException('Utilisateur déjà vérifié');
// // //     }

// // //     // Générer un nouveau code OTP
// // //     const otpCode = this.generateOtpCode();
// // //     const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);

// // //     user.otpCode = otpCode;
// // //     user.otpExpiration = otpExpiration;

// // //     await this.userRepository.save(user);
// // //     await this.emailService.sendOtpEmail(email, otpCode);

// // //     return { message: 'Nouveau code OTP envoyé' };
// // //   }

// // //   async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
// // //     const user = await this.userRepository.findOne({
// // //       where: { email: forgotPasswordDto.email },
// // //     });

// // //     if (!user) {
// // //       // Ne pas révéler si l'email existe ou non
// // //       // eslint-disable-next-line prettier/prettier
// // //       return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };
// // //     }

// // //     // Générer le token de reset
// // //     const resetToken = this.generateResetToken();
// // //     const resetTokenExpiration = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

// // //     user.resetToken = resetToken;
// // //     user.resetTokenExpiration = resetTokenExpiration;

// // //     await this.userRepository.save(user);
// // //     await this.emailService.sendResetPasswordEmail(user.email, resetToken);

// // //     // eslint-disable-next-line prettier/prettier
// // //     return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };
// // //   }

// // //   async resetPassword(resetPasswordDto: ResetPasswordDto) {
// // //     const user = await this.userRepository.findOne({
// // //       where: { resetToken: resetPasswordDto.token },
// // //     });

// // //     if (!user || user.resetTokenExpiration < new Date()) {
// // //       // eslint-disable-next-line prettier/prettier
// // //       throw new BadRequestException('Token de réinitialisation invalide ou expiré');
// // //     }

// // //     // Hasher le nouveau mot de passe
// // //     const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 12);

// // //     user.password = hashedPassword;
// // //     user.resetToken = null;
// // //     user.resetTokenExpiration = null;

// // //     await this.userRepository.save(user);

// // //     return { message: 'Mot de passe réinitialisé avec succès' };
// // //   }

// // //   async changePassword(changePasswordDto: ChangePasswordDto, userId: string) {
// // //     const user = await this.userRepository.findOne({
// // //       where: { id: userId },
// // //     });

// // //     if (!user) {
// // //       throw new BadRequestException('Utilisateur non trouvé');
// // //     }

// // //     // Vérifier le mot de passe actuel
// // //     const isCurrentPasswordValid = await bcrypt.compare(
// // //       changePasswordDto.currentPassword,
// // //       user.password,
// // //     );

// // //     if (!isCurrentPasswordValid) {
// // //       throw new BadRequestException('Mot de passe actuel incorrect');
// // //     }

// // //     // Hasher le nouveau mot de passe
// // //     const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 12);
// // //     user.password = hashedPassword;

// // //     await this.userRepository.save(user);

// // //     return { message: 'Mot de passe modifié avec succès' };
// // //   }

// // //   private generateOtpCode(): string {
// // //     return Math.floor(100000 + Math.random() * 900000).toString();
// // //   }

// // //   private generateResetToken(): string {
// // //     return (
// // //       // eslint-disable-next-line prettier/prettier
// // //       Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
// // //     );
// // //   }
// // // }
// // // src/auth/auth.service.ts
// // import { Injectable, UnauthorizedException, BadRequestException, ConflictException, Logger } from '@nestjs/common';
// // import { JwtService } from '@nestjs/jwt';
// // import { InjectRepository } from '@nestjs/typeorm';
// // import { Repository } from 'typeorm';
// // import * as bcrypt from 'bcryptjs';
// // import { User } from '../users/entities/user.entity';
// // import { EmailService } from '../common/services/email.service';
// // import { RegisterDto } from './dto/register.dto';
// // import { LoginDto } from './dto/login.dto';
// // // import { VerifyOtpDto } from './dto/verify-otp.dto';
// // import { ForgotPasswordDto } from './dto/forgot-password.dto';
// // import { ResetPasswordDto } from './dto/reset-password.dto';
// // import { ChangePasswordDto } from './dto/change-password.dto';
// // import { VerifyLoginOtpDto } from './dto/verify-otp.dto';

// // @Injectable()
// // export class AuthService {
// //   private readonly logger = new Logger(AuthService.name);

// //   constructor(
// //     @InjectRepository(User)
// //     private userRepository: Repository<User>,
// //     private jwtService: JwtService,
// //     private emailService: EmailService,
// //   ) {}

// //   async register(registerDto: RegisterDto) {
// //     try {
// //       // Vérifier si l'utilisateur existe déjà
// //       const existingUser = await this.userRepository.findOne({
// //         where: { email: registerDto.email }
// //       });

// //       if (existingUser) {
// //         throw new ConflictException('Un utilisateur avec cet email existe déjà');
// //       }

// //       // Hasher le mot de passe
// //       const hashedPassword = await bcrypt.hash(registerDto.password, 12);

// //       // Générer le code OTP pour vérification
// //       const otpCode = this.generateOtpCode();
// //       const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

// //       // Créer l'utilisateur
// //       const user = this.userRepository.create({
// //         ...registerDto,
// //         password: hashedPassword,
// //         otpCode,
// //         otpExpiration,
// //         isVerified: false, // Pas vérifié tant que l'OTP n'est pas confirmé
// //       });

// //       const savedUser = await this.userRepository.save(user);
// //       this.logger.log(`Nouvel utilisateur créé: ${savedUser.email}`);

// //       // Envoyer l'email OTP de vérification
// //       await this.emailService.sendOtpEmail(savedUser.email, otpCode, 'verification');

// //       return {
// //         message: 'Inscription réussie. Vérifiez votre email pour le code de vérification.',
// //         userId: savedUser.id,
// //         email: savedUser.email,
// //         requiresVerification: true,
// //       };
// //     } catch (error) {
// //       this.logger.error('Erreur lors de l\'inscription:', error);
// //       throw error;
// //     }
// //   }

// //   async login(loginDto: LoginDto) {
// //     try {
// //       // Trouver l'utilisateur
// //       const user = await this.userRepository.findOne({
// //         where: { email: loginDto.email }
// //       });

// //       if (!user) {
// //         throw new UnauthorizedException('Email ou mot de passe incorrect');
// //       }

// //       // Vérifier le mot de passe
// //       const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
// //       if (!isPasswordValid) {
// //         throw new UnauthorizedException('Email ou mot de passe incorrect');
// //       }

// //       // Vérifier si l'utilisateur est vérifié
// //       if (!user.isVerified) {
// //         throw new UnauthorizedException('Veuillez vérifier votre email avant de vous connecter');
// //       }

// //       // Générer un nouveau code OTP pour la connexion
// //       const otpCode = this.generateOtpCode();
// //       const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

// //       // Mettre à jour l'utilisateur avec le nouveau code OTP
// //       user.otpCode = otpCode;
// //       user.otpExpiration = otpExpiration;
// //       await this.userRepository.save(user);

// //       // Envoyer le code OTP de connexion
// //       await this.emailService.sendOtpEmail(user.email, otpCode, 'login');

// //       this.logger.log(`Code OTP de connexion envoyé à: ${user.email}`);

// //       return {
// //         message: 'Code de connexion envoyé par email. Veuillez le saisir pour finaliser votre connexion.',
// //         userId: user.id,
// //         email: user.email,
// //         requiresOtp: true,
// //       };
// //     } catch (error) {
// //       this.logger.error('Erreur lors de la connexion:', error);
// //       throw error;
// //     }
// //   }

// //   async verifyLoginOtp(verifyOtpDto: VerifyLoginOtpDto, userId: string) {
// //     try {
// //       const user = await this.userRepository.findOne({
// //         where: { id: userId }
// //       });

// //       if (!user) {
// //         throw new BadRequestException('Utilisateur non trouvé');
// //       }

// //       if (!user.otpCode || user.otpCode !== verifyOtpDto.code) {
// //         throw new BadRequestException('Code OTP incorrect');
// //       }

// //       if (!user.otpExpiration || user.otpExpiration < new Date()) {
// //         throw new BadRequestException('Code OTP expiré');
// //       }

// //       // Effacer le code OTP après vérification réussie
// //       user.otpCode = null;
// //       user.otpExpiration = null;
// //       await this.userRepository.save(user);

// //       // Générer le token JWT
// //       const payload = { email: user.email, sub: user.id, role: user.role };
// //       const accessToken = this.jwtService.sign(payload);

// //       this.logger.log(`Connexion réussie pour: ${user.email}`);

// //       return {
// //         message: 'Connexion réussie',
// //         accessToken,
// //         user: {
// //           id: user.id,
// //           email: user.email,
// //           firstName: user.firstName,
// //           lastName: user.lastName,
// //           role: user.role,
// //           isVerified: user.isVerified,
// //         },
// //       };
// //     } catch (error) {
// //       this.logger.error('Erreur lors de la vérification OTP de connexion:', error);
// //       throw error;
// //     }
// //   }

// //   async verifyRegistrationOtp(verifyOtpDto: VerifyLoginOtpDto, userId: string) {
// //     try {
// //       const user = await this.userRepository.findOne({
// //         where: { id: userId }
// //       });

// //       if (!user) {
// //         throw new BadRequestException('Utilisateur non trouvé');
// //       }

// //       if (!user.otpCode || user.otpCode !== verifyOtpDto.code) {
// //         throw new BadRequestException('Code OTP incorrect');
// //       }

// //       if (!user.otpExpiration || user.otpExpiration < new Date()) {
// //         throw new BadRequestException('Code OTP expiré');
// //       }

// //       // Marquer l'utilisateur comme vérifié et effacer l'OTP
// //       user.isVerified = true;
// //       user.otpCode = null;
// //       user.otpExpiration = null;
// //       await this.userRepository.save(user);

// //       // Envoyer email de bienvenue
// //       await this.emailService.sendWelcomeEmail(user.email, user.firstName);

// //       // Connecter automatiquement l'utilisateur après vérification
// //       const payload = { email: user.email, sub: user.id, role: user.role };
// //       const accessToken = this.jwtService.sign(payload);

// //       this.logger.log(`Compte vérifié et connecté: ${user.email}`);

// //       return {
// //         message: 'Email vérifié avec succès. Vous êtes maintenant connecté.',
// //         accessToken,
// //         user: {
// //           id: user.id,
// //           email: user.email,
// //           firstName: user.firstName,
// //           lastName: user.lastName,
// //           role: user.role,
// //           isVerified: user.isVerified,
// //         },
// //       };
// //     } catch (error) {
// //       this.logger.error('Erreur lors de la vérification OTP d\'inscription:', error);
// //       throw error;
// //     }
// //   }

// //   async resendOtp(email: string, type: 'verification' | 'login' = 'verification') {
// //     try {
// //       const user = await this.userRepository.findOne({
// //         where: { email }
// //       });

// //       if (!user) {
// //         throw new BadRequestException('Utilisateur non trouvé');
// //       }

// //       if (type === 'verification' && user.isVerified) {
// //         throw new BadRequestException('Utilisateur déjà vérifié');
// //       }

// //       // Générer un nouveau code OTP
// //       const otpCode = this.generateOtpCode();
// //       const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);

// //       user.otpCode = otpCode;
// //       user.otpExpiration = otpExpiration;

// //       await this.userRepository.save(user);
// //       await this.emailService.sendOtpEmail(email, otpCode, type);

// //       this.logger.log(`Nouveau code OTP envoyé à ${email} (type: ${type})`);

// //       return { 
// //         message: 'Nouveau code OTP envoyé',
// //         userId: user.id,
// //       };
// //     } catch (error) {
// //       this.logger.error('Erreur lors du renvoi OTP:', error);
// //       throw error;
// //     }
// //   }

// //   async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
// //     try {
// //       const user = await this.userRepository.findOne({
// //         where: { email: forgotPasswordDto.email }
// //       });

// //       if (!user) {
// //         // Ne pas révéler si l'email existe ou non
// //         return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };
// //       }

// //       // Générer le token de reset
// //       const resetToken = this.generateResetToken();
// //       const resetTokenExpiration = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

// //       user.resetToken = resetToken;
// //       user.resetTokenExpiration = resetTokenExpiration;

// //       await this.userRepository.save(user);
// //       await this.emailService.sendResetPasswordEmail(user.email, resetToken);

// //       this.logger.log(`Token de reset généré pour: ${user.email}`);

// //       return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };
// //     } catch (error) {
// //       this.logger.error('Erreur lors de la demande de reset:', error);
// //       throw error;
// //     }
// //   }

// //   async resetPassword(resetPasswordDto: ResetPasswordDto) {
// //     try {
// //       const user = await this.userRepository.findOne({
// //         where: { resetToken: resetPasswordDto.token }
// //       });

// //       if (!user || !user.resetTokenExpiration || user.resetTokenExpiration < new Date()) {
// //         throw new BadRequestException('Token de réinitialisation invalide ou expiré');
// //       }

// //       // Hasher le nouveau mot de passe
// //       const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 12);

// //       user.password = hashedPassword;
// //       user.resetToken = null;
// //       user.resetTokenExpiration = null;

// //       await this.userRepository.save(user);

// //       this.logger.log(`Mot de passe réinitialisé pour: ${user.email}`);

// //       return { message: 'Mot de passe réinitialisé avec succès' };
// //     } catch (error) {
// //       this.logger.error('Erreur lors de la réinitialisation:', error);
// //       throw error;
// //     }
// //   }

// //   async changePassword(changePasswordDto: ChangePasswordDto, userId: string) {
// //     try {
// //       const user = await this.userRepository.findOne({
// //         where: { id: userId }
// //       });

// //       if (!user) {
// //         throw new BadRequestException('Utilisateur non trouvé');
// //       }

// //       // Vérifier le mot de passe actuel
// //       const isCurrentPasswordValid = await bcrypt.compare(
// //         changePasswordDto.currentPassword,
// //         user.password
// //       );

// //       if (!isCurrentPasswordValid) {
// //         throw new BadRequestException('Mot de passe actuel incorrect');
// //       }

// //       // Hasher le nouveau mot de passe
// //       const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 12);
// //       user.password = hashedPassword;

// //       await this.userRepository.save(user);

// //       this.logger.log(`Mot de passe changé pour: ${user.email}`);

// //       return { message: 'Mot de passe modifié avec succès' };
// //     } catch (error) {
// //       this.logger.error('Erreur lors du changement de mot de passe:', error);
// //       throw error;
// //     }
// //   }

// //   // Méthode utilitaire pour valider l'utilisateur (utilisée par JwtStrategy)
// //   async validateUser(userId: string) {
// //     const user = await this.userRepository.findOne({
// //       where: { id: userId },
// //       select: ['id', 'email', 'firstName', 'lastName', 'role', 'isVerified'],
// //     });

// //     if (!user || !user.isVerified) {
// //       return null;
// //     }

// //     return user;
// //   }

// //   private generateOtpCode(): string {
// //     return Math.floor(100000 + Math.random() * 900000).toString();
// //   }

// //   private generateResetToken(): string {
// //     return Math.random().toString(36).substring(2, 15) + 
// //            Math.random().toString(36).substring(2, 15) +
// //            Date.now().toString(36);
// //   }
// // }


















// // src/auth/auth.service.ts
// import { Injectable, UnauthorizedException, BadRequestException, ConflictException, Logger } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import * as bcrypt from 'bcryptjs';
// import { User } from '../users/entities/user.entity';
// import { EmailService } from '../common/services/email.service';
// import { RegisterDto } from './dto/register.dto';
// import { LoginDto } from './dto/login.dto';
// // import { VerifyOtpDto } from './dto/verify-otp.dto';
// import { ForgotPasswordDto } from './dto/forgot-password.dto';
// import { ResetPasswordDto } from './dto/reset-password.dto';
// import { ChangePasswordDto } from './dto/change-password.dto';
// import { VerifyLoginOtpDto } from './dto/verify-otp.dto';

// @Injectable()
// export class AuthService {
//   private readonly logger = new Logger(AuthService.name);

//   constructor(
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//     private jwtService: JwtService,
//     private emailService: EmailService,
//   ) {}

//   async register(registerDto: RegisterDto) {
//     this.logger.log(`Tentative d'inscription pour: ${registerDto.email}`);

//     // Vérifier si l'utilisateur existe déjà
//     const existingUser = await this.userRepository.findOne({
//       where: { email: registerDto.email }
//     });

//     if (existingUser) {
//       throw new ConflictException('Un utilisateur avec cet email existe déjà');
//     }

//     // Hasher le mot de passe
//     const hashedPassword = await bcrypt.hash(registerDto.password, 12);

//     // Générer le code OTP
//     const otpCode = this.generateOtpCode();
//     const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

//     // Créer l'utilisateur
//     const user = this.userRepository.create({
//       ...registerDto,
//       password: hashedPassword,
//       otpCode,
//       otpExpiration,
//       isVerified: false, // Pas vérifié à l'inscription
//     });

//     const savedUser = await this.userRepository.save(user);
//     this.logger.log(`Utilisateur créé avec ID: ${savedUser.id}`);

//     // Envoyer l'email OTP
//     try {
//       await this.emailService.sendOtpEmail(savedUser.email, otpCode, 'registration');
//       this.logger.log(`Email OTP envoyé à: ${savedUser.email}`);
//     } catch (error) {
//       this.logger.error(`Erreur envoi email OTP: `);
//       // Supprimer l'utilisateur si l'email n'a pas pu être envoyé
//       await this.userRepository.remove(savedUser);
//       throw new BadRequestException('Impossible d\'envoyer l\'email de vérification. Veuillez réessayer.');
//     }

//     return {
//       message: 'Inscription réussie. Vérifiez votre email pour le code OTP.',
//       userId: savedUser.id,
//       email: savedUser.email,
//     };
//   }

//   // ÉTAPE 1 DE CONNEXION : Vérifier les identifiants et envoyer OTP
//   async initiateLogin(loginDto: LoginDto) {
//     this.logger.log(`Tentative de connexion pour: ${loginDto.email}`);

//     // Trouver l'utilisateur
//     const user = await this.userRepository.findOne({
//       where: { email: loginDto.email }
//     });

//     if (!user) {
//       throw new UnauthorizedException('Email ou mot de passe incorrect');
//     }

//     // Vérifier le mot de passe
//     const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
//     if (!isPasswordValid) {
//       throw new UnauthorizedException('Email ou mot de passe incorrect');
//     }

//     // Vérifier si l'utilisateur est vérifié (compte confirmé)
//     if (!user.isVerified) {
//       throw new UnauthorizedException('Veuillez d\'abord vérifier votre email d\'inscription');
//     }

//     // Générer un nouveau code OTP pour la connexion
//     const otpCode = this.generateOtpCode();
//     const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

//     // Sauvegarder le code OTP
//     user.otpCode = otpCode;
//     user.otpExpiration = otpExpiration;
//     await this.userRepository.save(user);

//     // Envoyer l'email OTP
//     try {
//       await this.emailService.sendOtpEmail(user.email, otpCode, 'login');
//       this.logger.log(`Code OTP de connexion envoyé à: ${user.email}`);
//     } catch (error) {
//       this.logger.error(`Erreur envoi OTP connexion: `);
//       throw new BadRequestException('Impossible d\'envoyer le code de vérification. Veuillez réessayer.');
//     }

//     return {
//       message: 'Code de vérification envoyé par email. Veuillez le saisir pour finaliser votre connexion.',
//       tempUserId: user.id,
//       email: user.email,
//       requiresOtp: true,
//     };
//   }

//   // ÉTAPE 2 DE CONNEXION : Vérifier l'OTP et générer le token
//   async completeLogin(verifyOtpDto: VerifyLoginOtpDto, userId: string) {
//     this.logger.log(`Vérification OTP pour utilisateur: ${userId}`);

//     const user = await this.userRepository.findOne({
//       where: { id: userId }
//     });

//     if (!user) {
//       throw new BadRequestException('Session invalide');
//     }

//     // Vérifier le code OTP
//     if (!user.otpCode || user.otpCode !== verifyOtpDto.code) {
//       throw new BadRequestException('Code OTP incorrect');
//     }

//     // Vérifier l'expiration
//     if (!user.otpExpiration || user.otpExpiration < new Date()) {
//       throw new BadRequestException('Code OTP expiré. Veuillez vous reconnecter.');
//     }

//     // Nettoyer le code OTP
//     user.otpCode = null;
//     user.otpExpiration = null;
//     await this.userRepository.save(user);

//     // Générer le token JWT
//     const payload = { email: user.email, sub: user.id, role: user.role };
//     const accessToken = this.jwtService.sign(payload);

//     this.logger.log(`Connexion réussie pour: ${user.email}`);

//     return {
//       message: 'Connexion réussie',
//       accessToken,
//       user: {
//         id: user.id,
//         email: user.email,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         role: user.role,
//       },
//     };
//   }

//   // Vérification OTP pour l'inscription (confirmer le compte)
//   async verifyRegistrationOtp(verifyOtpDto: VerifyLoginOtpDto, userId: string) {
//     this.logger.log(`Vérification OTP inscription pour: ${userId}`);

//     const user = await this.userRepository.findOne({
//       where: { id: userId }
//     });

//     if (!user) {
//       throw new BadRequestException('Utilisateur non trouvé');
//     }

//     if (user.isVerified) {
//       throw new BadRequestException('Compte déjà vérifié');
//     }

//     if (!user.otpCode || user.otpCode !== verifyOtpDto.code) {
//       throw new BadRequestException('Code OTP incorrect');
//     }

//     if (!user.otpExpiration || user.otpExpiration < new Date()) {
//       throw new BadRequestException('Code OTP expiré');
//     }

//     // Marquer l'utilisateur comme vérifié
//     user.isVerified = true;
//     user.otpCode = null;
//     user.otpExpiration = null;

//     await this.userRepository.save(user);

//     // Connecter automatiquement après vérification
//     const payload = { email: user.email, sub: user.id, role: user.role };
//     const accessToken = this.jwtService.sign(payload);

//     this.logger.log(`Compte vérifié et connecté automatiquement: ${user.email}`);

//     return {
//       message: 'Email vérifié avec succès. Vous êtes maintenant connecté.',
//       accessToken,
//       user: {
//         id: user.id,
//         email: user.email,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         role: user.role,
//       },
//     };
//   }

//   async resendOtp(email: string, type: 'registration' | 'login' = 'registration') {
//     this.logger.log(`Renvoi OTP demandé pour: ${email}`);

//     const user = await this.userRepository.findOne({
//       where: { email }
//     });

//     if (!user) {
//       throw new BadRequestException('Utilisateur non trouvé');
//     }

//     if (type === 'registration' && user.isVerified) {
//       throw new BadRequestException('Compte déjà vérifié');
//     }

//     // Générer un nouveau code OTP
//     const otpCode = this.generateOtpCode();
//     const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);

//     user.otpCode = otpCode;
//     user.otpExpiration = otpExpiration;

//     await this.userRepository.save(user);

//     try {
//       await this.emailService.sendOtpEmail(email, otpCode, type);
//       this.logger.log(`Nouveau code OTP envoyé à: ${email}`);
//     } catch (error) {
//       this.logger.error(`Erreur renvoi OTP: `);
//       throw new BadRequestException('Impossible d\'envoyer le code de vérification');
//     }

//     return { 
//       message: 'Nouveau code OTP envoyé',
//       email: email,
//     };
//   }

//   async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
//     const user = await this.userRepository.findOne({
//       where: { email: forgotPasswordDto.email }
//     });

//     if (!user) {
//       // Ne pas révéler si l'email existe ou non
//       return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };
//     }

//     // Générer le token de reset
//     const resetToken = this.generateResetToken();
//     const resetTokenExpiration = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

//     user.resetToken = resetToken;
//     user.resetTokenExpiration = resetTokenExpiration;

//     await this.userRepository.save(user);

//     try {
//       await this.emailService.sendResetPasswordEmail(user.email, resetToken);
//     } catch (error) {
//       this.logger.error(`Erreur envoi email reset:`);
//     }

//     return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };
//   }

//   async resetPassword(resetPasswordDto: ResetPasswordDto) {
//     const user = await this.userRepository.findOne({
//       where: { resetToken: resetPasswordDto.token }
//     });

//     if (!user || !user.resetTokenExpiration || user.resetTokenExpiration < new Date()) {
//       throw new BadRequestException('Token de réinitialisation invalide ou expiré');
//     }

//     // Hasher le nouveau mot de passe
//     const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 12);

//     user.password = hashedPassword;
//     user.resetToken = null;
//     user.resetTokenExpiration = null;

//     await this.userRepository.save(user);

//     return { message: 'Mot de passe réinitialisé avec succès' };
//   }

//   async changePassword(changePasswordDto: ChangePasswordDto, userId: string) {
//     const user = await this.userRepository.findOne({
//       where: { id: userId }
//     });

//     if (!user) {
//       throw new BadRequestException('Utilisateur non trouvé');
//     }

//     // Vérifier le mot de passe actuel
//     const isCurrentPasswordValid = await bcrypt.compare(
//       changePasswordDto.currentPassword,
//       user.password
//     );

//     if (!isCurrentPasswordValid) {
//       throw new BadRequestException('Mot de passe actuel incorrect');
//     }

//     // Hasher le nouveau mot de passe
//     const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 12);
//     user.password = hashedPassword;

//     await this.userRepository.save(user);

//     return { message: 'Mot de passe modifié avec succès' };
//   }

//   // Méthode pour tester la configuration email
//   async testEmail() {
//     const isWorking = await this.emailService.testEmailConnection();
//     return {
//       emailConfigured: isWorking,
//       message: isWorking ? 'Configuration email OK' : 'Problème de configuration email'
//     };
//   }

//   private generateOtpCode(): string {
//     return Math.floor(100000 + Math.random() * 900000).toString();
//   }

//   private generateResetToken(): string {
//     return Math.random().toString(36).substring(2, 15) + 
//            Math.random().toString(36).substring(2, 15);
//   }
// }






















import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { EmailService } from '../common/services/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginOtpDto } from './dto/login-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await this.userRepository.findOne({
        where: { email: registerDto.email }
      });

      if (existingUser) {
        throw new ConflictException('Un utilisateur avec cet email existe déjà');
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(registerDto.password, 12);

      // Générer le code OTP
      const otpCode = this.generateOtpCode();
      const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Créer l'utilisateur
      const user = this.userRepository.create({
        ...registerDto,
        password: hashedPassword,
        otpCode,
        otpExpiration,
        isVerified: false, // Pas vérifié au début
      });

      const savedUser = await this.userRepository.save(user);

      // Envoyer l'email OTP
      await this.emailService.sendOtpEmail(savedUser.email, otpCode, 'registration');

      return {
        message: 'Inscription réussie. Vérifiez votre email pour le code OTP.',
        userId: savedUser.id,
        email: savedUser.email,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de l\'inscription: ' );
    }
  }

  async login(loginDto: LoginDto) {
    try {
      // Trouver l'utilisateur
      const user = await this.userRepository.findOne({
        where: { email: loginDto.email }
      });

      if (!user) {
        throw new UnauthorizedException('Email ou mot de passe incorrect');
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Email ou mot de passe incorrect');
      }

      // Vérifier si l'utilisateur est vérifié
      if (!user.isVerified) {
        throw new UnauthorizedException('Veuillez vérifier votre email avant de vous connecter');
      }

      // Générer un nouveau code OTP pour la connexion
      const otpCode = this.generateOtpCode();
      const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Sauvegarder le code OTP
      user.otpCode = otpCode;
      user.otpExpiration = otpExpiration;
      await this.userRepository.save(user);

      // Envoyer l'email OTP de connexion
      await this.emailService.sendOtpEmail(user.email, otpCode, 'login');

      return {
        message: 'Code de vérification envoyé. Vérifiez votre email.',
        requiresOtp: true,
        email: user.email,
        userId: user.id,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de la connexion: ' );
    }
  }

  async verifyOtpAndLogin(loginOtpDto: LoginOtpDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: loginOtpDto.email }
      });

      if (!user) {
        throw new UnauthorizedException('Utilisateur non trouvé');
      }

      if (user.otpCode !== loginOtpDto.otpCode) {
        throw new BadRequestException('Code OTP incorrect');
      }

      if (user.otpExpiration < new Date()) {
        throw new BadRequestException('Code OTP expiré. Veuillez vous reconnecter.');
      }

      // Nettoyer le code OTP après vérification
      user.otpCode = null;
      user.otpExpiration = null;
      await this.userRepository.save(user);

      // Générer le token JWT
      const payload = { email: user.email, sub: user.id, role: user.role };
      const accessToken = this.jwtService.sign(payload);

      return {
        message: 'Connexion réussie',
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de la vérification: ' );
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: verifyOtpDto.userId }
      });

      if (!user) {
        throw new BadRequestException('Utilisateur non trouvé');
      }

      if (user.otpCode !== verifyOtpDto.code) {
        throw new BadRequestException('Code OTP incorrect');
      }

      if (user.otpExpiration < new Date()) {
        throw new BadRequestException('Code OTP expiré');
      }

      // Marquer l'utilisateur comme vérifié et nettoyer l'OTP
      user.isVerified = true;
      user.otpCode = null;
      user.otpExpiration = null;

      await this.userRepository.save(user);

      // Générer le token JWT pour connexion automatique après vérification
      const payload = { email: user.email, sub: user.id, role: user.role };
      const accessToken = this.jwtService.sign(payload);

      return { 
        message: 'Email vérifié avec succès. Vous êtes maintenant connecté.',
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de la vérification: ' );
    }
  }

  async resendOtp(email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { email }
      });

      if (!user) {
        throw new BadRequestException('Utilisateur non trouvé');
      }

      // Générer un nouveau code OTP
      const otpCode = this.generateOtpCode();
      const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);

      user.otpCode = otpCode;
      user.otpExpiration = otpExpiration;

      await this.userRepository.save(user);

      // Déterminer le type d'envoi
      const otpType = user.isVerified ? 'login' : 'registration';
      await this.emailService.sendOtpEmail(email, otpCode, otpType);

      return { 
        message: 'Nouveau code OTP envoyé',
        userId: user.id,
        email: user.email,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors du renvoi: ' );
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: forgotPasswordDto.email }
      });

      if (!user) {
        // Ne pas révéler si l'email existe ou non
        return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };
      }

      // Générer le token de reset
      const resetToken = this.generateResetToken();
      const resetTokenExpiration = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

      user.resetToken = resetToken;
      user.resetTokenExpiration = resetTokenExpiration;

      await this.userRepository.save(user);
      await this.emailService.sendResetPasswordEmail(user.email, resetToken);

      return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };
    } catch (error) {
      throw new BadRequestException('Erreur lors de la demande de reset: ' );
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { resetToken: resetPasswordDto.token }
      });

      if (!user || user.resetTokenExpiration < new Date()) {
        throw new BadRequestException('Token de réinitialisation invalide ou expiré');
      }

      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 12);

      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpiration = null;

      await this.userRepository.save(user);

      return { message: 'Mot de passe réinitialisé avec succès' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors du reset: ' );
    }
  }

  async changePassword(changePasswordDto: ChangePasswordDto, userId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId }
      });

      if (!user) {
        throw new BadRequestException('Utilisateur non trouvé');
      }

      // Vérifier le mot de passe actuel
      const isCurrentPasswordValid = await bcrypt.compare(
        changePasswordDto.currentPassword,
        user.password
      );

      if (!isCurrentPasswordValid) {
        throw new BadRequestException('Mot de passe actuel incorrect');
      }

      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 12);
      user.password = hashedPassword;

      await this.userRepository.save(user);

      return { message: 'Mot de passe modifié avec succès' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors du changement: ' );
    }
  }

  private generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateResetToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}