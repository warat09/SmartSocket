import { Entity, PrimaryGeneratedColumn, Column ,ManyToOne , JoinColumn} from "typeorm"
import {Match} from "./Match"
import { User_match } from "./Usermatch"

@Entity()
export class Node_Transaction {

    @PrimaryGeneratedColumn('increment')
    id_txn : string

    @ManyToOne(() => Match, (Match) => Match.id_match)
    @JoinColumn({ name: 'id_match'})
    @Column()
    id_match: number

    @ManyToOne(() => User_match, (User_match) => User_match.id_user_match)
    @JoinColumn({ name: 'id_user_match'})
    @Column()
    id_user_match: number

    @Column({
        nullable:true
    })
    status_transaction: string

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
