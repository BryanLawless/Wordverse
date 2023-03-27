import { setPageTitle } from "./middleware";
import { DOMAIN_TITLE } from "@/constants/config";
import { createRouter, createWebHistory } from "vue-router";

/* List of all routes */
const routes = [
	{
		name: "home",
		path: "/",
		meta: { title: `${DOMAIN_TITLE} | Home` },
		component: () => import("@/views/Home.vue")
	},
	{
		name: "join",
		path: "/join",
		meta: { title: `${DOMAIN_TITLE} | Join` },
		component: () => import("@/views/Join.vue")
	},
	{
		name: "create",
		path: "/create",
		meta: { title: `${DOMAIN_TITLE} | Create` },
		component: () => import("@/views/Create.vue")
	},
	{
		name: "game",
		path: "/game/:id",
		meta: { title: `${DOMAIN_TITLE} | Play` },
		component: () => import("@/views/Game.vue")
	},
	{
		name: "404",
		path: "/:pathMatch(.*)*",
		meta: { title: `${DOMAIN_TITLE} | Not Found` },
		component: () => import("@/views/NotFound.vue")
	}
];

/* Create the router instance */
const router = createRouter({
	history: createWebHistory(),
	routes
});

/* Set the page title middleware */
router.beforeEach(setPageTitle);

export default router;
