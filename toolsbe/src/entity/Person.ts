import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity()
export class Person {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  name: string;

  @Column()
  designation: string; // Reference to DropDownMaster option key

  @Column({ unique: true })
  email: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  immediateBoss: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  constructor(personData?: Partial<Person>) {
    if (personData) {
      Object.assign(this, personData);
    }
  }
}
