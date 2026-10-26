sap.ui.define([
    "sap/ui/core/mvc/ControllerExtension"
], function (
    ControllerExtension
) {
    "use strict";

    return ControllerExtension.extend(
        "animaladoption.admin.sprintproject.ext.controller.AdminExtension",
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