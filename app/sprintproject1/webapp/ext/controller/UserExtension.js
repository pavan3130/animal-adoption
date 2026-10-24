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
                window.location.assign(
                    "/do/logout"
                );
            }
        }
    );
});