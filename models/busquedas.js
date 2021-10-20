const fs = require('fs');
const axios = require('axios');

class Busquedas {
    
    historial = [];
    dbPath = './db/database.json';
    
    
    constructor() {
        this.leerDB();
    }
    
    get paramsMapbox() {
        return {
            'limit': 5,
            'language': 'es',
            'access_token': process.env.MAPBOX_KEY
        }
    }
    
    get paramsOpenWeather() {
        
        return {
            appid: process.env.OPEN_WEATHER_KEY,
            units: 'metric',
            lang: 'sp'
        }
    }
    
    get historialCap() {
        return this.historial
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    async ciudad(lugar = '') {
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });
            const resp = await instance.get();
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
        } catch (err) {
            return [];
        }
    }

    async temperatura(lat, lon) {

        try {
            const instance = axios.create({
                baseURL: `api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsOpenWeather, lat, lon }
            });

            const resp = await instance.get();
            const { weather, main } = resp.data;
            return {
                des: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial(lugar = '') {
        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        };
        this.historial.unshift(lugar.toLocaleLowerCase());
    }

    guardarDB() {
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB() {
        if (!fs.existsSync(this.dbPath)) return;

        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
        const data = JSON.parse(info);
        this.historial = data.historial;
    }




}

module.exports = Busquedas;