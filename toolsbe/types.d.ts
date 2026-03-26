import { User } from "./src/entity/User";

declare namespace Express {
  export interface Request {
    user?: User;
  }
}
