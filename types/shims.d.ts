// Temporary shims to satisfy TypeScript in offline/editor environments
// Real projects should rely on actual @types packages installed via npm

declare module "react" {
	export = React;
	namespace React {
		interface Attributes { key?: string | number }
		interface ReactNode {}
		interface FC<P = {}> { (props: P): any }
		function useState<T = any>(initial: T | (() => T)): [T, (v: T | ((p: T) => T)) => void];
		function useMemo<T>(factory: () => T, deps: any[]): T;
		function useEffect(effect: () => void | (() => void), deps?: any[]): void;
	}
}

declare module "react/jsx-runtime" {
	export const jsx: any;
	export const jsxs: any;
	export const Fragment: any;
}

declare namespace JSX {
	interface IntrinsicElements {
		[elemName: string]: any;
	}
}

declare module "next/link" {
	const Link: any;
	export default Link;
}

declare module "next/navigation" {
	export const usePathname: any;
	export const useRouter: any;
	export const notFound: any;
}

declare module "next/headers" {
	export const cookies: any;
}

declare module "lucide-react" {
	export const LayoutDashboard: any;
	export const Users: any;
	export const FileText: any;
	export const LineChart: any;
	export const GraduationCap: any;
	export const BookOpen: any;
	export const Bell: any;
}

declare module "recharts" {
	export const PieChart: any;
	export const Pie: any;
	export const Cell: any;
	export const ResponsiveContainer: any;
	export const LineChart: any;
	export const Line: any;
	export const XAxis: any;
	export const YAxis: any;
	export const Tooltip: any;
	export const BarChart: any;
	export const Bar: any;
	export const Legend: any;
	export const CartesianGrid: any;
}


