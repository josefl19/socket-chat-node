import { Router } from 'express';

import { buscar } from '../controllers/buscar.js';

const routerBuscar = Router();

routerBuscar.get('/:coleccion/:termino', buscar )

export { routerBuscar }