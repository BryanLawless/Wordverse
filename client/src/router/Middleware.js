import { useAuthStore } from '@/stores/Auth';

export async function initCurrentUserState(to, from, next) {
	const authStore = useAuthStore();

	if (authStore.hasToken() && authStore.email.length == 0) {
		await authStore.getCurrent();
		next();
	} else {
		next();
	}
}

export async function checkAccess(to, from, next) {
	const authStore = useAuthStore();
	const hasAuth = to.matched.some(route => route.meta.requiresAuth);
	const viewLoggedIn = to.matched.some(route => route.meta.viewLoggedIn);

	console.log(viewLoggedIn)

	//if (!viewLoggedIn) return next({ name: 'home' });
	if (authStore.hasToken() && authStore.email) return next();
	if (hasAuth) return next({ name: 'login' });

	next();
}

export function setPageTitle(to, from, next) {
	const pageTitle = to.matched.find(item => item.meta.title);

	if (pageTitle) window.document.title = pageTitle.meta.title;
	next();
}