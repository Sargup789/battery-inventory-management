import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity()
export class Zone {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  name: string;

  @Column({ nullable: true })
  identifier: string;

  @Column({ nullable: true })
  locationType: string; // Reference to DropDownMaster option key

  @Column({ nullable: true })
  city: string; // Reference to DropDownMaster option key

  @Column({ nullable: true })
  state: string; // Reference to DropDownMaster option key

  @Column({ nullable: true })
  parentZoneId: string; // For sub-zones

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  constructor(zoneData?: Partial<Zone>) {
    if (zoneData) {
      Object.assign(this, zoneData);
    }
  }
}
