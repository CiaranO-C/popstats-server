import { GraphQLError } from "graphql";

class UploadError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: "UPLOAD_ERROR",
      },
    });
  }
}

export { UploadError };
