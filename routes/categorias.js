import { Router } from "express";
import { check } from "express-validator";

import { obtenerCaterogias, categoriaPost, obtenerCategoriaId, actualizarCategoria, borrarCategoria } from "../controllers/categorias.js";
import { existeIDCategoria } from "../helpers/db-validators.js";

import { validarJWT } from "../middlewares/validar-jwt.js";
import { esAdminRole, tieneRole } from "../middlewares/validar-roles.js";
import { validarCampos } from "../middlewares/validarCampos.js";

const routerCategorias = Router();

// Obtener todas las categorias - Acceso público
routerCategorias.get('/', obtenerCaterogias );

// Obtener una categoria por su ID - Acceso público
routerCategorias.get('/:id', [
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom( existeIDCategoria ),
        validarCampos
    ], obtenerCategoriaId);

// Crear categoria - Privado, cualquier rol pero con token válido
routerCategorias.post('/', [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ], categoriaPost );

// Actualizar categoria - Privado, cualquier rol pero con token válido
routerCategorias.put('/:id', [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('id').custom( existeIDCategoria ),
        validarCampos
    ], actualizarCategoria );

// Borrar categoria - Solo admin
routerCategorias.delete('/:id', [
        validarJWT,
        esAdminRole,
        check('id', 'No es un ID valido').isMongoId(),
        check('id').custom( existeIDCategoria ),
        validarCampos
    ], borrarCategoria );

export { routerCategorias}   