import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  static async getConnect(req, res) {
    const userData = req.header('Authorization').split(' ')[1];
    const [email, password] = Buffer.from(userData, 'base64').toString('ascii').split(':');
    if (!email || !password) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await dbClient.dbClient.collection('users').findOne({ email, password: sha1(password) });
    if (!user || user.password !== sha1(password)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = uuidv4();
    await redisClient.set(`auth_${token}`, user._id.toString(), 60 * 60 * 24);

    return res.status(200).json({ token });
  }

  static async getDisconnect(req, res) {
    const token = req.header('X-Token');
    const key = `auth_${token}`;
    const id = await redisClient.get(key);

    if (id) {
      await redisClient.del(key);
      return res.status(204).end();
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

module.exports = AuthController;
