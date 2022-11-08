import { Entity, PrimaryGeneratedColumn, Column ,ManyToOne , JoinColumn} from "typeorm"
import {Match} from "../entity/Match"

@Entity()
export class Node_Transection {

    @PrimaryGeneratedColumn('increment')
    id_txn : string

    @ManyToOne(() => Match, (Match) => Match.id_match)
    @JoinColumn({ name: 'id_match'})
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
