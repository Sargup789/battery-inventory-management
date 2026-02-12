import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

export enum ToolStatus {
  Created = "created",
  Assigned = "assigned",
  CheckedIn = "checked-in",
  InTransit = "in-transit",
}

@Entity()
export class Tool {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ nullable: true })
  qrCodeId: string;

  @Column({ unique: true })
  toolId: string; // 6 character alphanumeric string

  @Column()
  partNumber: string;

  @Column()
  toolName: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  toolDescription: string;

  @Column()
  supplier: string; // Reference to DropDownMaster option key

  @Column({ default: ToolStatus.Created })
  status: ToolStatus;

  @Column({ nullable: true })
  assignedLocationId: string; // ObjectId as string

  @Column({ nullable: true })
  assignedPersonId: string; // ObjectId as string

  @Column({ nullable: true })
  assignedLocation: string;

  @Column({ nullable: true })
  assignedPerson: string;

  @Column({ nullable: true })
  zoneId: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  isRetailReady: boolean;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  constructor(toolData?: Partial<Tool>) {
    if (toolData) {
      Object.assign(this, toolData);
    }
  }
}
