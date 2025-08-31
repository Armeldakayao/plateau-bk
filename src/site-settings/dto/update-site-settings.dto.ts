import { PartialType } from '@nestjs/mapped-types';
import { CreateSiteSettingsDto } from './create-site-settings.dto';

export class UpdateSiteSettingsDto extends PartialType(CreateSiteSettingsDto) {}
