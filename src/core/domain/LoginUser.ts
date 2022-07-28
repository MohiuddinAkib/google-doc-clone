import { IsNotEmpty } from "class-validator";

export default class LoginUser {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
