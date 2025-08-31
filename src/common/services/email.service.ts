
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: parseInt(this.configService.get('SMTP_PORT')),
      secure: this.configService.get('SMTP_SECURE') === 'true',
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
      debug: true,
      logger: true,
    });

    this.verifyConnection();
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      this.logger.log('Connexion SMTP vérifiée avec succès');
    } catch (error) {
      this.logger.error('Erreur de connexion SMTP:', error);
    }
  }

  private getBaseTemplate(content: string): string {
    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Citoyenne</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Poppins', 'Plus Jakarta Sans', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
          }
          
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          }
          
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          
          .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="1" fill="white" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
            pointer-events: none;
          }
          
          .logo {
            width: 60px;
            height: 60px;
            background: rgba(255,255,255,0.2);
            border-radius: 16px;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 2;
          }
          
          .logo::before {
            content: '🏛️';
            font-size: 28px;
          }
          
          .app-name {
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: white;
            font-size: 24px;
            font-weight: 700;
            margin: 0;
            position: relative;
            z-index: 2;
          }
          
          .content {
            padding: 40px 30px;
          }
          
          .footer {
            background-color: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          
          @media (max-width: 600px) {
            .container {
              margin: 10px;
              border-radius: 12px;
            }
            
            .header {
              padding: 30px 20px;
            }
            
            .content {
              padding: 30px 20px;
            }
            
            .footer {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div style="padding: 20px;">
          <div class="container">
            <div class="header">
              <div class="logo"></div>
              <h1 class="app-name">Application Citoyenne</h1>
            </div>
            <div class="content">
              ${content}
            </div>
            <div class="footer">
              <p style="color: #64748b; font-size: 14px; margin-bottom: 10px;">
                Cet email a été envoyé automatiquement, merci de ne pas répondre.
              </p>
              <p style="color: #94a3b8; font-size: 12px;">
                © 2024 Application Citoyenne. Tous droits réservés.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getOtpTemplate(otpCode: string, type: 'registration' | 'login'): string {
    const isRegistration = type === 'registration';
    const title = isRegistration ? '✨ Bienvenue !' : '🔐 Connexion sécurisée';
    const subtitle = isRegistration 
      ? 'Vérification de votre compte' 
      : 'Code de connexion';
    const message = isRegistration
      ? 'Merci pour votre inscription ! Pour finaliser la création de votre compte, veuillez saisir le code de vérification ci-dessous.'
      : 'Voici votre code de connexion sécurisée. Saisissez-le pour accéder à votre compte.';

    const content = `
      <div style="text-align: center;">
        <div style="font-size: 48px; margin-bottom: 20px;">
          ${isRegistration ? '🎉' : '🔑'}
        </div>
        
        <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; color: #1e293b; font-size: 28px; font-weight: 700; margin-bottom: 10px;">
          ${title}
        </h2>
        
        <p style="color: #475569; font-size: 18px; font-weight: 500; margin-bottom: 30px;">
          ${subtitle}
        </p>
        
        <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin-bottom: 40px;">
          ${message}
        </p>
        
        <div style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); border-radius: 20px; padding: 40px; margin: 40px 0; border: 2px dashed #cbd5e1;">
          <p style="color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; margin-bottom: 15px;">
            Votre code de vérification
          </p>
          
          <div style="font-family: 'Plus Jakarta Sans', monospace; font-size: 42px; font-weight: 700; color: #1e40af; letter-spacing: 8px; margin: 20px 0; text-shadow: 0 2px 4px rgba(30,64,175,0.1);">
            ${otpCode}
          </div>
          
          <div style="display: inline-flex; align-items: center; background-color: #fef3c7; color: #d97706; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 500; margin-top: 20px;">
            <span style="margin-right: 6px;">⏱️</span>
            Expire dans 10 minutes
          </div>
        </div>
        
        ${isRegistration ? `
          <div style="background-color: #f0f9ff; border-left: 4px solid #0284c7; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: left;">
            <h4 style="color: #0c4a6e; margin-bottom: 10px; font-size: 16px;">🎯 Prochaines étapes :</h4>
            <ul style="color: #0369a1; font-size: 14px; line-height: 1.6; padding-left: 20px;">
              <li>Saisissez le code ci-dessus dans l'application</li>
              <li>Complétez votre profil utilisateur</li>
              <li>Explorez les fonctionnalités disponibles</li>
            </ul>
          </div>
        ` : ''}
        
        <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
            Si vous n'avez pas ${isRegistration ? 'créé de compte' : 'demandé de connexion'}, 
            vous pouvez ignorer cet email en toute sécurité.
          </p>
        </div>
      </div>
    `;

    return this.getBaseTemplate(content);
  }

  private getResetPasswordTemplate(resetUrl: string): string {
    const content = `
      <div style="text-align: center;">
        <div style="font-size: 48px; margin-bottom: 20px;">
          🔄
        </div>
        
        <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; color: #1e293b; font-size: 28px; font-weight: 700; margin-bottom: 10px;">
          Réinitialisation de mot de passe
        </h2>
        
        <p style="color: #475569; font-size: 18px; font-weight: 500; margin-bottom: 30px;">
          Demande de changement de mot de passe
        </p>
        
        <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin-bottom: 40px;">
          Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe sécurisé.
        </p>
        
        <div style="margin: 50px 0;">
          <a href="${resetUrl}" 
             style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; text-decoration: none; padding: 18px 40px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(59,130,246,0.3); transition: all 0.3s ease;">
            <span style="margin-right: 8px;">🔐</span>
            Réinitialiser mon mot de passe
          </a>
        </div>
        
        <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: left;">
          <h4 style="color: #dc2626; margin-bottom: 10px; font-size: 16px;">⚠️ Informations importantes :</h4>
          <ul style="color: #b91c1c; font-size: 14px; line-height: 1.6; padding-left: 20px;">
            <li>Ce lien est valide pendant <strong>1 heure seulement</strong></li>
            <li>Il ne peut être utilisé qu'une seule fois</li>
            <li>Assurez-vous de choisir un mot de passe sécurisé</li>
          </ul>
        </div>
        
        <div style="background-color: #f8fafc; border-radius: 12px; padding: 25px; margin: 30px 0;">
          <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin-bottom: 15px;">
            <strong>Lien de secours :</strong> Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
          </p>
          <div style="background-color: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; word-break: break-all;">
            <code style="font-size: 12px; color: #1e40af;">${resetUrl}</code>
          </div>
        </div>
        
        <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
            Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. 
            Votre mot de passe actuel reste inchangé et sécurisé.
          </p>
        </div>
      </div>
    `;

    return this.getBaseTemplate(content);
  }

  async sendOtpEmail(email: string, otpCode: string, type: 'registration' | 'login' = 'registration'): Promise<void> {
    try {
      const subject = type === 'registration' 
        ? '✨ Vérification de votre compte - Application Citoyenne' 
        : '🔐 Code de connexion - Application Citoyenne';

      const mailOptions = {
        from: `"Application Citoyenne" <${this.configService.get('SMTP_USER')}>`,
        to: email,
        subject,
        html: this.getOtpTemplate(otpCode, type),
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email OTP ${type} envoyé avec succès à ${email}. MessageId: ${result.messageId}`);
      
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi de l'email OTP ${type} à ${email}:`, error);
      throw new Error('Impossible d\'envoyer l\'email de vérification');
    }
  }

  async sendResetPasswordEmail(email: string, resetToken: string): Promise<void> {
    try {
      const resetUrl = `${this.configService.get('FRONTEND_URL')}/reinitialisation-mot-de-passe?token=${resetToken}`;
      
      const mailOptions = {
        from: `"Application Citoyenne" <${this.configService.get('SMTP_USER')}>`,
        to: email,
        subject: '🔄 Réinitialisation de mot de passe - Application Citoyenne',
        html: this.getResetPasswordTemplate(resetUrl),
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email de reset envoyé avec succès à ${email}`);
      
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi de l'email de reset à ${email}:`, error);
      throw new Error('Impossible d\'envoyer l\'email de réinitialisation');
    }
  }

  // Méthode optionnelle pour envoyer un email de bienvenue après validation
  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    try {
      const content = `
        <div style="text-align: center;">
          <div style="font-size: 48px; margin-bottom: 20px;">
            🎊
          </div>
          
          <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; color: #1e293b; font-size: 28px; font-weight: 700; margin-bottom: 10px;">
            Bienvenue ${firstName} !
          </h2>
          
          <p style="color: #475569; font-size: 18px; font-weight: 500; margin-bottom: 30px;">
            Votre compte a été créé avec succès
          </p>
          
          <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin-bottom: 40px;">
            Félicitations ! Votre compte Application Citoyenne est maintenant actif. 
            Vous pouvez dès maintenant profiter de toutes les fonctionnalités de notre plateforme.
          </p>
          
          <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 16px; padding: 30px; margin: 40px 0;">
            <h3 style="color: #15803d; font-size: 20px; margin-bottom: 20px;">🚀 Que faire maintenant ?</h3>
            <div style="text-align: left;">
              <div style="margin-bottom: 15px; padding: 12px; background-color: white; border-radius: 8px; border-left: 4px solid #22c55e;">
                <strong style="color: #15803d;">👤 Complétez votre profil</strong>
                <p style="color: #16a34a; font-size: 14px; margin: 5px 0 0 0;">Ajoutez vos informations pour personnaliser votre expérience</p>
              </div>
              <div style="margin-bottom: 15px; padding: 12px; background-color: white; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <strong style="color: #1d4ed8;">🏛️ Explorez les services</strong>
                <p style="color: #2563eb; font-size: 14px; margin: 5px 0 0 0;">Découvrez tous les services citoyens disponibles</p>
              </div>
              <div style="padding: 12px; background-color: white; border-radius: 8px; border-left: 4px solid #8b5cf6;">
                <strong style="color: #7c3aed;">📱 Téléchargez l'app mobile</strong>
                <p style="color: #8b5cf6; font-size: 14px; margin: 5px 0 0 0;">Accédez à vos services depuis votre smartphone</p>
              </div>
            </div>
          </div>
        </div>
      `;

      const mailOptions = {
        from: `"Application Citoyenne" <${this.configService.get('SMTP_USER')}>`,
        to: email,
        subject: '🎊 Bienvenue dans Application Citoyenne !',
        html: this.getBaseTemplate(content),
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email de bienvenue envoyé avec succès à ${email}`);
      
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi de l'email de bienvenue à ${email}:`, error);
      throw new Error('Impossible d\'envoyer l\'email de bienvenue');
    }
  }

  async sendRequestConfirmation(email: string, type: string, reference: string): Promise<void> {
  try {
    const subject = `✅ Confirmation de votre demande ${type} - Réf: ${reference}`;
    const content = `
      <div style="text-align: center;">
        <h2 style="color: #1e293b; font-size: 24px; font-weight: 700;">Votre demande a été enregistrée !</h2>
        <p style="color: #475569; font-size: 16px; margin-top: 20px;">
          Nous avons bien reçu votre demande de <strong>${type}</strong>.<br/>
          Votre numéro de référence est <strong>${reference}</strong>.
        </p>
        <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
          Vous serez notifié(e) dès que votre demande sera traitée.
        </p>
      </div>
    `;

    const mailOptions = {
      from: `"Application Citoyenne" <${this.configService.get('SMTP_USER')}>`,
      to: email,
      subject,
      html: this.getBaseTemplate(content),
    };

    await this.transporter.sendMail(mailOptions);
    this.logger.log(`Email de confirmation envoyé avec succès à ${email} pour ${type} (${reference})`);
  } catch (error) {
    this.logger.error(`Erreur lors de l'envoi de l'email de confirmation à ${email}:`, error);
    throw new Error('Impossible d\'envoyer l\'email de confirmation');
  }
}

async sendTreatmentUpdate(email: string, reference: string, status: string, message: string): Promise<void> {
  try {
    const subject = `🔔 Mise à jour de votre demande - Réf: ${reference}`;
    const content = `
      <div style="text-align: center;">
        <h2 style="color: #1e293b; font-size: 24px; font-weight: 700;">Statut mis à jour</h2>
        <p style="color: #475569; font-size: 16px; margin-top: 20px;">
          Votre demande <strong>${reference}</strong> a été mise à jour.<br/>
          Statut actuel : <strong>${status}</strong>.
        </p>
        <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
          ${message}
        </p>
      </div>
    `;

    const mailOptions = {
      from: `"Application Citoyenne" <${this.configService.get('SMTP_USER')}>`,
      to: email,
      subject,
      html: this.getBaseTemplate(content),
    };

    await this.transporter.sendMail(mailOptions);
    this.logger.log(`Email de mise à jour envoyé à ${email} pour ${reference} (${status})`);
  } catch (error) {
    this.logger.error(`Erreur lors de l'envoi de l'email de mise à jour à ${email}:`, error);
    throw new Error('Impossible d\'envoyer l\'email de mise à jour');
  }
}

async sendTreatmentFinal(email: string, reference: string, result: string, message: string): Promise<void> {
  try {
    const subject = `🏁 Traitement finalisé - Réf: ${reference}`;
    const content = `
      <div style="text-align: center;">
        <h2 style="color: #1e293b; font-size: 24px; font-weight: 700;">Votre demande a été traitée</h2>
        <p style="color: #475569; font-size: 16px; margin-top: 20px;">
          Résultat : <strong>${result}</strong><br/>
          Référence : <strong>${reference}</strong>
        </p>
        <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
          ${message}
        </p>
      </div>
    `;

    const mailOptions = {
      from: `"Application Citoyenne" <${this.configService.get('SMTP_USER')}>`,
      to: email,
      subject,
      html: this.getBaseTemplate(content),
    };

    await this.transporter.sendMail(mailOptions);
    this.logger.log(`Email final envoyé à ${email} pour ${reference} (${result})`);
  } catch (error) {
    this.logger.error(`Erreur lors de l'envoi de l'email final à ${email}:`, error);
    throw new Error('Impossible d\'envoyer l\'email final');
  }
}

async sendTreatmentNotification(email: string, type: string, result: string, message: string): Promise<void> {
  try {
    const subject = `📣 Notification de traitement - ${type}`;
    const content = `
      <div style="text-align: center;">
        <h2 style="color: #1e293b; font-size: 24px; font-weight: 700;">Notification de traitement</h2>
        <p style="color: #475569; font-size: 16px; margin-top: 20px;">
          Type : <strong>${type}</strong><br/>
          Résultat : <strong>${result}</strong>
        </p>
        <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
          ${message}
        </p>
      </div>
    `;

    const mailOptions = {
      from: `"Application Citoyenne" <${this.configService.get('SMTP_USER')}>`,
      to: email,
      subject,
      html: this.getBaseTemplate(content),
    };

    await this.transporter.sendMail(mailOptions);
    this.logger.log(`Notification de traitement envoyée à ${email} pour ${type} (${result})`);
  } catch (error) {
    this.logger.error(`Erreur lors de l'envoi de la notification de traitement à ${email}:`, error);
    throw new Error('Impossible d\'envoyer la notification de traitement');
  }
}

}

// import { Injectable, Logger } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as nodemailer from 'nodemailer';

// @Injectable()
// export class EmailService {
//   private transporter;
//   private readonly logger = new Logger(EmailService.name);

//   constructor(private configService: ConfigService) {
//     this.transporter = nodemailer.createTransport({
//       host: this.configService.get('SMTP_HOST'),
//       port: parseInt(this.configService.get('SMTP_PORT')),
//       secure: this.configService.get('SMTP_SECURE') === 'true',
//       auth: {
//         user: this.configService.get('SMTP_USER'),
//         pass: this.configService.get('SMTP_PASS'),
//       },
//       debug: true,
//       logger: true,
//     });

//     this.verifyConnection();
//   }

//   private async verifyConnection() {
//     try {
//       await this.transporter.verify();
//       this.logger.log('Connexion SMTP vérifiée avec succès');
//     } catch (error) {
//       this.logger.error('Erreur de connexion SMTP:', error);
//     }
//   }

//   private getBaseTemplate(content: string): string {
//     return `
//       <!DOCTYPE html>
//       <html lang="fr">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Application Citoyenne</title>
//         <link rel="preconnect" href="https://fonts.googleapis.com">
//         <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
//         <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
//         <style>
//           * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//           }
          
//           body {
//             font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
//             line-height: 1.7;
//             color: #1e293b;
//             background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
//             min-height: 100vh;
//           }
          
//           .email-wrapper {
//             padding: 40px 20px;
//             min-height: 100vh;
//           }
          
//           .container {
//             max-width: 600px;
//             margin: 0 auto;
//             background: #ffffff;
//             border-radius: 24px;
//             overflow: hidden;
//             box-shadow: 
//               0 20px 25px -5px rgba(0, 0, 0, 0.1),
//               0 10px 10px -5px rgba(0, 0, 0, 0.04);
//             border: 1px solid rgba(255, 255, 255, 0.1);
//           }
          
//           .header {
//             background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%);
//             padding: 50px 40px;
//             text-align: center;
//             position: relative;
//             overflow: hidden;
//           }
          
//           .header::before {
//             content: '';
//             position: absolute;
//             top: 0;
//             left: 0;
//             right: 0;
//             bottom: 0;
//             background: 
//               radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
//               radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
//               radial-gradient(circle at 40% 40%, rgba(120, 58, 237, 0.3) 0%, transparent 50%);
//             pointer-events: none;
//           }
          
//           .logo {
//             width: 80px;
//             height: 80px;
//             background: rgba(255, 255, 255, 0.15);
//             backdrop-filter: blur(10px);
//             border-radius: 20px;
//             margin: 0 auto 24px;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             position: relative;
//             z-index: 2;
//             border: 1px solid rgba(255, 255, 255, 0.2);
//           }
          
//           .logo::before {
//             content: '🏛️';
//             font-size: 36px;
//             filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
//           }
          
//           .app-name {
//             color: white;
//             font-size: 28px;
//             font-weight: 800;
//             margin: 0;
//             position: relative;
//             z-index: 2;
//             text-shadow: 0 2px 4px rgba(0,0,0,0.1);
//             letter-spacing: -0.025em;
//           }
          
//           .content {
//             padding: 50px 40px;
//             background: #ffffff;
//           }
          
//           .footer {
//             background: #f8fafc;
//             padding: 40px;
//             text-align: center;
//             border-top: 1px solid #e2e8f0;
//           }
          
//           .footer p {
//             color: #64748b;
//             font-size: 14px;
//             font-weight: 400;
//           }
          
//           .footer .copyright {
//             color: #94a3b8;
//             font-size: 13px;
//             margin-top: 12px;
//           }
          
//           /* Typography */
//           .title {
//             font-size: 32px;
//             font-weight: 700;
//             color: #0f172a;
//             margin-bottom: 16px;
//             letter-spacing: -0.025em;
//             line-height: 1.2;
//           }
          
//           .subtitle {
//             font-size: 18px;
//             font-weight: 600;
//             color: #475569;
//             margin-bottom: 32px;
//           }
          
//           .text {
//             font-size: 16px;
//             color: #64748b;
//             line-height: 1.7;
//             margin-bottom: 32px;
//           }
          
//           /* Code Box */
//           .code-container {
//             background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
//             border-radius: 20px;
//             padding: 40px;
//             margin: 40px 0;
//             border: 2px dashed #cbd5e1;
//             text-align: center;
//             position: relative;
//           }
          
//           .code-label {
//             color: #475569;
//             font-size: 12px;
//             text-transform: uppercase;
//             letter-spacing: 2px;
//             font-weight: 700;
//             margin-bottom: 20px;
//           }
          
//           .code-value {
//             font-size: 48px;
//             font-weight: 800;
//             color: #1d4ed8;
//             letter-spacing: 12px;
//             margin: 24px 0;
//             font-family: 'Plus Jakarta Sans', monospace;
//             text-shadow: 0 2px 8px rgba(29, 78, 216, 0.1);
//           }
          
//           .code-expiry {
//             display: inline-flex;
//             align-items: center;
//             background: #fef3c7;
//             color: #d97706;
//             padding: 12px 20px;
//             border-radius: 50px;
//             font-size: 14px;
//             font-weight: 600;
//             margin-top: 24px;
//             gap: 8px;
//           }
          
//           /* Button */
//           .btn {
//             display: inline-block;
//             background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
//             color: white;
//             text-decoration: none;
//             padding: 18px 36px;
//             border-radius: 16px;
//             font-weight: 700;
//             font-size: 16px;
//             box-shadow: 
//               0 10px 15px -3px rgba(59, 130, 246, 0.3),
//               0 4px 6px -2px rgba(59, 130, 246, 0.05);
//             transition: all 0.3s ease;
//             letter-spacing: 0.025em;
//           }
          
//           /* Info boxes */
//           .info-box {
//             border-radius: 16px;
//             padding: 24px;
//             margin: 32px 0;
//             border-left: 4px solid;
//           }
          
//           .info-box.success {
//             background: #f0fdf4;
//             border-color: #22c55e;
//           }
          
//           .info-box.warning {
//             background: #fef2f2;
//             border-color: #ef4444;
//           }
          
//           .info-box.info {
//             background: #f0f9ff;
//             border-color: #0284c7;
//           }
          
//           .info-box h4 {
//             font-size: 16px;
//             font-weight: 700;
//             margin-bottom: 12px;
//           }
          
//           .info-box.success h4 { color: #15803d; }
//           .info-box.warning h4 { color: #dc2626; }
//           .info-box.info h4 { color: #0c4a6e; }
          
//           .info-box ul {
//             padding-left: 20px;
//             margin: 0;
//           }
          
//           .info-box li {
//             font-size: 14px;
//             line-height: 1.6;
//             margin-bottom: 8px;
//           }
          
//           .info-box.success li { color: #16a34a; }
//           .info-box.warning li { color: #b91c1c; }
//           .info-box.info li { color: #0369a1; }
          
//           /* Feature cards */
//           .feature-grid {
//             margin: 32px 0;
//           }
          
//           .feature-card {
//             background: white;
//             border-radius: 12px;
//             padding: 20px;
//             margin-bottom: 16px;
//             border-left: 4px solid;
//             box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
//           }
          
//           .feature-card.primary { border-color: #22c55e; }
//           .feature-card.secondary { border-color: #3b82f6; }
//           .feature-card.tertiary { border-color: #8b5cf6; }
          
//           .feature-card strong {
//             font-size: 15px;
//             font-weight: 700;
//             display: block;
//             margin-bottom: 6px;
//           }
          
//           .feature-card p {
//             font-size: 14px;
//             margin: 0;
//             opacity: 0.8;
//           }
          
//           .feature-card.primary strong { color: #15803d; }
//           .feature-card.primary p { color: #16a34a; }
//           .feature-card.secondary strong { color: #1d4ed8; }
//           .feature-card.secondary p { color: #2563eb; }
//           .feature-card.tertiary strong { color: #7c3aed; }
//           .feature-card.tertiary p { color: #8b5cf6; }
          
//           /* URL box */
//           .url-box {
//             background: #f8fafc;
//             border-radius: 12px;
//             padding: 24px;
//             margin: 24px 0;
//             text-align: left;
//           }
          
//           .url-box p {
//             color: #64748b;
//             font-size: 14px;
//             margin-bottom: 16px;
//           }
          
//           .url-container {
//             background: white;
//             padding: 16px;
//             border-radius: 8px;
//             border: 1px solid #e2e8f0;
//             word-break: break-all;
//           }
          
//           .url-container code {
//             font-size: 12px;
//             color: #1e40af;
//             font-family: 'Plus Jakarta Sans', monospace;
//           }
          
//           /* Responsive */
//           @media (max-width: 600px) {
//             .email-wrapper {
//               padding: 20px 10px;
//             }
            
//             .container {
//               border-radius: 16px;
//             }
            
//             .header {
//               padding: 40px 24px;
//             }
            
//             .content {
//               padding: 40px 24px;
//             }
            
//             .footer {
//               padding: 32px 24px;
//             }
            
//             .title {
//               font-size: 24px;
//             }
            
//             .code-value {
//               font-size: 36px;
//               letter-spacing: 8px;
//             }
            
//             .btn {
//               padding: 16px 28px;
//               font-size: 15px;
//             }
//           }
//         </style>
//       </head>
//       <body>
//         <div class="email-wrapper">
//           <div class="container">
//             <div class="header">
//               <div class="logo"></div>
//               <h1 class="app-name">Application Citoyenne</h1>
//             </div>
//             <div class="content">
//               ${content}
//             </div>
//             <div class="footer">
//               <p>Cet email a été envoyé automatiquement, merci de ne pas répondre.</p>
//               <p class="copyright">© 2024 Application Citoyenne. Tous droits réservés.</p>
//             </div>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
//   }

//   private getOtpTemplate(otpCode: string, type: 'registration' | 'login'): string {
//     const isRegistration = type === 'registration';
//     const title = isRegistration ? 'Bienvenue !' : 'Connexion sécurisée';
//     const subtitle = isRegistration ? 'Vérifiez votre compte' : 'Votre code d\'accès';
//     const emoji = isRegistration ? '🎉' : '🔑';
//     const message = isRegistration
//       ? 'Merci pour votre inscription ! Saisissez ce code pour finaliser la création de votre compte et commencer à utiliser nos services.'
//       : 'Voici votre code de connexion sécurisée. Saisissez-le dans l\'application pour accéder à votre compte en toute sécurité.';

//     const content = `
//       <div style="text-align: center;">
//         <div style="font-size: 64px; margin-bottom: 24px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));">
//           ${emoji}
//         </div>
        
//         <h2 class="title">${title}</h2>
//         <p class="subtitle">${subtitle}</p>
//         <p class="text">${message}</p>
        
//         <div class="code-container">
//           <p class="code-label">Code de vérification</p>
//           <div class="code-value">${otpCode}</div>
//           <div class="code-expiry">
//             <span>⏱️</span>
//             Expire dans 10 minutes
//           </div>
//         </div>
        
//         ${isRegistration ? `
//           <div class="info-box success">
//             <h4>🎯 Prochaines étapes</h4>
//             <ul>
//               <li>Saisissez le code ci-dessus dans l'application</li>
//               <li>Complétez votre profil utilisateur</li>
//               <li>Découvrez toutes les fonctionnalités disponibles</li>
//             </ul>
//           </div>
//         ` : ''}
        
//         <div style="margin-top: 48px; padding-top: 32px; border-top: 1px solid #e2e8f0;">
//           <p style="color: #94a3b8; font-size: 14px;">
//             Si vous n'avez pas ${isRegistration ? 'créé de compte' : 'demandé cette connexion'}, 
//             vous pouvez ignorer cet email en toute sécurité.
//           </p>
//         </div>
//       </div>
//     `;

//     return this.getBaseTemplate(content);
//   }

//   private getResetPasswordTemplate(resetUrl: string): string {
//     const content = `
//       <div style="text-align: center;">
//         <div style="font-size: 64px; margin-bottom: 24px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));">
//           🔄
//         </div>
        
//         <h2 class="title">Réinitialisation du mot de passe</h2>
//         <p class="subtitle">Créez un nouveau mot de passe sécurisé</p>
//         <p class="text">
//           Vous avez demandé la réinitialisation de votre mot de passe. 
//           Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe.
//         </p>
        
//         <div style="margin: 48px 0;">
//           <a href="${resetUrl}" class="btn">
//             <span style="margin-right: 8px;">🔐</span>
//             Réinitialiser mon mot de passe
//           </a>
//         </div>
        
//         <div class="info-box warning">
//           <h4>⚠️ Informations importantes</h4>
//           <ul>
//             <li>Ce lien est valide pendant <strong>1 heure seulement</strong></li>
//             <li>Il ne peut être utilisé qu'une seule fois</li>
//             <li>Choisissez un mot de passe fort et unique</li>
//           </ul>
//         </div>
        
//         <div class="url-box">
//           <p><strong>Lien de secours :</strong> Si le bouton ne fonctionne pas, copiez ce lien :</p>
//           <div class="url-container">
//             <code>${resetUrl}</code>
//           </div>
//         </div>
        
//         <div style="margin-top: 48px; padding-top: 32px; border-top: 1px solid #e2e8f0;">
//           <p style="color: #94a3b8; font-size: 14px;">
//             Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. 
//             Votre mot de passe actuel reste sécurisé.
//           </p>
//         </div>
//       </div>
//     `;

//     return this.getBaseTemplate(content);
//   }

//   private getWelcomeTemplate(firstName: string): string {
//     const content = `
//       <div style="text-align: center;">
//         <div style="font-size: 64px; margin-bottom: 24px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));">
//           🎊
//         </div>
        
//         <h2 class="title">Bienvenue ${firstName} !</h2>
//         <p class="subtitle">Votre compte est maintenant actif</p>
//         <p class="text">
//           Félicitations ! Votre compte Application Citoyenne est prêt. 
//           Vous pouvez maintenant accéder à tous nos services citoyens en ligne.
//         </p>
        
//         <div class="info-box success">
//           <h4>🚀 Découvrez vos possibilités</h4>
//           <div class="feature-grid">
//             <div class="feature-card primary">
//               <strong>👤 Personnalisez votre profil</strong>
//               <p>Complétez vos informations pour une expérience sur-mesure</p>
//             </div>
//             <div class="feature-card secondary">
//               <strong>🏛️ Explorez les services</strong>
//               <p>Accédez à tous les services publics disponibles</p>
//             </div>
//             <div class="feature-card tertiary">
//               <strong>📱 Application mobile</strong>
//               <p>Téléchargez l'app pour un accès nomade à vos services</p>
//             </div>
//           </div>
//         </div>
        
//         <div style="margin-top: 48px;">
//           <p style="color: #475569; font-size: 16px; font-weight: 600;">
//             Prêt(e) à commencer ? Connectez-vous dès maintenant !
//           </p>
//         </div>
//       </div>
//     `;

//     return this.getBaseTemplate(content);
//   }

//   // Méthodes d'envoi d'emails

//   async sendOtpEmail(email: string, otpCode: string, type: 'registration' | 'login' = 'registration'): Promise<void> {
//     try {
//       const subject = type === 'registration' 
//         ? '✨ Code de vérification - Application Citoyenne' 
//         : '🔐 Code de connexion - Application Citoyenne';

//       const mailOptions = {
//         from: `"Application Citoyenne" <${this.configService.get('SMTP_USER')}>`,
//         to: email,
//         subject,
//         html: this.getOtpTemplate(otpCode, type),
//       };

//       const result = await this.transporter.sendMail(mailOptions);
//       this.logger.log(`Email OTP ${type} envoyé avec succès à ${email}. MessageId: ${result.messageId}`);
      
//     } catch (error) {
//       this.logger.error(`Erreur lors de l'envoi de l'email OTP ${type} à ${email}:`, error);
//       throw new Error('Impossible d\'envoyer l\'email de vérification');
//     }
//   }

//   async sendResetPasswordEmail(email: string, resetToken: string): Promise<void> {
//     try {
//       const resetUrl = `${this.configService.get('FRONTEND_URL')}/reinitialisation-mot-de-passe?token=${resetToken}`;
      
//       const mailOptions = {
//         from: `"Application Citoyenne" <${this.configService.get('SMTP_USER')}>`,
//         to: email,
//         subject: '🔄 Réinitialisation de mot de passe - Application Citoyenne',
//         html: this.getResetPasswordTemplate(resetUrl),
//       };

//       await this.transporter.sendMail(mailOptions);
//       this.logger.log(`Email de reset envoyé avec succès à ${email}`);
      
//     } catch (error) {
//       this.logger.error(`Erreur lors de l'envoi de l'email de reset à ${email}:`, error);
//       throw new Error('Impossible d\'envoyer l\'email de réinitialisation');
//     }
//   }

//   async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
//     try {
//       const mailOptions = {
//         from: `"Application Citoyenne" <${this.configService.get('SMTP_USER')}>`,
//         to: email,
//         subject: '🎊 Bienvenue dans Application Citoyenne !',
//         html: this.getWelcomeTemplate(firstName),
//       };

//       await this.transporter.sendMail(mailOptions);
//       this.logger.log(`Email de bienvenue envoyé avec succès à ${email}`);
      
//     } catch (error) {
//       this.logger.error(`Erreur lors de l'envoi de l'email de bienvenue à ${email}:`, error);
//       throw new Error('Impossible d\'envoyer l\'email de bienvenue');
//     }
//   }

//   async sendRequestConfirmation(email: string, type: string, reference: string): Promise<void> {
//     try {
//       const content = `
//         <div style="text-align: center;">
//           <div style="font-size: 64px; margin-bottom: 24px;">✅</div>
          
//           <h2 class="title">Demande enregistrée</h2>
//           <p class="subtitle">Référence: ${reference}</p>
//           <p class="text">
//             Nous avons bien reçu votre demande de <strong>${type}</strong>.<br>
//             Vous recevrez une notification dès que celle-ci sera traitée.
//           </p>
          
//           <div class="info-box info">
//             <h4>📋 Détails de votre demande</h4>
//             <ul>
//               <li>Type : <strong>${type}</strong></li>
//               <li>Référence : <strong>${reference}</strong></li>
//               <li>Statut : En attente de traitement</li>
//             </ul>
//           </div>
//         </div>
//       `;

//       const mailOptions = {
//         from: `"Application Citoyenne" <${this.configService.get('SMTP_USER')}>`,
//         to: email,
//         subject: `✅ Confirmation - ${type} - Réf: ${reference}`,
//         html: this.getBaseTemplate(content),
//       };

//       await this.transporter.sendMail(mailOptions);
//       this.logger.log(`Email de confirmation envoyé avec succès à ${email} pour ${type} (${reference})`);
//     } catch (error) {
//       this.logger.error(`Erreur lors de l'envoi de l'email de confirmation à ${email}:`, error);
//       throw new Error('Impossible d\'envoyer l\'email de confirmation');
//     }
//   }

//   async sendTreatmentUpdate(email: string, reference: string, status: string, message: string): Promise<void> {
//     try {
//       const content = `
//         <div style="text-align: center;">
//           <div style="font-size: 64px; margin-bottom: 24px;">🔔</div>
          
//           <h2 class="title">Mise à jour de votre demande</h2>
//           <p class="subtitle">Référence: ${reference}</p>
//           <p class="text">Le statut de votre demande a été mis à jour.</p>
          
//           <div class="info-box info">
//             <h4>📊 Nouveau statut</h4>
//             <ul>
//               <li>Référence : <strong>${reference}</strong></li>
//               <li>Statut actuel : <strong>${status}</strong></li>
//             </ul>
//           </div>
          
//           ${message ? `
//             <div style="background: #f8fafc; padding: 24px; border-radius: 12px; margin: 24px 0; text-align: left;">
//               <p style="color: #475569; font-size: 15px; margin: 0;">${message}</p>
//             </div>
//           ` : ''}
//         </div>
//       `;

//       const mailOptions = {
//         from: `"Application Citoyenne" <${this.configService.get('SMTP_USER')}>`,
//         to: email,
//         subject: `🔔 Mise à jour - Réf: ${reference}`,
//         html: this.getBaseTemplate(content),
//       };

//       await this.transporter.sendMail(mailOptions);
//       this.logger.log(`Email de mise à jour envoyé à ${email} pour ${reference} (${status})`);
//     } catch (error) {
//       this.logger.error(`Erreur lors de l'envoi de l'email de mise à jour à ${email}:`, error);
//       throw new Error('Impossible d\'envoyer l\'email de mise à jour');
//     }
//   }

//   async sendTreatmentFinal(email: string, reference: string, result: string, message: string): Promise<void> {
//     try {
//       const isSuccess = result.toLowerCase().includes('approuvé') || result.toLowerCase().includes('accepté');
//       const emoji = isSuccess ? '✅' : '❌';
//       const boxClass = isSuccess ? 'success' : 'warning';

//       const content = `
//         <div style="text-align: center;">
//           <div style="font-size: 64px; margin-bottom: 24px;">${emoji}</div>
          
//           <h2 class="title">Traitement terminé</h2>
//           <p class="subtitle">Référence: ${reference}</p>
//           <p class="text">Votre demande a été entièrement traitée.</p>
          
//           <div class="info-box ${boxClass}">
//             <h4>🏁 Résultat final</h4>
//             <ul>
//               <li>Référence : <strong>${reference}</strong></li>
//               <li>Résultat : <strong>${result}</strong></li>
//             </ul>
//           </div>
          
//           ${message ? `
//             <div style="background: #f8fafc; padding: 24px; border-radius: 12px; margin: 24px 0; text-align: left;">
//               <p style="color: #475569; font-size: 15px; margin: 0;">${message}</p>
//             </div>
//           ` : ''}
//         </div>
//       `;

//       const mailOptions = {
//         from: `"Application Citoyenne" <${this.configService.get('SMTP_USER')}>`,
//         to: email,
//         subject: `🏁 Traitement finalisé - Réf: ${reference}`,
//         html: this.getBaseTemplate(content),
//       };

//       await this.transporter.sendMail(mailOptions);
//       this.logger.log(`Email final envoyé à ${email} pour ${reference} (${result})`);
//     } catch (error) {
//       this.logger.error(`Erreur lors de l'envoi de l'email final à ${email}:`, error);
//       throw new Error('Impossible d\'envoyer l\'email final');
//     }
//   }

//   async sendTreatmentNotification(email: string, type: string, result: string, message: string): Promise<void> {
//     try {
//       const content = `
//         <div style="text-align: center;">
//           <div style="font-size: 64px; margin-bottom: 24px;">📣</div>
          
//           <h2 class="title">Notification importante</h2>
//           <p class="subtitle">${type}</p>
//           <p class="text">Nous avons une mise à jour concernant votre dossier.</p>
          
//           <div class="info-box info">
//             <h4>ℹ️ Détails de la notification</h4>
//             <ul>
//               <li>Type : <strong>${type}</strong></li>
//               <li>Résultat : <strong>${result}</strong></li>
//             </ul>
//           </div>
          
//           ${message ? `
//             <div style="background: #f8fafc; padding: 24px; border-radius: 12px; margin: 24px 0; text-align: left;">
//               <p style="color: #475569; font-size: 15px; margin: 0;">${message}</p>
//             </div>
//           ` : ''}
//         </div>
//       `;

//       const mailOptions = {
//         from: `"Application Citoyenne" <${this.configService.get('SMTP_USER')}>`,
//         to: email,
//         subject: `📣 Notification - ${type}`,
//         html: this.getBaseTemplate(content),
//       };

//       await this.transporter.sendMail(mailOptions);
//       this.logger.log(`Notification de traitement envoyée à ${email} pour ${type} (${result})`);
//     } catch (error) {
//       this.logger.error(`Erreur lors de l'envoi de la notification de traitement à ${email}:`, error);
//       throw new Error('Impossible d\'envoyer la notification de traitement');
//     }
//   }
// }