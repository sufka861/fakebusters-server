"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/sampleRoutes.ts
const express_1 = __importDefault(require("express"));
const sampleController_1 = require("../controllers/sampleController");
const router = express_1.default.Router();
router.get('/samples', sampleController_1.getSamples);
router.post('/samples', sampleController_1.createSample);
exports.default = router;
//# sourceMappingURL=sampleRoutes.js.map