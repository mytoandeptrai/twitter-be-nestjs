"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoTool = void 0;
const constants_1 = require("../constants");
const mongoose_1 = __importDefault(require("mongoose"));
class MongoTool {
    static initialize() {
        mongoose_1.default.connect(constants_1.DATABASE_URL);
        mongoose_1.default.connection.on('error', (err) => {
            console.error('🚀 MongoDB connection error.', err);
            process.exit();
        });
    }
}
exports.MongoTool = MongoTool;
//# sourceMappingURL=mongo.tool.js.map