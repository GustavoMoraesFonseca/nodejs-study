export class ErrorDto {

    type = null;
    message = null;

    constructor(type, message) {
        this.type = type;
        this.message = message;
    }
}