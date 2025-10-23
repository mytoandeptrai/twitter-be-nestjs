"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelperService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const tools_1 = require("../../tools");
const common_2 = require("../../common");
let HelperService = class HelperService {
    constructor(connection) {
        this.connection = connection;
    }
    async clearAllData() {
        try {
            const collections = await this.connection.db.listCollections().toArray();
            const deletePromises = collections.map(async (collection) => {
                try {
                    await this.connection.db.collection(collection.name).deleteMany({});
                    console.log(`✅ Deleted all documents from collection: ${collection.name}`);
                }
                catch (error) {
                    console.error(`❌ Error deleting collection ${collection.name}:`, error);
                }
            });
            await Promise.all(deletePromises);
            const deletedCollections = collections.map((col) => col.name);
            return tools_1.ResponseTool.DELETE_OK({
                message: 'All data has been cleared successfully',
                deletedCollections,
                totalCollections: deletedCollections.length,
            }, 'All data cleared successfully');
        }
        catch (error) {
            console.error('❌ Error clearing all data:', error);
            return tools_1.ResponseTool.BAD_REQUEST('Failed to clear all data', error);
        }
    }
    async getDatabaseInfo() {
        try {
            const collections = await this.connection.db.listCollections().toArray();
            const collectionStats = await Promise.all(collections.map(async (collection) => {
                const count = await this.connection.db
                    .collection(collection.name)
                    .countDocuments();
                return {
                    name: collection.name,
                    documentCount: count,
                };
            }));
            const totalDocuments = collectionStats.reduce((sum, col) => sum + col.documentCount, 0);
            return tools_1.ResponseTool.GET_OK({
                databaseName: this.connection.db.databaseName,
                totalCollections: collections.length,
                totalDocuments,
                collections: collectionStats,
            });
        }
        catch (error) {
            return tools_1.ResponseTool.BAD_REQUEST('Failed to get database info', error);
        }
    }
};
HelperService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Connection])
], HelperService);
exports.HelperService = HelperService;
//# sourceMappingURL=helper.service.js.map