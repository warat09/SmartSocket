import { Entity, PrimaryGeneratedColumn, Column , OneToOne , JoinColumn } from "typeorm"
import { User } from "./User"
import { Match } from "./Match"

@Entity()
export class User_match {

    @PrimaryGeneratedColumn('increment')
    id_user_match : number

    @OneToOne(() => User, (User) => User.id_user)
    @JoinColumn({ name: 'id_user' })
    id_user: User
    
    @OneToOne(() => Match, (Match) => Match.id_match)
    @JoinColumn({ name: 'id_match' })
    id_match: Match

    @Column()
    room: string

    @Column()
    floor: string

    @Column({
        nullable:true
    })
    description: string

    @Column()
    status_user_match: string

    @Column()
    datetime: Date

    @Column()
    sum_used_time: number

}
