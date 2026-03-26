import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity()
export class Location {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  name: string; // Reference to DropDownMaster option key

  @Column()
  type: string; // Reference to DropDownMaster option key

  @Column()
  city: string; // Reference to DropDownMaster option key

  @Column()
  state: string; // Reference to DropDownMaster option key

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  constructor(locationData?: Partial<Location>) {
    if (locationData) {
      Object.assign(this, locationData);
    }
  }
}
