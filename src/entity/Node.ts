import { Entity, PrimaryColumn, Column } from "typeorm"

@Entity()
export class Node {

    @PrimaryColumn()
    mac_address : string

    @Column()
    ip: string

    @Column()
    date_node: Date

    @Column()
    status_node: string

}
