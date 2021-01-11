import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, UpdateDateColumn } from "typeorm";
import User from "./user.entity";

@Entity("images")
class Image {
   @PrimaryGeneratedColumn("uuid")
   id: string;

   @Column({
      name: "url",
      type: "varchar",
   })
   url: string;

   @Column({
      name: "key",
      type: "varchar"
   })
   key: string;

   @CreateDateColumn({
      name: "created_at",
      type: "timestamp"
   })
   createdAt: Date;

   @UpdateDateColumn({
      name: "updated_at",
      type: "timestamp"
   })
   updatedAt: Date;

   @ManyToOne(() => User, (owner: User) => owner.images, {
      onDelete: "CASCADE"
   })
   @JoinColumn({ name: "owner_id" })
   owner: User;
}

export default Image;