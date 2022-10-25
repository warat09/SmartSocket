import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Assets{

    @PrimaryGeneratedColumn('increment')
    id_assets : string

    @Column()
    name_assets: string

    @Column("timestamp")
    date_assets: Date

    @Column({type: 'bigint'})
    expire_hour: number

    @Column()
    maintenance: boolean

    @Column()
    status_assets: string

}
