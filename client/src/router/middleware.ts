/**
 * Set the page title based on the route meta data
 * @param {Object} to Instance of the route being navigated to
 * @param {Object} from Instance of the route being navigated from
 * @param {Function} next Callback to continue the navigation flow
 */
export function setPageTitle(to, from, next) {
	const pageTitle = to.matched.find((item) => item.meta.title);

	if (pageTitle) window.document.title = pageTitle.meta.title;
	next();
}
