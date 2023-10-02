/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  async headers() {
    return [
      {
        source: "/api/checkout", // Adjust the source path accordingly
        headers: [
          {
            key: "Content-Security-Policy",
            value: "script-src 'self' https://pay.google.com 'unsafe-inline'",
          },
        ],
      },
    ];
  },
};
