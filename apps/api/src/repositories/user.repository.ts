import type { User } from "@pmmodern/shared-types";
import { users } from "../db/mock-data.js";
import type { UserEntity } from "../domain/entities/user.entity.js";

function toUser(entity: UserEntity): User {
  return {
    id: entity.id,
    name: entity.name,
    email: entity.email
  };
}

export class UserRepository {
  findByEmail(email: string): UserEntity | undefined {
    const normalized = email.toLowerCase();
    return users.find((user) => user.email.toLowerCase() === normalized);
  }

  findById(id: string): UserEntity | undefined {
    return users.find((user) => user.id === id);
  }

  create(input: { name: string; email: string; passwordHash: string }): UserEntity {
    const entity: UserEntity = {
      id: `usr-${Date.now()}`,
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash: input.passwordHash,
      createdAt: new Date().toISOString()
    };
    users.push(entity);
    return entity;
  }

  toPublicUser(entity: UserEntity): User {
    return toUser(entity);
  }
}
