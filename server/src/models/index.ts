import sequelize from '../config/connection.js';
import { UserFactory, User } from './user.js';
import { HeartFactory, Heart } from './heart.js';



const UserModel = UserFactory(sequelize);
const HeartModel = HeartFactory(sequelize);




HeartModel.belongsTo(UserModel, { foreignKey: 'UserId' });
UserModel.hasMany(HeartModel, { foreignKey: 'UserId' });
export { User, Heart};
