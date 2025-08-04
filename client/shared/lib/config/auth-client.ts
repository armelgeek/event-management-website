import { createAuthClient } from 'better-auth/react';
import {
    inferAdditionalFields,
} from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000/api/auth",
  plugins: [
        inferAdditionalFields({
            user: {
                isAdmin: { type: 'boolean' },
                firstname: { type: 'string'},
                lastname: { type: 'string'},
            },
        })
    ],
});

export const { useSession } = authClient
