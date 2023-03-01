var model;

export class UserRepository {
    set _model(value) {
        model = value;
    }

    create(userDto) {
        return new model(userDto).save();
    }

    findAll() {
        return model.find();
    }

    findById(id) {
        return model.findById(id);
    }

    update(id, userDto) {
        return model.findByIdAndUpdate(id, userDto);
    }

    delete(id) {
        return model.findByIdAndDelete(id);
    }

    findByNameAndPassword(user) {
        return model.findOne(user);
    }
}