import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteSettings } from './entities/site-settings.entity';
import { CreateSiteSettingsDto } from './dto/create-site-settings.dto';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';


@Injectable()
export class SiteSettingsService {
  constructor(
    @InjectRepository(SiteSettings)
    private siteSettingsRepository: Repository<SiteSettings>,
  ) {}

  async create(createSiteSettingsDto: CreateSiteSettingsDto) {
    const settings = this.siteSettingsRepository.create(createSiteSettingsDto);
    return this.siteSettingsRepository.save(settings);
  }

  async findAll() {
    return this.siteSettingsRepository.find({
      order: { updatedAt: 'DESC' }
    });
  }

 async findCurrent() {
  let settings = await this.siteSettingsRepository.find({
    order: { updatedAt: 'DESC' },
    take: 1,
  });

  if (!settings || settings.length === 0) {
    return this.createDefaultSettings();
  }

  return settings[0];
}

  async findOne(id: string) {
    const settings = await this.siteSettingsRepository.findOne({
      where: { id }
    });

    if (!settings) {
      throw new NotFoundException('Paramètres non trouvés');
    }

    return settings;
  }

  async update(id: string, updateSiteSettingsDto: UpdateSiteSettingsDto) {
    const settings = await this.findOne(id);
    Object.assign(settings, updateSiteSettingsDto);
    return this.siteSettingsRepository.save(settings);
  }

  async updateCurrent(updateSiteSettingsDto: UpdateSiteSettingsDto) {
    const currentSettings = await this.findCurrent();
    return this.update(currentSettings.id, updateSiteSettingsDto);
  }

  async remove(id: string) {
    const settings = await this.findOne(id);
    return this.siteSettingsRepository.remove(settings);
  }

  async getPublicSettings() {
    const settings = await this.findCurrent();
    
    // Retourner uniquement les informations publiques
    return {
      siteName: settings.siteName,
      logo: settings.logo,
      favicon: settings.favicon,
      primaryColor: settings.primaryColor,
      secondaryColor: settings.secondaryColor,
      phone: settings.phone,
      email: settings.email,
      address: settings.address,
      city: settings.city,
      country: settings.country,
      website: settings.website,
      facebook: settings.facebook,
      twitter: settings.twitter,
      instagram: settings.instagram,
      linkedin: settings.linkedin,
      youtube: settings.youtube,
      description: settings.description,
      welcomeMessage: settings.welcomeMessage,
      footerText: settings.footerText,
      businessHours: settings.businessHours,
      emergencyContacts: settings.emergencyContacts,
      importantLinks: settings.importantLinks,
      defaultLanguage: settings.defaultLanguage,
      supportedLanguages: settings.supportedLanguages,
      allowRegistration: settings.allowRegistration,
      maintenanceMode: settings.maintenanceMode,
      maintenanceMessage: settings.maintenanceMessage,
    };
  }

  private async createDefaultSettings(): Promise<SiteSettings> {
    const defaultSettings = this.siteSettingsRepository.create({
      siteName: 'Application Citoyenne',
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      description: 'Plateforme numérique pour les services citoyens',
      welcomeMessage: 'Bienvenue sur notre plateforme citoyenne',
      footerText: '© 2025 Application Citoyenne. Tous droits réservés.',
      businessHours: {
        monday: { open: '08:00', close: '17:00', isOpen: true },
        tuesday: { open: '08:00', close: '17:00', isOpen: true },
        wednesday: { open: '08:00', close: '17:00', isOpen: true },
        thursday: { open: '08:00', close: '17:00', isOpen: true },
        friday: { open: '08:00', close: '17:00', isOpen: true },
        saturday: { open: '09:00', close: '13:00', isOpen: true },
        sunday: { open: '00:00', close: '00:00', isOpen: false },
      },
      defaultLanguage: 'fr',
      supportedLanguages: [],
      timezone: 'Africa/Porto-Novo',
      currency: 'XOF',
      allowRegistration: true,
      requireEmailVerification: true,
      emergencyContacts: [
        {
          name: 'Police',
          phone: '117',
          service: 'Urgences Police',
          available24h: true,
        },
        {
          name: 'Pompiers',
          phone: '118',
          service: 'Urgences Incendie',
          available24h: true,
        },
        {
          name: 'SAMU',
          phone: '119',
          service: 'Urgences Médicales',
          available24h: true,
        },
      ],
      importantLinks: [
        {
          title: 'Portail National',
          url: 'https://gouvernement.bj',
          description: 'Site officiel du gouvernement',
          icon: 'globe',
        },
        {
          title: 'Services en ligne',
          url: 'https://services.bj',
          description: 'Plateforme des services numériques',
          icon: 'monitor',
        },
      ],
    });

    return this.siteSettingsRepository.save(defaultSettings);
  }
}