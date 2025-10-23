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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelperController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("../../common");
const helper_service_1 = require("./helper.service");
let HelperController = class HelperController {
    constructor(helperService) {
        this.helperService = helperService;
    }
    async clearAllData() {
        return this.helperService.clearAllData();
    }
    async getDatabaseInfo() {
        return this.helperService.getDatabaseInfo();
    }
};
__decorate([
    (0, common_1.Delete)('/clear-all-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Clear all data from database',
        description: '⚠️ WARNING: This will delete ALL data in the database. Use only in development/testing environment.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'All data cleared successfully',
        type: common_2.ResponseDTO,
        schema: {
            example: {
                data: {
                    message: 'All data has been cleared successfully',
                    deletedCollections: ['users', 'tweets', 'comments', 'notifications'],
                    totalCollections: 15,
                },
                message: 'All data cleared successfully',
                statusCode: 200,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Failed to clear data',
        schema: {
            example: {
                error: 'Error message',
                message: 'Failed to clear all data',
                statusCode: 400,
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HelperController.prototype, "clearAllData", null);
__decorate([
    (0, common_1.Get)('/database-info'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get database information',
        description: 'Get information about database collections and document counts',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Database information retrieved successfully',
        type: common_2.ResponseDTO,
        schema: {
            example: {
                data: {
                    databaseName: 'twitter_db',
                    totalCollections: 15,
                    totalDocuments: 1250,
                    collections: [
                        { name: 'users', documentCount: 150 },
                        { name: 'tweets', documentCount: 800 },
                        { name: 'comments', documentCount: 300 },
                    ],
                },
                message: 'Database info retrieved successfully',
                statusCode: 200,
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HelperController.prototype, "getDatabaseInfo", null);
HelperController = __decorate([
    (0, common_1.Controller)('helper'),
    (0, swagger_1.ApiTags)('Helper - Development Tools'),
    __metadata("design:paramtypes", [helper_service_1.HelperService])
], HelperController);
exports.HelperController = HelperController;
//# sourceMappingURL=helper.controller.js.map