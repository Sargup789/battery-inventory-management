import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

export enum EquipmentStatus {
  Created = "created",
  CheckedIn = "checked-in",
}

@Entity()
export class PowerEquipment {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ nullable: true })
  qrCodeId: string;

  @Column({ unique: true })
  equipmentId: string; // 6 character alphanumeric string

  @Column({ nullable: true })
  itemType: string; // Reference to DropDownMaster

  @Column({ nullable: true })
  manufacturer: string; // Reference to DropDownMaster

  @Column({ nullable: true })
  modelNumber: string;

  @Column({ nullable: true })
  serialNumber: string;

  @Column({ nullable: true })
  voltage: string;

  @Column({ nullable: true })
  ampHours: string;

  @Column({ default: EquipmentStatus.Created })
  status: string; // created | checked-in | <checkoutReason>

  @Column({ nullable: true })
  dateOfArrival: Date;

  @Column({ nullable: true })
  assignationType: string; // Reference to DropDownMaster

  @Column({ nullable: true })
  assignedTo: string;

  @Column({ nullable: true })
  truckModelNumber: string;

  @Column({ nullable: true })
  truckSerialNumber: string;

  @Column({ nullable: true })
  inboundDocumentType: string; // Reference to DropDownMaster

  @Column({ nullable: true })
  inboundDocumentNumber: string;

  @Column({ nullable: true })
  orderEntryNumber: string;

  @Column({ nullable: true })
  outboundDocumentType: string; // Reference to DropDownMaster

  @Column({ nullable: true })
  outboundDocumentNumber: string;

  @Column({ nullable: true })
  customerName: string;

  @Column({ nullable: true })
  zoneId: string; // Zone ObjectId as string

  @Column({ nullable: true })
  zoneName: string;

  @Column({ nullable: true })
  zoneLocationType: string;

  @Column({ nullable: true })
  zoneCity: string;

  @Column({ nullable: true })
  zoneState: string;

  @Column({ nullable: true })
  location: string; // optional sub-location within zone

  @Column({ nullable: true })
  checkoutReason: string; // set when checked out

  @Column({ nullable: true })
  lastUpdatedBy: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  constructor(data?: Partial<PowerEquipment>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
