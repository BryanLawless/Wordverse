import { createRouter, createWebHistory } from 'vue-router'
import { DOMAIN_TITLE } from '@/constants/Config';

import {
	initCurrentUserState,
	checkAccess,
	setPageTitle
} from './Middleware';

const routes = [
	{
		name: 'home',
		path: '/',
		meta: {
			requiresAuth: false,
			viewLoggedIn: true,
			title: `${DOMAIN_TITLE} | Home`,
			showHeader: true
		},
		component: () => import('@/views/Home.vue'),
	},
	{
		name: 'join',
		path: '/join',
		meta: {
			requiresAuth: true,
			viewLoggedIn: true,
			title: `${DOMAIN_TITLE} | Join`,
			showHeader: true
		},
		component: () => import('@/views/Join.vue'),
	},
	{
		name: 'create',
		path: '/create',
		meta: {
			requiresAuth: true,
			viewLoggedIn: true,
			title: `${DOMAIN_TITLE} | Create`,
			showHeader: true
		},
		component: () => import('@/views/Create.vue'),
	},
	{
		name: 'game',
		path: '/game/:id',
		meta: {
			requiresAuth: true,
			viewLoggedIn: true,
			title: `${DOMAIN_TITLE} | Play`,
			showHeader: false
		},
		component: () => import('@/views/Game.vue')
	},
	/*{
		name: 'login',
		path: '/login',
		meta: {
			requiresAuth: false,
			viewLoggedIn: false,
			title: `${DOMAIN_TITLE} | Login`,
			showHeader: true
		},
		component: () => import('@/views/Login.vue')
	},
	{
		name: 'register',
		path: '/register',
		meta: {
			requiresAuth: false,
			viewLoggedIn: false,
			title: `${DOMAIN_TITLE} | Register`,
			showHeader: true
		},
		component: () => import('@/views/Register.vue')
	},*/
	{
		name: '404',
		path: '/:pathMatch(.*)*',
		meta: {
			requiredAuth: false,
			viewLoggedIn: true,
			title: `${DOMAIN_TITLE} | Not Found`
		},
		component: () => import('@/views/NotFound.vue')
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes
});

//router.beforeEach(initCurrentUserState);
//router.beforeEach(checkAccess);
router.beforeEach(setPageTitle);

export default router;