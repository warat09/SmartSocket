import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Node_Transection {

    @PrimaryGeneratedColumn('increment')
    id_txn : string

    @Column()
    id_match: number

    @Column({
        nullable:true
    })
    status_action: string

    @Column({type: 'bigint'})
    time_used: number

    @Column({type: 'datetime',
    default: () => 'NOW()',
    })
    time_update: Date

    @Column()
    on_date: string

    @Column()
    off_date: string

}
