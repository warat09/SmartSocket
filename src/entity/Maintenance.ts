import { Entity, PrimaryGeneratedColumn, Column , OneToOne , JoinColumn} from "typeorm"
import { Assets } from "./Asset"

@Entity()
export class Maintenance_Assets{

    @PrimaryGeneratedColumn('increment')
    id_maintenance : number

    @OneToOne(() => Assets, (Assets) => Assets.id_assets)
    @JoinColumn({ name: 'id_assets' })
    id_assets: Assets

    @Column()
    date_maintenance:Date

}
