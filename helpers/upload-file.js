import { v4 as uuidv4 }from 'uuid';
import path from 'path';

// Para crear la ruta con ES Module
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const subirArchivo = ( files, extensionesValidas = ['jpg', 'png', 'jpeg', 'gif', 'txt'], carpeta = '' ) => {
    return new Promise( (resolve, reject) => {
        // Obtener el archivo de req.files
        const { archivo } = files;
        const partesNombre = archivo.name.split('.');
        const extension = partesNombre[ partesNombre.length - 1 ];

        // Validar extension
        if( !extensionesValidas.includes(extension) ) {
            return reject('El tipo de archivo tiene una extensión no permitida');
        }

        // Renombrar el archivo
        const nombreTemp = uuidv4() + '.' + extension;

        // Ruta para guardar los archivos
        // const uploadPath = __dirname + '/uploads/' + sampleFile.name;                      Para Common.js
        const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreTemp )      // Para ES Modules

        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }

            resolve( nombreTemp );
        });
    });
}

export { subirArchivo }