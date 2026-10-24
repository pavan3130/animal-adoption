sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/CustomListItem",
    "sap/m/HBox",
    "sap/m/VBox",
    "sap/m/Text",
    "sap/m/Button",
    "sap/m/ObjectStatus",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/m/Popover",
    "sap/m/ObjectIdentifier",
    "sap/m/OverflowToolbar",
    "sap/m/ToolbarSpacer"
], function (
    Controller,
    JSONModel,
    CustomListItem,
    HBox,
    VBox,
    Text,
    Button,
    ObjectStatus,
    MessageToast,
    MessageBox,
    Popover,
    ObjectIdentifier,
    OverflowToolbar,
    ToolbarSpacer
) {
    "use strict";

    return Controller.extend(
        "animaladoption.dashboard.admin.admindashboard.controller.Dashboard",
        {

            // =====================================================
            // INITIALIZATION
            // =====================================================
onInit: async function () {
    this._currentDetailsLoader = null;

    const oDashboardModel =
        new JSONModel({
            totalAnimals: 0,
            availableAnimals: 0,
            adoptedAnimals: 0,
            animalsUnderTreatment: 0,
            pendingApplications: 0,
            totalShelters: 0,
            totalInspections: 0,
            totalAdoptions: 0,
            totalHealthRecords: 0,
            detailsTitle: "Details"
        });

    const oSessionModel =
        new JSONModel({
            ID: "",
            firstName: "",
            lastName: "",
            email: "",
            role: "",
            status: "",
            displayName: "Administrator"
        });

    this.getView().setModel(
        oDashboardModel,
        "dashboard"
    );

    this.getView().setModel(
        oSessionModel,
        "session"
    );

    const oPage =
        this.byId("dashboardPage");

    oPage.setBusy(true);

    try {
        await this.loadCurrentAdministrator();
        await this.loadDashboard();
        await this.loadRecentAdoptions();
    } catch (oError) {
        console.error(
            "Admin Dashboard initialization failed:",
            oError
        );

        MessageBox.error(
            oError.message ||
                "Failed to initialize the Admin Dashboard"
        );
    } finally {
        oPage.setBusy(false);
    }
},
onExit: function () {
    if (this._oProfilePopover) {
        this._oProfilePopover.destroy();
        this._oProfilePopover = null;
    }
},

            // =====================================================
            // FETCH HELPER
            // =====================================================

            _fetchJson: async function (
                sUrl,
                mOptions
            ) {
                const oResponse = await fetch(
    sUrl,
    {
        credentials: "same-origin",
        ...mOptions
    }
);

                const sResponseText =
                    await oResponse.text();

                let oResponseData = {};

                if (sResponseText) {
                    try {
                        oResponseData =
                            JSON.parse(sResponseText);
                    } catch (oParseError) {
                        oResponseData = {
                            rawResponse: sResponseText
                        };
                    }
                }

                if (!oResponse.ok) {
                    const vBackendMessage =
                        oResponseData.error?.message;

                    const sBackendMessage =
                        typeof vBackendMessage === "string"
                            ? vBackendMessage
                            : vBackendMessage?.value;

                    throw new Error(
                        sBackendMessage ||
                        oResponseData.message ||
                        oResponseData.rawResponse ||
                        "Request failed with status " +
                            oResponse.status
                    );
                }

                return oResponseData;
            },
            // =====================================================
// CURRENT ADMINISTRATOR
// =====================================================

loadCurrentAdministrator: async function () {
    const oResponse =
        await this._fetchJson(
            "/odata/v4/session/CurrentSession()"
        );

    const oUser =
        oResponse.value &&
        typeof oResponse.value === "object"
            ? oResponse.value
            : oResponse;

    if (oUser.role !== "Admin") {
        throw new Error(
            "Administrator access is required"
        );
    }

    const sDisplayName = [
        oUser.firstName,
        oUser.lastName
    ]
        .filter(Boolean)
        .join(" ");

    this.getView()
        .getModel("session")
        .setData({
            ID: oUser.ID || "",
            firstName: oUser.firstName || "",
            lastName: oUser.lastName || "",
            email: oUser.email || "",
            role: oUser.role || "",
            status: oUser.status || "",
            displayName:
                sDisplayName ||
                oUser.email ||
                "Administrator"
        });
},
// =====================================================
// ADMINISTRATOR PROFILE
// =====================================================

onProfilePress: function (oEvent) {
    if (!this._oProfilePopover) {
        this._oProfilePopover =
            new Popover({
                title: "Administrator Profile",
                placement: "Bottom",
                contentWidth: "330px",

                content: [
                    new VBox({
                        class: "sapUiMediumMargin",

                        items: [
                            new ObjectIdentifier({
                                title:
                                    "{session>/displayName}",

                                text:
                                    "{session>/email}"
                            }),

                            new ObjectStatus({
                                title: "Role",
                                text:
                                    "{session>/role}",

                                state:
                                    "Information",

                                class:
                                    "sapUiSmallMarginTop"
                            }),

                            new ObjectStatus({
                                title: "Account Status",
                                text:
                                    "{session>/status}",

                                state:
                                    "Success",

                                class:
                                    "sapUiTinyMarginTop"
                            })
                        ]
                    })
                ],

                footer:
                    new OverflowToolbar({
                        content: [
                            new Button({
                                text: "Home",
                                icon:
                                    "sap-icon://home",

                                type:
                                    "Transparent",

                                press:
                                    this.onHomePress.bind(
                                        this
                                    )
                            }),

                            new ToolbarSpacer(),

                            new Button({
                                text: "Sign Out",
                                icon:
                                    "sap-icon://log",

                                type: "Reject",

                                press:
                                    this.onSignOut.bind(
                                        this
                                    )
                            })
                        ]
                    })
            });

        this.getView().addDependent(
            this._oProfilePopover
        );
    }

    this._oProfilePopover.openBy(
        oEvent.getSource()
    );
},
onSignOut: function () {
    if (this._oProfilePopover) {
        this._oProfilePopover.close();
    }

    const hostname = window.location.hostname;
    const isLocalCAPDevelopment =
        window.location.port === "4004" ||
        hostname.startsWith("port4004-") ||
        hostname === "localhost" ||
        hostname === "127.0.0.1";

    if (isLocalCAPDevelopment) {
        MessageBox.information(
            "Local BAS testing uses CAP mock authentication (HTTP Basic), which the browser caches. The /do/logout endpoint is handled by the deployed AppRouter, not by cds watch. To test another account locally, open this app in a private/incognito window or use a separate browser profile. Sign Out will use the AppRouter when the app is deployed."
        );
        return;
    }

    window.location.assign("/do/logout");
},

            // =====================================================
            // LOAD DASHBOARD
            // =====================================================

            loadDashboard: async function () {
                const oModel =
                    this.getView().getModel("dashboard");

                if (!oModel) {
                    return;
                }

                try {
                    const [
                        oTotalAnimals,
                        oAvailableAnimals,
                        oAdoptedAnimals,
                        oUnderTreatment,
                        oPendingApplications,
                        oTotalShelters,
                        oTotalInspections,
                        oTotalAdoptions,
                        oTotalHealthRecords
                    ] = await Promise.all([
                        this._fetchJson(
                            "/odata/v4/admin/TotalAnimals()"
                        ),

                        this._fetchJson(
                            "/odata/v4/admin/AvailableAnimals()"
                        ),

                        this._fetchJson(
                            "/odata/v4/admin/AdoptedAnimals()"
                        ),

                        this._fetchJson(
                            "/odata/v4/admin/AnimalsUnderTreatment()"
                        ),

                        this._fetchJson(
                            "/odata/v4/admin/PendingApplications()"
                        ),

                        this._fetchJson(
                            "/odata/v4/admin/TotalShelters()"
                        ),

                        this._fetchJson(
                            "/odata/v4/admin/TotalInspections()"
                        ),

                        this._fetchJson(
                            "/odata/v4/admin/TotalAdoptions()"
                        ),

                        this._fetchJson(
                            "/odata/v4/admin/TotalHealthRecords()"
                        )
                    ]);

                    oModel.setProperty(
                        "/totalAnimals",
                        Number(oTotalAnimals.value) || 0
                    );

                    oModel.setProperty(
                        "/availableAnimals",
                        Number(oAvailableAnimals.value) || 0
                    );

                    oModel.setProperty(
                        "/adoptedAnimals",
                        Number(oAdoptedAnimals.value) || 0
                    );

                    oModel.setProperty(
                        "/animalsUnderTreatment",
                        Number(oUnderTreatment.value) || 0
                    );

                    oModel.setProperty(
                        "/pendingApplications",
                        Number(oPendingApplications.value) || 0
                    );

                    oModel.setProperty(
                        "/totalShelters",
                        Number(oTotalShelters.value) || 0
                    );

                    oModel.setProperty(
                        "/totalInspections",
                        Number(oTotalInspections.value) || 0
                    );

                    oModel.setProperty(
                        "/totalAdoptions",
                        Number(oTotalAdoptions.value) || 0
                    );

                    oModel.setProperty(
                        "/totalHealthRecords",
                        Number(oTotalHealthRecords.value) || 0
                    );

                } catch (oError) {
                    console.error(
                        "Admin dashboard loading failed:",
                        oError
                    );

                    MessageToast.show(
                        oError.message ||
                            "Failed to load dashboard"
                    );
                }
            },

            // =====================================================
            // REFRESH
            // =====================================================

            onRefreshDashboard: async function () {
                const oPage =
                    this.byId("dashboardPage");

                oPage.setBusy(true);

                try {
                    await this.loadCurrentAdministrator();
                    await this.loadDashboard();
                    await this.loadRecentAdoptions();

                    if (this._currentDetailsLoader) {
                        await this
                            ._currentDetailsLoader();
                    }

                    MessageToast.show(
                        "Dashboard refreshed"
                    );

                } catch (oError) {
                    console.error(
                        "Dashboard refresh failed:",
                        oError
                    );

                    MessageToast.show(
                        oError.message ||
                            "Failed to refresh dashboard"
                    );

                } finally {
                    oPage.setBusy(false);
                }
            },

            onRefreshDetails: async function () {
                if (!this._currentDetailsLoader) {
                    return;
                }

                await this._currentDetailsLoader();
            },

            onCloseDetails: function () {
                const oPanel =
                    this.byId("detailsPanel");

                const oList =
                    this.byId("detailsList");

                oPanel.setVisible(false);
                oList.removeAllItems();

                this._currentDetailsLoader = null;
            },

            // =====================================================
            // DETAILS HELPERS
            // =====================================================

            _openDetailsPanel: function (
                sTitle,
                fnLoader
            ) {
                const oModel =
                    this.getView().getModel("dashboard");

                const oPanel =
                    this.byId("detailsPanel");

                oModel.setProperty(
                    "/detailsTitle",
                    sTitle
                );

                oPanel.setVisible(true);
                oPanel.setExpanded(true);

                this._currentDetailsLoader =
                    fnLoader.bind(this);

                return this._currentDetailsLoader();
            },

            _createStatus: function (sStatus) {
                let sState = "None";

                switch (sStatus) {
                    case "Available":
                    case "Approved":
                    case "Completed":
                    case "Healthy":
                    case "Passed":
                        sState = "Success";
                        break;

                    case "Submitted":
                    case "Under Review":
                    case "Pending":
                    case "Under Treatment":
                        sState = "Warning";
                        break;

                    case "Rejected":
                    case "Failed":
                    case "Withdrawn":
                        sState = "Error";
                        break;

                    default:
                        sState = "None";
                }

                return new ObjectStatus({
                    text: sStatus || "Unknown",
                    state: sState
                });
            },

            _addDetailItem: function (
                sTitle,
                sDescription,
                sStatus,
                fnPress
            ) {
                const oList =
                    this.byId("detailsList");

                const aItems = [
                    new VBox({
                        width: "420px",

                        items: [
                            new Text({
                                text:
                                    sTitle ||
                                    "Record"
                            }),

                            new Text({
                                text:
                                    sDescription ||
                                    ""
                            })
                        ]
                    })
                ];

                if (sStatus) {
                    aItems.push(
                        this._createStatus(
                            sStatus
                        )
                    );
                }

                if (fnPress) {
                    aItems.push(
                        new Button({
                            text: "Open",
                            type: "Emphasized",
                            class:
                                "sapUiMediumMarginBegin",
                            press: fnPress
                        })
                    );
                }

                oList.addItem(
                    new CustomListItem({
                        content: [
                            new HBox({
                                width: "100%",
                                alignItems: "Center",
                                justifyContent: "Start",
                                wrap: "Wrap",
                                items: aItems
                            })
                        ]
                    })
                );
            },

            // =====================================================
            // ANIMALS
            // =====================================================

            onTotalAnimalsPress: function () {
                return this._openDetailsPanel(
                    "All Animals",
                    this._loadAllAnimals
                );
            },

            onAvailableAnimalsPress: function () {
                return this._openDetailsPanel(
                    "Available Animals",
                    this._loadAvailableAnimals
                );
            },

            onAdoptedAnimalsPress: function () {
                return this._openDetailsPanel(
                    "Adopted Animals",
                    this._loadAdoptedAnimals
                );
            },

            onUnderTreatmentPress: function () {
                return this._openDetailsPanel(
                    "Animals Under Treatment",
                    this._loadTreatmentAnimals
                );
            },

            _loadAnimals: async function (
                sFilter
            ) {
                const oList =
                    this.byId("detailsList");

                oList.removeAllItems();
                oList.setBusy(true);

                try {
                    let sUrl =
                        "/odata/v4/admin/Animals" +
                        "?$orderby=name";

                    if (sFilter) {
                        sUrl +=
                            "&$filter=" +
                            encodeURIComponent(
                                sFilter
                            );
                    }

                    const oData =
                        await this._fetchJson(
                            sUrl
                        );

                    const aAnimals =
                        Array.isArray(oData.value)
                            ? oData.value
                            : [];

                    oList.setNoDataText(
                        "No animals found"
                    );

                    aAnimals.forEach(
                        (oAnimal) => {
                            this._addDetailItem(
                                oAnimal.name ||
                                    "Unnamed Animal",

                                [
                                    oAnimal.species || "Unknown species",
                                    oAnimal.breed || "Unknown breed",
                                    "Gender: " + (oAnimal.gender || "Unknown"),
                                    "Age: " + (oAnimal.age ?? "Unknown"),
                                    "Arrived: " + (oAnimal.arrivalDate || "Unknown"),
                                    "Vaccination: " + (oAnimal.vaccinationStatus || "Unknown"),
                                    "Spayed/neutered: " + (oAnimal.spayedOrNeutered || "Unknown"),
                                    oAnimal.description || "No description available"
                                ].join(" | "),

                                oAnimal.animalStatus
                            );
                        }
                    );

                } catch (oError) {
                    console.error(
                        "Animals loading failed:",
                        oError
                    );

                    MessageToast.show(
                        oError.message ||
                            "Failed to load animals"
                    );

                } finally {
                    oList.setBusy(false);
                }
            },

            _loadAllAnimals: function () {
                return this._loadAnimals("");
            },

            _loadAvailableAnimals: function () {
                return this._loadAnimals(
                    "animalStatus eq 'Available'"
                );
            },

            _loadAdoptedAnimals: function () {
                return this._loadAnimals(
                    "animalStatus eq 'Adopted'"
                );
            },

            _loadTreatmentAnimals: function () {
                return this._loadAnimals(
                    "animalStatus eq 'Under Treatment'"
                );
            },

            // =====================================================
            // PENDING APPLICATIONS
            // =====================================================

            onPendingApplicationsPress: function () {
                return this._openDetailsPanel(
                    "Pending Applications",
                    this._loadPendingApplications
                );
            },

            _loadPendingApplications:
                async function () {
                    const oList =
                        this.byId("detailsList");

                    oList.removeAllItems();
                    oList.setBusy(true);

                    try {
                        const sFilter =
                            encodeURIComponent(
                                "status eq 'Submitted' or " +
                                "status eq 'Under Review'"
                            );

                        const oData =
                            await this._fetchJson(
                                "/odata/v4/admin/AdoptionApplications" +
                                "?$filter=" +
                                sFilter +
                                "&$orderby=applicationDate%20desc"
                            );

                        const aApplications =
                            Array.isArray(
                                oData.value
                            )
                                ? oData.value
                                : [];

                        oList.setNoDataText(
                            "No pending applications found"
                        );

                        aApplications.forEach(
                            (oApplication) => {
                                this._addDetailItem(
                                    "Application Date: " +
                                        (
                                            oApplication
                                                .applicationDate ||
                                            "Not available"
                                        ),

                                    "Reason: " +
                                        (
                                            oApplication
                                                .reasonForAdoption ||
                                            "Not provided"
                                        ),

                                    oApplication.status,

                                    this.onWorkflowPress.bind(
                                        this
                                    )
                                );
                            }
                        );

                    } catch (oError) {
                        console.error(
                            "Applications loading failed:",
                            oError
                        );

                        MessageToast.show(
                            oError.message ||
                                "Failed to load applications"
                        );

                    } finally {
                        oList.setBusy(false);
                    }
                },

            // =====================================================
            // SHELTERS
            // =====================================================

            onSheltersPress: function () {
                return this._openDetailsPanel(
                    "Shelters",
                    this._loadShelters
                );
            },

            _loadShelters: async function () {
                const oList =
                    this.byId("detailsList");

                oList.removeAllItems();
                oList.setBusy(true);

                try {
                    const oData =
                        await this._fetchJson(
                            "/odata/v4/admin/Shelters" +
                            "?$orderby=shelterName"
                        );

                    const aShelters =
                        Array.isArray(oData.value)
                            ? oData.value
                            : [];

                    oList.setNoDataText(
                        "No shelters found"
                    );

                    aShelters.forEach(
                        (oShelter) => {
                            this._addDetailItem(
                                oShelter.shelterName ||
                                    "Unnamed Shelter",

                                (
                                    oShelter.city ||
                                    "Unknown city"
                                ) +
                                    " | Capacity: " +
                                    (
                                        oShelter.capacity ??
                                        0
                                    ) +
                                    " | Occupancy: " +
                                    (
                                        oShelter.currentOccupancy ??
                                        0
                                    ),

                                null
                            );
                        }
                    );

                } catch (oError) {
                    console.error(
                        "Shelters loading failed:",
                        oError
                    );

                    MessageToast.show(
                        oError.message ||
                            "Failed to load shelters"
                    );

                } finally {
                    oList.setBusy(false);
                }
            },

            // =====================================================
            // INSPECTIONS
            // =====================================================

            onInspectionsPress: function () {
                return this._openDetailsPanel(
                    "Inspections",
                    this._loadInspections
                );
            },

            _loadInspections:
                async function () {
                    const oList =
                        this.byId("detailsList");

                    oList.removeAllItems();
                    oList.setBusy(true);

                    try {
                        const oData =
                            await this._fetchJson(
                                "/odata/v4/admin/Inspections" +
                                "?$orderby=inspectionDate%20desc"
                            );

                        const aInspections =
                            Array.isArray(
                                oData.value
                            )
                                ? oData.value
                                : [];

                        oList.setNoDataText(
                            "No inspection records found"
                        );

                        aInspections.forEach(
                            (oInspection) => {
                                this._addDetailItem(
                                    oInspection
                                        .inspectionType ||
                                        "Inspection",

                                    "Date: " +
                                        (
                                            oInspection
                                                .inspectionDate ||
                                            "Not available"
                                        ) +
                                        " | Remarks: " +
                                        (
                                            oInspection
                                                .remarks ||
                                            "No remarks"
                                        ),

                                    oInspection.result
                                );
                            }
                        );

                    } catch (oError) {
                        console.error(
                            "Inspections loading failed:",
                            oError
                        );

                        MessageToast.show(
                            oError.message ||
                                "Failed to load inspections"
                        );

                    } finally {
                        oList.setBusy(false);
                    }
                },

            // =====================================================
            // ADOPTIONS
            // =====================================================

            onAdoptionsPress: function () {
                return this._openDetailsPanel(
                    "All Adoptions",
                    this._loadAdoptions
                );
            },

            _loadAdoptions: async function () {
                const oList =
                    this.byId("detailsList");

                oList.removeAllItems();
                oList.setBusy(true);

                try {
                    const oData =
                        await this._fetchJson(
                            "/odata/v4/admin/Adoptions" +
                            "?$orderby=adoptionDate%20desc"
                        );

                    const aAdoptions =
                        Array.isArray(oData.value)
                            ? oData.value
                            : [];

                    oList.setNoDataText(
                        "No adoption records found"
                    );

                    aAdoptions.forEach(
                        (oAdoption) => {
                            this._addDetailItem(
                                "Adoption Date: " +
                                    (
                                        oAdoption
                                            .adoptionDate ||
                                        "Not available"
                                    ),

                                "Completed By: " +
                                    (
                                        oAdoption
                                            .completedBy ||
                                        "Not available"
                                    ) +
                                    " | Remarks: " +
                                    (
                                        oAdoption
                                            .remarks ||
                                        "No remarks"
                                    ),

                                oAdoption.status
                            );
                        }
                    );

                } catch (oError) {
                    console.error(
                        "Adoptions loading failed:",
                        oError
                    );

                    MessageToast.show(
                        oError.message ||
                            "Failed to load adoptions"
                    );

                } finally {
                    oList.setBusy(false);
                }
            },

            loadRecentAdoptions:
                async function () {
                    const oList =
                        this.byId(
                            "recentAdoptionsList"
                        );

                    oList.removeAllItems();
                    oList.setBusy(true);

                    try {
                        const oData =
                            await this._fetchJson(
                                "/odata/v4/admin/Adoptions" +
                                "?$orderby=adoptionDate%20desc" +
                                "&$top=5"
                            );

                        const aAdoptions =
                            Array.isArray(
                                oData.value
                            )
                                ? oData.value
                                : [];

                        oList.setNoDataText(
                            "No recent adoptions found"
                        );

                        aAdoptions.forEach(
                            (oAdoption) => {
                                oList.addItem(
                                    new CustomListItem({
                                        content: [
                                            new HBox({
                                                width:
                                                    "100%",

                                                alignItems:
                                                    "Center",

                                                justifyContent:
                                                    "Start",

                                                wrap:
                                                    "Wrap",

                                                items: [
                                                    new VBox({
                                                        width:
                                                            "420px",

                                                        items: [
                                                            new Text({
                                                                text:
                                                                    "Adoption Date: " +
                                                                    (
                                                                        oAdoption
                                                                            .adoptionDate ||
                                                                        "Not available"
                                                                    )
                                                            }),

                                                            new Text({
                                                                text:
                                                                    "Completed By: " +
                                                                    (
                                                                        oAdoption
                                                                            .completedBy ||
                                                                        "Not available"
                                                                    )
                                                            })
                                                        ]
                                                    }),

                                                    this._createStatus(
                                                        oAdoption.status
                                                    )
                                                ]
                                            })
                                        ]
                                    })
                                );
                            }
                        );

                    } catch (oError) {
                        console.error(
                            "Recent adoptions loading failed:",
                            oError
                        );

                        MessageToast.show(
                            oError.message ||
                                "Failed to load recent adoptions"
                        );

                    } finally {
                        oList.setBusy(false);
                    }
                },

            // =====================================================
            // HEALTH RECORDS
            // =====================================================

            onHealthRecordsPress: function () {
                return this._openDetailsPanel(
                    "Health Records",
                    this._loadHealthRecords
                );
            },

            _loadHealthRecords:
                async function () {
                    const oList =
                        this.byId("detailsList");

                    oList.removeAllItems();
                    oList.setBusy(true);

                    try {
                        const oData =
                            await this._fetchJson(
                                "/odata/v4/admin/HealthRecords" +
                                "?$orderby=checkupDate%20desc"
                            );

                        const aRecords =
                            Array.isArray(
                                oData.value
                            )
                                ? oData.value
                                : [];

                        oList.setNoDataText(
                            "No health records found"
                        );

                        aRecords.forEach(
                            (oRecord) => {
                                this._addDetailItem(
                                    oRecord.diagnosis ||
                                        "Health Record",

                                    "Checkup Date: " +
                                        (
                                            oRecord
                                                .checkupDate ||
                                            "Not available"
                                        ) +
                                        " | Treatment: " +
                                        (
                                            oRecord
                                                .treatment ||
                                            "Not provided"
                                        ) +
                                        " | Veterinarian: " +
                                        (
                                            oRecord
                                                .veterinarianName ||
                                            "Not provided"
                                        ),

                                    oRecord.healthStatus
                                );
                            }
                        );

                    } catch (oError) {
                        console.error(
                            "Health records loading failed:",
                            oError
                        );

                        MessageToast.show(
                            oError.message ||
                                "Failed to load health records"
                        );

                    } finally {
                        oList.setBusy(false);
                    }
                },

                                    // =====================================================
            // NAVIGATION
            // =====================================================

            onAdminAppPress: function () {
                window.location.assign(
                    "/animaladoption.admin.sprintproject/index.html"
                );
            },

            onWorkflowPress: function () {
                window.location.assign(
                    "/animaladoption.workflow.admin.applicationworkflow/index.html"
                );
            },

            onHealthManagementPress: function () {
                window.location.assign(
                    "/animaladoption.health.admin.healthmanagement/index.html"
                );
            },

            onInspectionManagementPress: function () {
                window.location.assign(
                    "/animaladoption.inspection.inspectionmanagement/index.html"
                );
            },

            onHomePress: function () {
                if (this._oProfilePopover) {
                    this._oProfilePopover.close();
                }

                window.location.assign(
                    "/animaladoption.dashboard.home.landingpage/index.html"
                );
            }

        }
    );
});