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

const meQuery = `
    {
        me {
            id
            firstName
            lastName
            email
            name
        }
    }
`;

describe("Me", () => {
    it("get user", async () => {
        const user = await User.create({
            firstName: faker.name.findName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        }).save();

        const response = await graphqlCall({
            source: meQuery,
            userId: user.id
        });

        if (response.errors) {
            console.log(response.errors[0].originalError);
        }

        expect(response).toMatchObject({
            data: {
                me: {
                    id: `${user.id}`,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            }
        })
    });

    it("return null", async () => {
        const response = await graphqlCall({
            source: meQuery
        });

        expect(response).toMatchObject({
            data: {
                me: null
            }
        })
    });

});