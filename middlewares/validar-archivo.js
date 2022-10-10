import { response } from "express";

const validarArchivo = (req, res = response, next) => {

    // Validar que venga con algo req.files y req.files.archivo con la carga de al menos uno.
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({ msg: 'No hay archivos por subir' });
        
    }

    next();
}

export { validarArchivo}