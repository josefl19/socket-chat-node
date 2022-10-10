import { Router } from "express";
import { check } from "express-validator";

import { actualizarProducto, borrarProducto, crearProducto, obtenerProductoId, obtenerProductos } from "../controllers/productos.js";

import { existeIDCategoria, existeIDProducto } from "../helpers/db-validators.js";

import { validarJWT } from "../middlewares/validar-jwt.js";
import { esAdminRole } from "../middlewares/validar-roles.js";
import { validarCampos } from "../middlewares/validarCampos.js";

const routerProductos = Router();

routerProductos.get('/', obtenerProductos );

routerProductos.get('/:id', [
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom( existeIDProducto ),
        validarCampos
    ], obtenerProductoId );

routerProductos.post('/', [
        validarJWT,
        check('nombre', 'El nombre es un campo obligatorio').not().isEmpty(),
        check('categoria', 'No es un ID de Mongo').isMongoId(),
        check('categoria').custom( existeIDCategoria ),
        validarCampos
    ], crearProducto );

routerProductos.put('/:id', [
        validarJWT,
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom( existeIDProducto ),
        check('categoria').custom( existeIDCategoria ),
        validarCampos
    ], actualizarProducto );

routerProductos.delete('/:id', [
        validarJWT,
        esAdminRole,
        check('id', 'No es un ID valido').isMongoId(),
        check('id').custom( existeIDProducto ),
        validarCampos
    ], borrarProducto );

export { routerProductos }