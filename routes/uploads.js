import { Router } from "express";
import { check } from "express-validator";

import { actualizarImg, actualizarImgCloudinary, cargarArchivo, mostrarImagen } from "../controllers/uploads.js";

import { coleccionesPermitidas } from "../helpers/db-validators.js";

import { validarArchivo } from "../middlewares/validar-archivo.js";
import { validarCampos } from "../middlewares/validarCampos.js";

const routerUpload = new Router();

routerUpload.post('/', validarArchivo, cargarArchivo );

routerUpload.put('/:coleccion/:id', [
        validarArchivo,
        check('id', 'No es un ID válido').isMongoId(),
        check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] )),
        validarCampos
    ], actualizarImgCloudinary );

routerUpload.get('/:coleccion/:id', [
        check('id', 'No es un ID válido').isMongoId(),
        check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] )),
        validarCampos
    ], mostrarImagen );

export { routerUpload }