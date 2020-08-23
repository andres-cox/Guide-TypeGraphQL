import { graphql } from "graphql"
import { createSchema } from "../utils/createSchema"
import { Maybe } from "graphql/jsutils/Maybe"

interface Options {
    source: string;
    variableValues?: Maybe<{
        [key: string]: any;
    }>;
    userId?: number;
}

export const graphqlCall = async ({ source, variableValues, userId }: Options) => {
    return graphql({
        schema: await createSchema(),
        source,
        variableValues,
        contextValue: {
            req: {
                session: {
                    userId
                }
            },
            res: {
                clearCookie: jest.fn()
            }
        }
    })
}