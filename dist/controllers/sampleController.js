"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSample = exports.getSamples = void 0;
const getSamples = (req, res) => {
    res.status(200).send("GET request to the homepage");
};
exports.getSamples = getSamples;
const createSample = (req, res) => {
    res.status(201).json({
        message: "POST request to create a sample",
        requestBody: req.body,
    });
};
exports.createSample = createSample;
//# sourceMappingURL=sampleController.js.map