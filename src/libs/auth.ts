import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '../config/prisma';

import { sendEmail } from './sendEmail';

const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  basePath: '/api/v1/auth',
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    cookieOptions: {
      httpOnly: true,
      secure: false, // only in HTTPS production
      sameSite: 'lax',
    },
    // cookieCache: {
    //   // secure: process.env.NODE_ENV === 'production',
    //   // secure: false,
    //   // httpOnly: true,
    //   // sameSite: 'strict',
    //   enabled: true,
    //   refreshCache: false,
    //   // maxAge: 7 * 24 * 60 * 60, // 7 days
    // },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        enumValues: ['CUSTOMER', 'PROVIDER', 'ADMIN'],
        default: 'CUSTOMER',
        input: true,
      },
      status: {
        type: 'string',
        enumValues: ['PENDING', 'ACTIVE', 'SUSPENDED'],
        default: 'ACTIVE',
        input: true,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    // requireEmailVerification: true,
  },

  // Email verification
  // emailVerification: {
  //   sendOnSignUp: true,
  //   sendVerificationEmail: async ({ user, url }) => {
  //     void sendEmail({
  //       to: user.email,
  //       subject: 'Verify your email',
  //       html: `
  //         <p>Hello ${user.name ?? user.email},</p>
  //         <p>Click the link below to verify your email:</p>
  //         <a href="${url}">${url}</a>
  //       `,
  //     });
  //   },
  // },
});

// type Session = typeof auth.$Infer.Session;
export default auth;
