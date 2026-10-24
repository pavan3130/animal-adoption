sap.ui.define([
    "sap/ui/core/mvc/ControllerExtension"
], function (
    ControllerExtension
) {
    "use strict";

    return ControllerExtension.extend(
        "animaladoption.inspection.inspectionmanagement.ext.controller.InspectionExtension",
        {
            // =====================================================
            // HOME NAVIGATION
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