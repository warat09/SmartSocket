import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn('increment')
    id_user : number

    @Column()
    name: string

    @Column()
    surname: string

    @Column()
    username: string

    @Column()
    password: string

    @Column()
    email: string

    @Column()
    role: string

    @Column()
    departure: string

    @Column()
    status: string

}
