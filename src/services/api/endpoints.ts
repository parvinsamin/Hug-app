export const endpoints = {

    auth: {
        fastRegister: "/authentication/fastRegister",
        login: "/authentication/login",
        logout: "/authentication/logout"
    },

    hugs: {
        list: "/ads/getHugsList",
        create: "/ads/create",
        update: "/ads/update",
        delete: "/ads/delete"
    },
    categories: {
        list: '/category/getTranslatedCategories',
    },
}