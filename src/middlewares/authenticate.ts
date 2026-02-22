import { fromNodeHeaders } from 'better-auth/node';
import auth from '../libs/auth';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

const authenticate = asyncHandler(async (req, _res, next) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    throw new ApiError(401, 'Unauthenticated: No active session found');
  }

  if (session.user.status !== 'ACTIVE') {
    throw new ApiError(403, 'Forbidden: User account is not active');
  }

  req.user = session.user;

  next();
});

export default authenticate;
