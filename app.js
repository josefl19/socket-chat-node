import * as dotenv from "dotenv"
dotenv.config()

import { Servidor } from "./models/server.js"

const server = new Servidor();

server.listen()

