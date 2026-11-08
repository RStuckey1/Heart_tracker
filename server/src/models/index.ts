import sequelize from '../config/connection.js';
import { UserFactory, User } from './user.js';
import { HeartFactory, Heart } from './heart.js';
import { JournalEntryFactory, JournalEntry } from './journalEntry.js';



const UserModel = UserFactory(sequelize);
const HeartModel = HeartFactory(sequelize);
const JournalEntryModel = JournalEntryFactory(sequelize);




HeartModel.belongsTo(UserModel, { foreignKey: 'UserId' });
UserModel.hasMany(HeartModel, { foreignKey: 'UserId' });
JournalEntryModel.belongsTo(UserModel, { foreignKey: 'UserId' });
UserModel.hasMany(JournalEntryModel, { foreignKey: 'UserId' });
export { User, Heart, JournalEntry };
