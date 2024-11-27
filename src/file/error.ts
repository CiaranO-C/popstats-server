import { GraphQLError } from "graphql";

class UploadError extends GraphQLError {
  code: string;

  constructor(message: string) {
    super(message);
    this.code = "UPLOAD_ERROR";
  }
}

export { UploadError }
