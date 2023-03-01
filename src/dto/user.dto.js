export class UserDto {
    name = null;
    password = null;

    constructor(userDto) {
        this.name = userDto.name;
        this.password = userDto.password;
    }
}