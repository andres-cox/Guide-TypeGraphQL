import { InputType, Field } from "type-graphql";
import { Length, IsEmail } from "class-validator";
import { IsEmailAlreadyExist } from "./IsEmailAlreadyExist";
import { PasswordInput } from "../../shared/PasswordInput";
// import { OkMixin } from "../../shared/OkMixin";

@InputType()
// export class RegisterInput extends OkMixin(PasswordInput) {  //OkMixin to extend more fields
export class RegisterInput extends PasswordInput {
    @Field()
    @Length(1, 255)
    firstName: string;

    @Field()
    @Length(1, 255)
    lastName: string;

    @Field()
    @IsEmail()
    @IsEmailAlreadyExist({ message: "email already exist" })
    email: string;

    @Field()
    password: string;
}