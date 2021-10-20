require('dotenv').config();
const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () => {
    const busquedas = new Busquedas();
    let opt;
    do {
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                const termino = await leerInput('Ciudad: ');
                const lugares = await busquedas.ciudad(termino);
                const id = await listarLugares(lugares);
                if (id === '0') continue;
                const lugarSelct = lugares.find(k => k.id === id);
                const { lat, lng, nombre } = lugarSelct;
                busquedas.agregarHistorial(nombre);
                const clima = await busquedas.temperatura(lat, lng);
                const { desc, temp, max, min } = clima;
                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad:', nombre.yellow);
                console.log('Lat:', lat);
                console.log('Lng:', lng);
                console.log('Temperatura:', temp);
                console.log('Minima:', min);
                console.log('Maxima:', max);
                console.log('Desc clima::', desc);
                await pausa();
                break;
            case 2:
                busquedas.historialCap.forEach((lugar,i) =>{
                    const idx = `${i +1}.`.green;
                    console.log(`${idx} ${lugar}`);
                });
        }
        await busquedas.guardarDB();
    } while (opt !== 0) await pausa();
}
main();