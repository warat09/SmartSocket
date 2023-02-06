import { Entity, PrimaryColumn, Column } from "typeorm"

@Entity()
export class Rfid {

    @PrimaryColumn()
    rfid_address : string

    @Column()
    date_rfid: Date

    @Column()
    status_rfid: string

}
