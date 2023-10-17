/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  // async headers() {
  //   return [
  //     {
  //       source: "/(.*)",
  //       headers: [
  //         {
  //           key: "Content-Security-Policy",
  //           value:
  //             "script-src 'self' https://pay.google.com 'nonce-random_nonce'",
  //         },
  //       ],
  //     },
  //   ];
  // },
};
