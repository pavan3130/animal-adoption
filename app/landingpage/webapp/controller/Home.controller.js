sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], function (
    Controller,
    MessageBox
) {
    "use strict";

    return Controller.extend(
        "animaladoption.dashboard.home.landingpage.controller.Home",
        {
            // =====================================================
            // INITIALIZATION
            // =====================================================

            onInit: function () {
                /*
                 * The landing page is intentionally public.
                 *
                 * Do not call CurrentSession() here because doing so
                 * would trigger authentication before the visitor
                 * selects a portal.
                 *
                 * Authentication starts when a protected portal route
                 * is opened.
                 */
            },

            // =====================================================
            // ENVIRONMENT HELPER
            // =====================================================

            _isLocalDevelopment: function () {
                const sHostname =
                    window.location.hostname;

                return (
                    sHostname === "localhost" ||
                    sHostname === "127.0.0.1" ||
                    sHostname.endsWith(
                        ".applicationstudio.cloud.sap"
                    )
                );
            },

            _openProtectedPortal: function (
                sTargetPath,
                sPortalName
            ) {
                if (!sTargetPath) {
                    MessageBox.error(
                        "The portal route is unavailable."
                    );

                    return;
                }

                /*
                 * In a deployed SAP BTP environment, the App Router
                 * intercepts this protected route and starts the
                 * XSUAA authentication flow.
                 *
                 * In local development, CAP mocked authentication
                 * may show a browser credential prompt instead.
                 */
                if (
                    this._isLocalDevelopment()
                ) {
                    console.info(
                        sPortalName +
                            " opened locally. CAP dummy authentication is used only during development."
                    );
                }

                window.location.assign(
                    sTargetPath
                );
            },

            // =====================================================
            // OPEN ADMIN PORTAL
            // =====================================================

            onOpenAdminPortal: function () {
                this._openProtectedPortal(
                    "/animaladoption.dashboard.admin.admindashboard/index.html",
                    "Admin Portal"
                );
            },

            // =====================================================
            // OPEN USER PORTAL
            // =====================================================

            onOpenUserPortal: function () {
                this._openProtectedPortal(
                    "/animaladoption.dashboard.user.userdashboard/index.html",
                    "User Portal"
                );
            },

            // =====================================================
            // OPEN INSPECTOR PORTAL
            // =====================================================

            onOpenInspectorPortal: function () {
                this._openProtectedPortal(
                    "/animaladoption.inspection.inspectionmanagement/index.html",
                    "Inspector Portal"
                );
            }
        }
    );
});