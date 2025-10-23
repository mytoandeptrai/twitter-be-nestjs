import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ResponseTool } from 'tools';
import { ResponseDTO } from 'common';

@Injectable()
export class HelperService {
  constructor(@InjectConnection() private connection: Connection) {}

  /**
   * Xóa toàn bộ data trong database
   * Chỉ nên sử dụng trong development/testing
   */
  async clearAllData(): Promise<ResponseDTO> {
    try {
      // Lấy danh sách tất cả collections
      const collections = await this.connection.db.listCollections().toArray();

      // Xóa từng collection
      const deletePromises = collections.map(async (collection) => {
        try {
          await this.connection.db.collection(collection.name).deleteMany({});
          console.log(
            `✅ Deleted all documents from collection: ${collection.name}`,
          );
        } catch (error) {
          console.error(
            `❌ Error deleting collection ${collection.name}:`,
            error,
          );
        }
      });

      await Promise.all(deletePromises);

      const deletedCollections = collections.map((col) => col.name);

      return ResponseTool.DELETE_OK(
        {
          message: 'All data has been cleared successfully',
          deletedCollections,
          totalCollections: deletedCollections.length,
        },
        'All data cleared successfully',
      );
    } catch (error) {
      console.error('❌ Error clearing all data:', error);
      return ResponseTool.BAD_REQUEST('Failed to clear all data', error as any);
    }
  }

  /**
   * Lấy thông tin về database hiện tại
   */
  async getDatabaseInfo(): Promise<ResponseDTO> {
    try {
      const collections = await this.connection.db.listCollections().toArray();

      const collectionStats = await Promise.all(
        collections.map(async (collection) => {
          const count = await this.connection.db
            .collection(collection.name)
            .countDocuments();
          return {
            name: collection.name,
            documentCount: count,
          };
        }),
      );

      const totalDocuments = collectionStats.reduce(
        (sum, col) => sum + col.documentCount,
        0,
      );

      return ResponseTool.GET_OK({
        databaseName: this.connection.db.databaseName,
        totalCollections: collections.length,
        totalDocuments,
        collections: collectionStats,
      });
    } catch (error) {
      return ResponseTool.BAD_REQUEST(
        'Failed to get database info',
        error as any,
      );
    }
  }
}
