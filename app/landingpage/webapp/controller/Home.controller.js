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
                 * Local development now uses development-only dummy auth
                 * so the preview does not ask for browser credentials.
                 * Production remains protected by XSUAA through AppRouter.
                 */
                if (
                    this._isLocalDevelopment()
                ) {
                    console.info(
                        sPortalName +
                            " opened with local development authentication."
                    );
                }

                window.location.assign(
                    sTargetPath
                );
            },

            // =====================================================
            // ADMIN PORTAL NAVIGATION
            // =====================================================

            onAdminSignIn: function () {
                this._openProtectedPortal(
                    "/animaladoption.dashboard.admin.admindashboard/index.html",
                    "Admin Portal"
                );
            },

            // =====================================================
            // USER PORTAL NAVIGATION
            // =====================================================

            onUserSignIn: function () {
                this._openProtectedPortal(
                    "/animaladoption.dashboard.user.userdashboard/index.html",
                    "User Portal"
                );
            },

            // =====================================================
            // INSPECTOR PORTAL NAVIGATION
            // =====================================================

            onInspectorSignIn: function () {
                this._openProtectedPortal(
                    "/animaladoption.inspection.inspectionmanagement/index.html",
                    "Inspector Portal"
                );
            }
        }
    );
});