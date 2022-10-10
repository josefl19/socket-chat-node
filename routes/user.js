import { Router } from "express";
import { check } from "express-validator";

import { usuariosDelete, usuariosGet, usuariosPatch, usuariosPost, usuariosPut } from "../controllers/usuarios.js";
import { emailExiste, esRolValido, existeIDUsuario } from "../helpers/db-validators.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { esAdminRole, tieneRole } from "../middlewares/validar-roles.js";
import { validarCampos } from "../middlewares/validarCampos.js";

const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom( existeIDUsuario ),
        check('rol').custom( esRolValido ),   
        validarCampos
    ],
    usuariosPut);

router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),        // Middleware
        check('password', 'El password es obligatorio y debe contener 8 o más caracteres').isLength({ min: 8 }),    // Middleware
        check('correo').custom( emailExiste ).isEmail().withMessage('El correo ingresado no es valido'),            // Verifica si el email existe, despues si el valor ingresado es un correo.
        check('rol').custom( esRolValido ),                                                                         // Se omite pasar parámetro por obviedad.
        validarCampos                                                       // Middleware
    ], usuariosPost);

router.patch('/', usuariosPatch);

router.delete('/:id', [
        validarJWT,
        //esAdminRole,
        tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom( existeIDUsuario ),
        validarCampos
    ], usuariosDelete);

export { router }   