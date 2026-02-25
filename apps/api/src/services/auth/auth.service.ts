import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import type { AuthResponse } from "@pmmodern/shared-types";
import { env } from "../../config/env.js";
import { UserRepository } from "../../repositories/user.repository.js";

const userRepository = new UserRepository();

export class AuthService {
  async register(input: { name: string; email: string; password: string }): Promise<AuthResponse> {
    const existing = userRepository.findByEmail(input.email);
    if (existing) {
      throw new Error("Email already exists");
    }

    const passwordHash = await hash(input.password, 10);
    const user = userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash
    });

    const publicUser = userRepository.toPublicUser(user);
    return {
      user: publicUser,
      accessToken: this.signToken(publicUser.id)
    };
  }

  async login(input: { email: string; password: string }): Promise<AuthResponse> {
    const user = userRepository.findByEmail(input.email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const matched = await compare(input.password, user.passwordHash);
    if (!matched) {
      throw new Error("Invalid credentials");
    }

    const publicUser = userRepository.toPublicUser(user);
    return {
      user: publicUser,
      accessToken: this.signToken(publicUser.id)
    };
  }

  verifyToken(token: string) {
    return jwt.verify(token, env.jwtSecret) as { userId: string };
  }

  private signToken(userId: string) {
    return jwt.sign({ userId }, env.jwtSecret, {
      expiresIn: env.jwtExpiry
    });
  }
}
