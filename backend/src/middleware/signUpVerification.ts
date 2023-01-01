import UserModel from '../models/user'

export class RegisterVerification {
    checkCorrectUsernameMail = (req, res, next) => {
        UserModel.findOne({
            username: req.body.username
        }).exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (user) {
                res.status(400).send({ message: "This username is already in use!" });
                return;
            }

            UserModel.findOne({
                email: req.body.email
            }).exec((err, user) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                if (user) {
                    res.status(400).send({ message: "An account has already been registered using this email!" });
                    return;
                }

                next();
            });
        });
    }

}