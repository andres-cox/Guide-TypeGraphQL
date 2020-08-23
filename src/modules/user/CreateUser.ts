import { Resolver, Mutation, Arg, ClassType, InputType, Field, UseMiddleware } from "type-graphql";
import { User } from "../../entity/User";
import { Product } from "../../entity/Product";
import { RegisterInput } from "./register/RegisterInput";
import { Middleware } from "type-graphql/dist/interfaces/Middleware";

function createResolver<T extends ClassType, X extends ClassType>(
    suffix: string,
    returnType: T,
    inputType: X,
    entity: any,
    middleware?: Middleware<any>[]
) {
    @Resolver()
    class BaseResolver {
        protected items: T[] = [];

        @Mutation(() => returnType, { name: `create${suffix}` })
        @UseMiddleware(...(middleware || [])) //use this way to add more decorators
        async create(@Arg("data", () => inputType) data: any): Promise<T[]> {
            return entity.create(data).save();
        }
    }

    return BaseResolver;
}

@InputType()
class ProductInput {
    @Field()
    name: string
}


export const CreateUserResolver = createResolver("User", User, RegisterInput, User);
export const CreateProductResolver = createResolver("Product", Product, ProductInput, Product);


// @Resolver()
// export class CreateUserResolver extends BaseCreateUser {

//     // @Mutation(() => User)
//     // async createUser(@Arg('data') data: RegisterInput) {
//     //     return User.create(data).save();
//     // }
// }

// @Resolver()
// export class CreateProductResolver extends BaseCreateProduct {

//     // @Mutation(() => User)
//     // async createUser(@Arg('data') data: RegisterInput) {
//     //     return User.create(data).save();
//     // }
// }