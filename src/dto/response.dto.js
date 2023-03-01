export class ResponseDto {

    data = null;
    errors = null;

    constructor(data, errors) {
        this.data = data;
        this.errors = errors;
    }
}