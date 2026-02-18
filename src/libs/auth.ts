import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import { PrismaClient } from '../../generated/prisma/client';
import { prisma } from '../config/prisma';
import {
  sendEmail,
  // sendVerificationEmailAction,
  verificationEmailTemplate,
} from './sendEmail';
import { User } from '../modules/user/user.types';

// const prisma = new PrismaClient();
const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
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
    requireEmailVerification: true,
  },

  // Email verification
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, token, url }) => {
      // const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;

      void sendEmail({
        to: user.email,
        subject: 'Verify your email',
        html: `
          <p>Hello ${user.name ?? user.email},</p>
          <p>Click the link below to verify your email:</p>
          <a href="${url}">${url}</a>
        `,
      });
    },
  },
});

type Session = typeof auth.$Infer.Session;
export default auth;
