/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	async rewrites() {
		return [
			{
				source: "/grafana/:path*",
				destination: `${process.env.GRAFANA_INTERNAL_URL ?? "http://grafana:3000"}/:path*`,
			},
		];
	},
};

export default nextConfig;
