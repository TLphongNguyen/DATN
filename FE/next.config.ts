import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	reactStrictMode: false,

	images: {
		domains: [
			'gamek.mediacdn.vn',
			'tiki.vn',
			'www.youtube.com',
			'firebasestorage.googleapis.com',
			'sgvkftuhdvhqhkxjxbon.supabase.co',
			'jpesrdrgrcqjeqavqxrj.supabase.co',
			'zbibrtzipjlnmgotkxzq.supabase.co',
			'frontend.tikicdn.com',
			'salt.tikicdn.com',
			'images.remotePatterns',
			'i0.wp.com',
			'lh3.googleusercontent.com',
		],
	},
};

export default nextConfig;
