sap.ui.define([
    "sap/ui/core/mvc/ControllerExtension"
], function (
    ControllerExtension
) {
    "use strict";

    return ControllerExtension.extend(
        "animaladoption.user.sprintproject1.ext.controller.UserExtension",
        {
            // =====================================================
            // HOME
            // =====================================================

            onHome: function () {
                window.location.assign(
                    "/animaladoption.dashboard.home.landingpage/index.html"
                );
            },

            // =====================================================
            // XSUAA SIGN OUT
            // =====================================================

            onSignOut: function () {
                const hostname = window.location.hostname;
                const isLocalCAPDevelopment =
                    window.location.port === "4004" ||
                    hostname.startsWith("port4004-") ||
                    hostname === "localhost" ||
                    hostname === "127.0.0.1";

                window.location.assign(
                    isLocalCAPDevelopment
                        ? "/animaladoption.dashboard.home.landingpage/index.html"
                        : "/do/logout"
                );
            }
        }
    );
});