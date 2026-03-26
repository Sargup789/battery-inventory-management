import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity()
export class DropdownMaster {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ nullable: false })
  dropdownName: string;

  @Column({ nullable: false })
  dropdownLabel: string;

  @Column((type) => DropdownOption)
  options: DropdownOption[];

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}

export class DropdownOption {
  @Column()
  key: string;

  @Column()
  label: string;
}
