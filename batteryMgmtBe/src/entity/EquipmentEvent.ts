import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity()
export class EquipmentEvent {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  equipmentId: string; // PowerEquipment equipmentId

  @Column()
  eventType: string; // created | checked-in | checked-out

  @Column({ nullable: true })
  zoneId: string;

  @Column({ nullable: true })
  zoneName: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  checkoutReason: string;

  @Column({ nullable: true })
  performedBy: string;

  @Column()
  createdAt: Date;
}
