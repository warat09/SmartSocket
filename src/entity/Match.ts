import { Entity, PrimaryGeneratedColumn, Column ,OneToOne, JoinColumn } from "typeorm"
import { Assets } from "./Asset"
import { Node } from "./Node"

@Entity()
export class Match{

    @PrimaryGeneratedColumn('increment')
    id_match : number

    @OneToOne(() => Assets, (Assets) => Assets.id_assets)
    @JoinColumn({ name: 'id_assets' })
    id_assets: Assets

    @OneToOne(() => Node, (Node) => Node.mac_address)
    @JoinColumn({ name: 'mac_address' })
    mac_address: Node

    @Column({type: 'bigint'})
    remain_time: number

    @Column()
    active_datetime: Date

    @Column()
    room:string

    @Column()
    floor:string

    @Column()
    status_rent: string

    @Column()
    status: string
}
