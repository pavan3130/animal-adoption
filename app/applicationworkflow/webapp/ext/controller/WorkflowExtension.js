sap.ui.define([
    "sap/ui/core/mvc/ControllerExtension"
], function (
    ControllerExtension
) {
    "use strict";

    return ControllerExtension.extend(
        "aanimaladoption.workflow.admin.applicationworkflow.ext.controller.WorkflowExtension",
        {
            onHome: function () {
                window.location.assign(
                    "/animaladoption.dashboard.home.landingpage/index.html"
                );
            },

            onSignOut: function () {
                window.location.assign(
                    "/do/logout"
                );
            }
        }
    );
});