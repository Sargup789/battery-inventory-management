import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity()
export class QRCode {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  code: string;

  @Column({ default: false })
  inUse: boolean;

  @Column()
  createdAt: Date;
}
