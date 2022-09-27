"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = (0, express_1.default)();
const PORT = 8000;
router.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
router.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
