import { IInvitesRepository } from '@/repositories/invites/IInvitesRepository'
import { IUsersRepository } from '@/repositories/users/IUsersRepository'
import { User, UserType } from '@prisma/client'
import { hash } from 'bcryptjs'
import { isBefore } from 'date-fns'
import { EmailAlreadyInUseError } from './errors/EmailAlreadyInUseError'
import { ExpiredInviteError } from './errors/ExpiredInviteError'
import { InvalidInviteError } from './errors/InvalidInviteError'
import { InvalidPhoneNumberError } from './errors/InvalidPhoneNumberError'
import { PasswordLengthError } from './errors/PasswordLengthError'

interface CreateNewUserRequest {
  name: string
  email: string
  password: string
  phone?: string
  inviteId?: string
}

interface CreateNewUserResponse {
  user: User
}

export class CreateNewUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private invitesRepository: IInvitesRepository,
  ) {}

  async execute({
    name,
    email,
    password,
    phone,
    inviteId,
  }: CreateNewUserRequest): Promise<CreateNewUserResponse> {
    let invite
    if (inviteId) {
      invite = await this.invitesRepository.findById(`${inviteId}`)
      if (!invite) throw new InvalidInviteError()
      if (invite.dueDate && isBefore(invite.dueDate, new Date()))
        throw new ExpiredInviteError()
    }

    const userWithSameEmail = await this.usersRepository.findByEmail(email)
    if (userWithSameEmail) {
      throw new EmailAlreadyInUseError()
    }

    if (password.length < 6) throw new PasswordLengthError()
    const passwordHash = await hash(password, 6)

    let cleanedPhone = null
    if (phone) {
      // cleanedPhone = phone.match(/(\d+)/g);
      cleanedPhone = phone.replace(/[^0-9]/g, '')
      if (cleanedPhone.length !== 11) throw new InvalidPhoneNumberError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      passwordHash,
      phone: cleanedPhone,
      userType: inviteId ? UserType.USER : UserType.ORGANIZATION,
      partOfOrganization: invite
        ? {
            connect: {
              id: invite?.organizationId,
            },
          }
        : undefined,
    })
    return { user }
  }
}
