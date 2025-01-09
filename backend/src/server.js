"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const app = (0, express_1.default)();
const PORT = 6543;
const cachedFile = 'cachedCards.json';
const allowedOrigin = process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGIN
    : 'http://localhost:5173';
app.use((0, cors_1.default)({ origin: allowedOrigin }));
function fetchCards() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get('https://api.pokemontcg.io/v2/sets', {
                headers: { 'X-Api-Key': process.env.HAMBURGER },
                params: {
                    page: 1,
                    orderBy: '-releaseDate',
                },
            });
            return response.data.data;
        }
        catch (error) {
            console.error('Error fetching cards:', error.message);
            throw error;
        }
    });
}
app.get('/search/:searchWord', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchWord } = req.params;
    try {
        let cards;
        const url = `https://api.pokemontcg.io/v2/cards?q=name:${searchWord}`;
        //console.log('Sending request to API:', url);
        const response = yield axios_1.default.get(url);
        cards = response.data;
        res.json({ cards });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching data from Pokémon API:', error.message);
        }
        else {
            console.error('Unknown error:', error);
        }
        res.status(500).json({ error: 'Failed to fetch data from Pokémon API' });
    }
}));
app.get('/:series/:setID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { setID } = req.params;
    try {
        let cards;
        const response = yield axios_1.default.get(`https://api.pokemontcg.io/v2/cards`, {
            headers: { 'X-Api-Key': process.env.HAMBURGER },
            params: {
                q: `set.id:${setID}`,
                page: 1,
                orderBy: '-releaseDate',
            },
        });
        cards = response.data;
        res.json({ cards });
    }
    catch (error) {
        console.error('Error fetching cards:', error.message);
        throw error;
    }
}));
function readCachedData() {
    if (fs_1.default.existsSync(cachedFile)) {
        console.log('Found cached data');
        try {
            const cachedData = JSON.parse(fs_1.default.readFileSync(cachedFile, 'utf-8'));
            console.log("returning cached data");
            return cachedData.data || cachedData;
        }
        catch (error) {
            console.error('Error parsing cached data:', error);
            return null;
        }
    }
    return null;
}
function saveDataToCache(data) {
    console.log('Saving data locally');
    const cards = data.data || data;
    fs_1.default.writeFileSync(cachedFile, JSON.stringify(cards, null, 2), 'utf-8');
}
app.get('/sets', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sets = readCachedData();
        if (!Array.isArray(sets)) {
            console.warn('Cached data is not an array. Fetching fresh data...');
            const fetchedData = yield fetchCards();
            sets = fetchedData.data || fetchedData; // Ensure it's an array
            saveDataToCache(sets); // Save back to cache
        }
        res.json({ sets }); // Send the array to the frontend
    }
    catch (error) {
        console.error('Error fetching cards:', error);
        res.status(500).json({ error: 'Failed to fetch sets' });
    }
}));
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ error: 'Something went wrong!' });
});
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
