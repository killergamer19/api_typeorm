import bcrypt from 'bcryptjs';
import db from '../_helpers/db'; // Ensure the correct path

export const userService = {
  getAll,
  getById,
  create,
  update,
  delete: _delete
};

async function getAll(): Promise<any[]> {
  return await db.User.findAll();
}

async function getById(id: number): Promise<any> {
  return await getUser(id);
}


async function create(params: { email: string; password: string }): Promise<void> {
    // validate
    if (await db.User.findOne({ where: { email: params.email } })) {
      throw new Error(`Email "${params.email}" is already registered`);
    }
  
    const user = new db.User(params);
  
    // hash password
    user.passwordHash = await bcrypt.hash(params.password, 10);
  
    // save user
    await user.save();
  }

  
  async function update(id: number, params: any): Promise<void> {
    const user = await getUser(id);
  
    // Validate
    const usernameChanged = params.username && user.username !== params.username;
    if (usernameChanged && await db.User.findOne({ where: { username: params.username } })) {
      throw `Username "${params.username}" is already taken`;
    }
  
    // Hash password if it was entered
    if (params.password) {
      params.passwordHash = await bcrypt.hash(params.password, 10);
    }
  
    // Copy params to user and save
    Object.assign(user, params);
    await user.save();
  }
  
  async function _delete(id: number): Promise<void> {
    const user = await getUser(id);
    await user.destroy();
  }
  

// helper functions
async function getUser(id: number): Promise<any> {
  const user = await db.User.findByPk(id);
  if (!user) throw new Error('User not found');
  return user;
}

