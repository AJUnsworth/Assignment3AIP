import mongoose from 'mongoose';

import User from './user';

const connectDb = () => {
  return mongoose.connect('mongodb+srv://user:123ILoveAIP@sceenit-cluster-1foic.mongodb.net/test?retryWrites=true&w=majority');
};

const models = { User, Message };

export { connectDb };

export default models;