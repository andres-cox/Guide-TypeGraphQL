import { MiddlewareFn } from "type-graphql";
import { MyContext } from "src/types/MyContext";

export const IsAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
    if (!context.req.session!.userId) {
        return new Error("not authenticated");
    }

    return next();
};