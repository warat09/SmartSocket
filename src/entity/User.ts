import { Entity, PrimaryGeneratedColumn,OneToMany, Column } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn('increment')
    id_user : number

    @Column()
    name: string

    @Column()
    surname: string

    @Column()
    password: string

    @Column()
    email: string

    @Column()
    id_card:string

    @Column()
    role: string

    @Column()
    departure: string

    @Column()
    status_user: string

}
