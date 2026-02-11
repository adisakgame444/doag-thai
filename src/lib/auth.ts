// import { betterAuth } from "better-auth";
// import { prismaAdapter } from "better-auth/adapters/prisma";
// import db from "@/lib/db";
// import { sendEmail } from "./email";
// import { createAuthMiddleware, APIError } from "better-auth/api";
// import { passwordSchema } from "./validation";

// export const auth = betterAuth({
//   database: prismaAdapter(db, {
//     provider: "postgresql",
//   }),
//   socialProviders: {
//     google: {
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     },
//     facebook: {
//       // ใหม่
//       clientId: process.env.FACEBOOK_CLIENT_ID!,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
//     },
//   },
//   emailAndPassword: {
//     enabled: true,
//     // requireEmailVerification: true, // บังคับให้ยืนยันอีเมลก่อนเข้าสู่ระบบ
//     async sendResetPassword({ user, url }) {
//       await sendEmail({
//         to: user.email,
//         subject: "Reset your password",
//         text: `Click the link to reset your password: ${url}`,
//       });
//     },
//   },
//   emailVerification: {
//     sendOnSignUp: true,
//     autoSignInAfterVerification: true,
//     async sendVerificationEmail({ user, url }) {
//       await sendEmail({
//         to: user.email,
//         subject: "Verify your email address",
//         text: `Click the link to verify your email: ${url}`,
//       });
//     },
//   },
//   user: {
//     additionalFields: {
//       role: {
//         type: "string",
//         input: false,
//       },
//     },
//   },
//   hooks: {
//     before: createAuthMiddleware(async (ctx) => {
//       if (
//         ctx.path === "/sign-up/email" ||
//         ctx.path === "/reset-password" ||
//         ctx.path === "/change-password"
//       ) {
//         const password = ctx.body.password || ctx.body.newPassword;
//         const { error } = passwordSchema.safeParse(password);
//         if (error) {
//           throw new APIError("BAD_REQUEST", {
//             message: "รหัสผ่านไม่สามารถใช้ได้เนื่องจากไม่มีความปลอดภัยเพียงพอ",
//           });
//         }
//       }
//     }),
//   },
// });

// export type Session = typeof auth.$Infer.Session;
// export type User = typeof auth.$Infer.Session.user;

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import db from "@/lib/db";
import { sendEmail } from "./email";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { passwordSchema } from "./validation";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      mapProfileToUser: (profile: any) => {
        return {
          // ✅ สูตรใหม่: ตัด ID เหลือ 10 ตัวแรก และใช้โดเมนสั้นๆ (@fb)
          email: profile.email ?? `F-${profile.id.slice(0, 10)}@fb`,

          name: profile.name,
          // ส่วนรูปภาพใช้โค้ดเดิมได้เลย (ดีอยู่แล้ว)
          image: profile.picture?.data?.url ?? profile.picture ?? undefined,
        };
      },
    },
    line: {
      clientId: process.env.LINE_CLIENT_ID!,
      clientSecret: process.env.LINE_CLIENT_SECRET!,
      scope: ["profile", "openid", "email"],
      mapProfileToUser: (profile: any) => {
        return {
          // email: profile.email ?? `line_${profile.sub}@noemail.line.local`,
          email: profile.email ?? `L-${profile.sub.slice(0, 10)}@line`,
          name: profile.name,
          image: profile.picture,
        };
      },
    },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (
        ctx.path === "/sign-up/email" ||
        ctx.path === "/reset-password" ||
        ctx.path === "/change-password"
      ) {
        const password = ctx.body.password || ctx.body.newPassword;
        const { error } = passwordSchema.safeParse(password);
        if (error) {
          throw new APIError("BAD_REQUEST", {
            message: "รหัสผ่านไม่สามารถใช้ได้เนื่องจากไม่มีความปลอดภัยเพียงพอ",
          });
        }
      }
    }),
  },

  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, url }) {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
