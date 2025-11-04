import type { FastifyReply } from 'fastify';

export const setAuthCookies = (
  reply: FastifyReply,
  accessToken: string,
  refreshToken: string,
) => {
  // domain에서 프로토콜과 포트 모두 제거
  const getDomain = (url: string) => {
    return url.replace(/^https?:\/\//, '').replace(/:\d+$/, '');
  };

  const cookieOptions = {
    path: '/',
    httpOnly: true,
    ...(process.env.NODE_ENV === 'production'
      ? {
          domain: getDomain(process.env.CORS_ORIGIN_DOMAIN_PROD || ''),
          sameSite: 'none' as const,
          secure: true,
        }
      : {
          sameSite: 'lax' as const,
          secure: false,
        }),
  };

  reply.setCookie('accessToken', accessToken, cookieOptions);
  reply.setCookie('refreshToken', refreshToken, cookieOptions);
};
