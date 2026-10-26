sap.ui.define([
    "sap/ui/core/mvc/ControllerExtension"
], function (
    ControllerExtension
) {
    "use strict";

    return ControllerExtension.extend(
        "animaladoption.user.sprintproject1.ext.controller.UserExtension",
        {
            onHome: function () {
                window.location.assign(
                    "/animaladoption.dashboard.home.landingpage/index.html"
                );
            }
        }
    );
});
