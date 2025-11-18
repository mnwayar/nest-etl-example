import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ListAllContactsUseCase } from '@core/application/contacts/usecases/list-all-contacts.usecase';
import { GetContactDetailsUseCase } from '@core/application/contacts/usecases/get-contact-details.usecase';
import { ContactListResponseDto } from '../dtos/contacts/contact-list.response.dto';
import { ContactResponseDto } from '../dtos/contacts/contact.response.dto';

@ApiTags('Contacts')
@Controller('contacts')
export class ContactsController {
  constructor(
    private readonly listContacts: ListAllContactsUseCase,
    private readonly getContactDetails: GetContactDetailsUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ContactListResponseDto, isArray: true })
  async getAll() {
    const contacts = await this.listContacts.execute();
    return contacts.map((c) => ContactListResponseDto.fromDomain(c));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ContactResponseDto })
  async findOne(@Param('id') id: string) {
    const contact = await this.getContactDetails.execute(id);

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return ContactResponseDto.fromDomain(contact);
  }
}
