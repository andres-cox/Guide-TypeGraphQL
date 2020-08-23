import { Connection } from "typeorm";
import { testConnection } from "../../../test-utils/testConnection"
import { graphqlCall } from "../../../test-utils/graphqlCall";
import { User } from "../../../entity/User";
import faker from "faker";
import { redis } from "../../../redis";

let connection: Connection;

beforeAll(async () => {
    if (redis.status == "end") {
        await redis.connect();
    }
    connection = await testConnection();
});

afterAll(async () => {
    redis.disconnect();
    await connection.close();
});

const registerMutation = `
    mutation Register($data: RegisterInput!){
        register(data: $data){
            id
            firstName
            lastName
            email
            name
        }
    }
`;

describe("Register", () => {
    it("create user", async () => {
        const user = {
            firstName: faker.name.findName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        };

        const response = await graphqlCall({
            source: registerMutation,
            variableValues: {
                data: user
            }
        });

        if (response.errors) {
            console.log(response.errors[0].originalError);
        }

        expect(response).toMatchObject({
            data: {
                register: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            }
        });

        const dbUser = await User.findOne({ where: { email: user.email } });
        expect(dbUser).toBeDefined()
        expect(dbUser!.confirmed).toBeFalsy();
        expect(dbUser!.firstName).toBe(user.firstName);
    });
});