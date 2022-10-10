import { validationResult } from "express-validator";

const validarCampos = (req, res, next) => {             // Los middlewares añaden el tercer parametro (next) que indica que continue con los siguientes middlwares antes de llegar al controlador
    const errors = validationResult(req);
    if( !errors.isEmpty() ) {
        return res.status(400).json(errors);
    }

    next();
}

export{ validarCampos }