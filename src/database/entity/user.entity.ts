import {
   Entity,
   PrimaryGeneratedColumn,
   CreateDateColumn,
   UpdateDateColumn,
   Column,
   OneToMany,
   BeforeInsert } from "typeorm";
import { IsEmail, MinLength, validate } from "class-validator";

import { hashPassword } from "~utils/index";
import Image from "~entity/image.entity";

@Entity("users")
class User {
   @PrimaryGeneratedColumn("uuid")
   id: string;

   @Column({
      type: "varchar",
      length: 255
   })
   firstname: string;

   @Column({
      type: "varchar",
      length: 255
   })
   lastname: string;

   @IsEmail()
   @Column({
      type: "varchar",
      length: 255,
      unique: true
   })
   email: string;

   @MinLength(6)
   // @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-])/)
   @Column({
      type: "varchar",
      length: 255
   })
   password: string;

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

   @OneToMany(() => Image, (image: Image) => image.owner, {
      cascade: ["insert", "update"]
   })
   images: Image[];

   @BeforeInsert()
   async hashPassword() {
      this.password = await hashPassword(this.password);
   }
   @BeforeInsert()
   async validateFields() {
      const errors = await validate(this);

      if(errors.length > 0) {
         throw new Error("validation error");
      }
   }
}

export default User;