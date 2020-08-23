import { Resolver, Mutation, Arg } from "type-graphql";
import { GraphQLUpload } from "graphql-upload";
import { createWriteStream } from "fs";

import { Upload } from "../../types/Upload";

@Resolver()
export class ProfilePictureResolver {
    @Mutation(() => Boolean)
    async addProfilePicture(@Arg("picture", () => GraphQLUpload)
    {
        createReadStream,
        filename
    }: Upload): Promise<boolean> {
        return new Promise(async (resolve, reject) =>
            createReadStream()
                .pipe(createWriteStream(__dirname + `/../../../images/${filename}`))
                .on("finish", () => resolve(true))
                .on("error", () => reject(false))
        );
    }
}

// curl 'http://localhost:4000/graphql' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' --data-binary '{"query":"mutation AddProfilePicture($picture: Upload!){\n\taddProfilePicture(picture: $picture)\n}"}'