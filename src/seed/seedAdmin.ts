import { UserStatus } from '../../generated/prisma/enums';
import { ENV } from '../config/env';
import auth from '../libs/auth';
import { UserRole } from '../modules/user/user.schema';
import { ApiError } from '../utils/ApiError';

const seedAdmin = async () => {
  try {
    const admin = await auth.api.signUpEmail({
      body: {
        email: ENV.ADMIN_EMAIL,
        name: ENV.ADMIN_NAME,
        password: ENV.ADMIN_PASSWORD,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
      },
    });

    if (!admin) {
      throw new ApiError(500, 'Failed to create admin user');
    }

    console.log('✅ Admin user seeded successfully:');

    // if (admin.user.role !== 'ADMIN') {
    //   await auth.api.updateUser(admin.user.id, {
    //     role: 'ADMIN',
    //   });
    // }

    // if (admin.user.role !== 'ADMIN') {
    //   await auth.api.updateUser(admin.user.id, {
    //     role: 'ADMIN'
    //   }
    // })
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

seedAdmin();
