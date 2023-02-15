import { Entity, PrimaryGeneratedColumn, Column , OneToOne , JoinColumn} from "typeorm"
import { Rfid } from "./Rfid"

@Entity()
export class Assets{

    @PrimaryGeneratedColumn('increment')
    id_assets : string

    @OneToOne(() => Rfid, (Rfid) => Rfid.rfid_address)
    @JoinColumn({ name: 'rfid_address' })
    rfid_address: Rfid

    @Column()
    name_assets: string

    @Column("timestamp")
    date_assets: Date

    @Column()
    expire_hour: number

    @Column()
    maintenance: boolean

    @Column()
    status_assets: string

}
