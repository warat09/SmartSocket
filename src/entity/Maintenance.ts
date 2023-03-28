import { Entity, PrimaryGeneratedColumn, Column , ManyToOne , JoinColumn} from "typeorm"
import { Assets } from "./Asset"

@Entity()
export class Maintenance_Assets{

    @PrimaryGeneratedColumn('increment')
    id_maintenance : number

    @ManyToOne(() => Assets, (Assets) => Assets.id_assets)
    @JoinColumn({ name: 'id_assets' })
    id_assets: Assets

    @Column()
    date_maintenance:Date

    @Column()
    status_maintenance: string
}
