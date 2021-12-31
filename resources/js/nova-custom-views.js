import routes from './router/routes'
Nova.booting((Vue, router) => {
    router.beforeEach((to, from, next) => {
        console.log(to.name)
        var toName = to.name.replace(/custom-/g, '');
        let customComponent = null;
        let resourceCustomViews = (window.config.novaCustomViews)? window.config.novaCustomViews[to.params.resourceName] : null
        let globalViews = ['dashboard', '403', '404'];
        if(globalViews.includes(toName)) {
            customComponent = window.config["novaCustom" + toName.charAt(0).toUpperCase() + toName.slice(1)]
        } else {
            customComponent = (resourceCustomViews && resourceCustomViews[toName])? resourceCustomViews[toName]['name'] : null
        }
        if(customComponent && Vue.options.components[customComponent] &&
            to.params.component != customComponent) {
            next({
                name: 'custom-' + toName,
                params: Object.assign({},to.params, {
                    component: customComponent
                }),
                query: to.query
            });
        } else {
            next();
        }
    })
    router.addRoutes(routes)
})
