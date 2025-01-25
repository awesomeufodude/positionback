import {prisma} from '../config/database'
import type { Prisma } from '@prisma/client'

export default class UserRepository {
  private readonly prisma
  constructor() {
    this.prisma = prisma
  }
  async getAll() {
    return await this.prisma.user.findMany()
  }
  async getById(id: string) {
    return await this.prisma.user.findUnique({ where: { id } })
  }
  async getByKey(key: keyof Prisma.UserWhereInput, value: Prisma.UserWhereInput[keyof Prisma.UserWhereInput]) {
    return await this.prisma.user.findFirst({ where: { [key]: value } })
  }

  async create(data: Prisma.UserCreateInput) {
    return await this.prisma.user.create({ data })
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return await this.prisma.user.update({ where: { id }, data })
  }
  async delete(id: string) {
    return await this.prisma.user.delete({ where: { id } })
  }
}
