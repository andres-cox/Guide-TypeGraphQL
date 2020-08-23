import { v4 } from "uuid"
import { redis } from "../../redis";
import { confirmUserPrefix } from "../constants/redisPrefixes";

export const CreateConfirmationEmailUrl = async (userId: number) => {
    const token = v4();
    await redis.set(confirmUserPrefix + token, userId, "ex", 60 * 60 * 24) //1 day

    return `http://localhost:4200/user/confirm/${token}`
}