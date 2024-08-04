import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  static getStatus(_, res) {
    res.status(200).json({ redis: redisClient.isAlive(), db: dbClient.isAlive() });
  }

  static async getStats(_, res) {
    const usersNum = await dbClient.nbUsers();
    const filesNum = await dbClient.nbFiles();
    res.status(200).json({ users: usersNum, files: filesNum });
  }
}

module.exports = AppController;
