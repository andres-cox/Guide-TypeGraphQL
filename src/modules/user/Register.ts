import { Resolver, Query, Mutation, Arg, UseMiddleware } from "type-graphql";
import bcrypt from "bcryptjs"
import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";
import { IsAuth } from "../middleware/IsAuth";
import { sendEmail } from "../utils/sendEmail";
import { CreateConfirmationEmailUrl } from "../utils/createConfirmationEmailUrl";

@Resolver()
export class RegisterResolver {
    // @Authorized()
    @UseMiddleware(IsAuth)
    @Query(() => String)
    async hello() {
        return "Hello World!";
    }

    @Mutation(() => User)
    async register(
        @Arg("data") { firstName, lastName, email, password }: RegisterInput,
    ): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        }).save();

        await sendEmail(email, await CreateConfirmationEmailUrl(user.id));

        return user;
    }
}
