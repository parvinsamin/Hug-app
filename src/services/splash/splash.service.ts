export async function loadSplash(locale: string) {
    try {
        if (locale === "fa") {
            return require("../../assets/splash/splash.fa.json");
        }
        if (locale === "en") {
            return require("../../assets/splash/splash.en.json");
        }

        return require("../../assets/splash/splash.en.json"); // fallback
    } catch (e) {
        // console.log("Error loading splash", e);
        return require("../../assets/splash/splash.en.json");
    }
}
