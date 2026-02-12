// entity/User.ts

import bcrypt from "bcrypt";
import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

export enum UserRole {
  Viewer = "viewer",
  Editor = "editor",
  Administrator = "administrator",
}

@Entity()
export class User {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: UserRole.Administrator })
  role: UserRole;

  @Column({ default: "toyota" })
  allowedApplication: string;

  async validatePassword(unencryptedPassword: string): Promise<boolean> {
    return bcrypt.compare(unencryptedPassword, this.password);
  }

  constructor(userData?: Partial<User>) {
    if (userData) {
      Object.assign(this, userData);
    }
  }
}
