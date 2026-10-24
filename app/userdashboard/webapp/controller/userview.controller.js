sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/CustomListItem",
    "sap/m/HBox",
    "sap/m/VBox",
    "sap/m/Text",
    "sap/m/Image",
    "sap/m/Dialog",
    "sap/m/Label",
    "sap/m/TextArea",
    "sap/m/Button",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/m/Popover",
    "sap/m/ObjectIdentifier",
    "sap/m/ObjectStatus",
    "sap/m/OverflowToolbar",
    "sap/m/ToolbarSpacer"
], function (
    Controller,
    JSONModel,
    CustomListItem,
    HBox,
    VBox,
    Text,
    Image,
    Dialog,
    Label,
    TextArea,
    Button,
    MessageToast,
    MessageBox,
    Popover,
    ObjectIdentifier,
    ObjectStatus,
    OverflowToolbar,
    ToolbarSpacer
) {
    "use strict";

    return Controller.extend(
        "animaladoption.dashboard.user.userdashboard.controller.userview",
        {
            // =====================================================
            // INITIALIZATION
            // =====================================================

            onInit: async function () {
                const oDashboardModel = new JSONModel({
                    totalAnimals: 0,
                    availableAnimals: 0,
                    adoptedAnimals: 0,
                    animalsUnderTreatment: 0,
                    totalApplications: 0,
                    totalAdoptions: 0,
                    pendingApplications: 0
                });

                const oSessionModel = new JSONModel({
                    ID: "",
                    firstName: "",
                    lastName: "",
                    email: "",
                    role: "",
                    status: "",
                    displayName: "User"
                });

                this.getView().setModel(
                    oDashboardModel,
                    "dashboard"
                );

                this.getView().setModel(
                    oSessionModel,
                    "session"
                );

                try {
                    await this.loadCurrentUser();
                    await this.loadDashboard();
                } catch (oError) {
                    console.error(
                        "User dashboard initialization failed:",
                        oError
                    );

                    MessageBox.error(
                        oError.message ||
                            "Failed to initialize the user dashboard"
                    );
                }
            },

            // =====================================================
            // CLEANUP
            // =====================================================

            onExit: function () {
                if (this._oProfilePopover) {
                    this._oProfilePopover.destroy();
                    this._oProfilePopover = null;
                }
            },

            // =====================================================
            // COMMON FETCH HELPER
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

                    const sErrorMessage =
                        sBackendMessage ||
                        oResponseData.message ||
                        oResponseData.rawResponse ||
                        "Request failed with status " +
                            oResponse.status;

                    const oError =
                        new Error(sErrorMessage);

                    oError.status =
                        oResponse.status;

                    throw oError;
                }

                return oResponseData;
            },

            // =====================================================
            // CURRENT SIGNED-IN USER
            // =====================================================

            loadCurrentUser: async function () {
                const oResponse =
                    await this._fetchJson(
                        "/odata/v4/user/CurrentUser()"
                    );

                /*
                 * OData functions usually return structured results
                 * directly. The fallback supports responses wrapped
                 * inside a value property.
                 */
                const oUser =
                    oResponse.value &&
                    typeof oResponse.value === "object"
                        ? oResponse.value
                        : oResponse;

                if (oUser.role !== "User") {
                    throw new Error("Adoption User access is required");
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
                        firstName:
                            oUser.firstName || "",
                        lastName:
                            oUser.lastName || "",
                        email:
                            oUser.email || "",
                        role:
                            oUser.role || "",
                        status:
                            oUser.status || "",
                        displayName:
                            sDisplayName ||
                            oUser.email ||
                            "User"
                    });
            },

            _getCurrentUserID: function () {
                return this.getView()
                    .getModel("session")
                    .getProperty("/ID");
            },

            // =====================================================
            // PROFILE POPOVER
            // =====================================================

            onProfilePress: function (oEvent) {
                if (!this._oProfilePopover) {
                    this._oProfilePopover =
                        new Popover({
                            title: "My Profile",
                            placement: "Bottom",
                            contentWidth: "320px",

                            content: [
                                new VBox({
                                    class:
                                        "sapUiMediumMargin",

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
                                            title: "Status",
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

                            footer: new OverflowToolbar({
    content: [
        new Button({
            text: "Home",
            icon: "sap-icon://home",
            type: "Transparent",
            press: this.onHomePress.bind(this)
        }),

        new ToolbarSpacer(),

        new Button({
            text: "Sign Out",
            icon: "sap-icon://log",
            type: "Reject",
            press: this.onSignOut.bind(this)
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
        window.location.assign("/animaladoption.dashboard.home.landingpage/index.html");
        return;
    }

    window.location.assign("/do/logout");
},
            // =====================================================
            // DASHBOARD KPIs
            // =====================================================

            loadDashboard: async function () {
                const oModel = this.getView().getModel("dashboard");
                if (!oModel) return;

                try {
                    const [
                        oAnimalPayload,
                        oTotalApplications,
                        oTotalAdoptions,
                        oPendingApplications
                    ] = await Promise.all([
                        this._fetchJson(
                            "/odata/v4/user/Animals?$select=ID,animalStatus"
                        ),
                        this._fetchJson("/odata/v4/user/MyTotalApplications()"),
                        this._fetchJson("/odata/v4/user/MyTotalAdoptions()"),
                        this._fetchJson("/odata/v4/user/MyPendingApplications()")
                    ]);

                    const aAnimals = Array.isArray(oAnimalPayload.value)
                        ? oAnimalPayload.value
                        : [];
                    const countStatus = (sStatus) =>
                        aAnimals.filter((oAnimal) => oAnimal.animalStatus === sStatus).length;

                    oModel.setData({
                        totalAnimals: aAnimals.length,
                        availableAnimals: countStatus("Available"),
                        adoptedAnimals: countStatus("Adopted"),
                        animalsUnderTreatment: countStatus("Under Treatment"),
                        totalApplications: Number(oTotalApplications.value) || 0,
                        totalAdoptions: Number(oTotalAdoptions.value) || 0,
                        pendingApplications: Number(oPendingApplications.value) || 0
                    });
                } catch (oError) {
                    console.error("Dashboard loading failed:", oError);
                    MessageToast.show(oError.message || "Failed to load dashboard");
                    throw oError;
                }
            },

            // =====================================================
            // REFRESH DASHBOARD
            // =====================================================

            onRefreshDashboard: async function () {
                const oPage =
                    this.byId(
                        "userDashboardPage"
                    );

                oPage.setBusy(true);

                try {
                    await this.loadCurrentUser();
                    await this.loadDashboard();

                    const oAnimalsPanel =
                        this.byId(
                            "availableAnimalsPanel"
                        );

                    const oApplicationsPanel =
                        this.byId(
                            "applicationsPanel"
                        );

                    const oAdoptionsPanel =
                        this.byId(
                            "adoptionsPanel"
                        );

                    if (
                        oAnimalsPanel &&
                        oAnimalsPanel.getVisible()
                    ) {
                        await this
                            .onAvailableAnimalsPress();
                    }

                    if (
                        oApplicationsPanel &&
                        oApplicationsPanel.getVisible()
                    ) {
                        await this
                            .onApplicationsTilePress();
                    }

                    if (
                        oAdoptionsPanel &&
                        oAdoptionsPanel.getVisible()
                    ) {
                        await this
                            .onAdoptionsTilePress();
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

            // =====================================================
            // AVAILABLE ANIMALS
            // =====================================================

            onAvailableAnimalsPress:
                async function () {
                    const oPanel =
                        this.byId(
                            "availableAnimalsPanel"
                        );

                    const oList =
                        this.byId(
                            "availableAnimalsList"
                        );

                    oPanel.setVisible(true);
                    oPanel.setExpanded(true);

                    oList.removeAllItems();
                    oList.setBusy(true);

                    try {
                        const oData =
                            await this._fetchJson(
                                "/odata/v4/user/Animals?$orderby=name"
                            );

                        const aAnimals =
                            Array.isArray(
                                oData.value
                            )
                                ? oData.value
                                : [];

                        oList.setNoDataText(
                            "No animal profiles are currently available"
                        );

                        aAnimals.forEach(
                            (oAnimal) => {
                                const oAnimalDetails =
                                    new VBox({
                                        width: "420px",

                                        items: [
                                            new Image({
                                                src: oAnimal.photo || "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=480&q=80",
                                                width: "7rem",
                                                height: "6rem",
                                                decorative: false,
                                                densityAware: false
                                            }),
                                            new Text({
                                                text: oAnimal.name || "Unnamed Animal",
                                                class: "sapUiTinyMarginTop"
                                            }),
                                            new Text({
                                                text: (oAnimal.species || "Unknown species") +
                                                    " | " + (oAnimal.breed || "Unknown breed")
                                            }),
                                            new Text({
                                                text: "Gender: " + (oAnimal.gender || "Unknown") +
                                                    " | Age: " + (oAnimal.age ?? "Unknown") +
                                                    " | Arrived: " + (oAnimal.arrivalDate || "Unknown")
                                            }),
                                            new Text({
                                                text: "Vaccination: " + (oAnimal.vaccinationStatus || "Unknown") +
                                                    " | Spayed/neutered: " + (oAnimal.spayedOrNeutered || "Unknown")
                                            }),
                                            new ObjectStatus({
                                                text: oAnimal.animalStatus || "Unknown status",
                                                state: oAnimal.animalStatus === "Available" ? "Success" :
                                                    (oAnimal.animalStatus === "Adopted" ? "Information" : "Warning")
                                            }),
                                            new Text({
                                                text: oAnimal.description || "No description available",
                                                wrapping: true
                                            })
                                        ]
                                    });

                                const oApplyButton =
                                    new Button({
                                        text: oAnimal.animalStatus === "Available" ? "Apply to adopt" : (oAnimal.animalStatus || "Unavailable"),
                                        enabled: oAnimal.animalStatus === "Available",
                                        type: oAnimal.animalStatus === "Available" ? "Emphasized" : "Transparent",

                                        icon:
                                            "sap-icon://add-document",

                                        class:
                                            "sapUiMediumMarginBegin",

                                        press:
                                            this.onApplyForAnimal.bind(
                                                this,
                                                oAnimal
                                            )
                                    });

                                oList.addItem(
                                    new CustomListItem({
                                        content: [
                                            new HBox({
                                                width:
                                                    "100%",

                                                alignItems:
                                                    "Center",

                                                justifyContent:
                                                    "SpaceBetween",

                                                wrap:
                                                    "Wrap",

                                                items: [
                                                    oAnimalDetails,
                                                    oApplyButton
                                                ]
                                            })
                                        ]
                                    })
                                );
                            }
                        );
                    } catch (oError) {
                        console.error(
                            "Animal directory loading failed:",
                            oError
                        );

                        oList.setNoDataText(
                            "Unable to load animal profiles"
                        );

                        MessageToast.show(
                            oError.message ||
                                "Failed to load animal directory"
                        );
                    } finally {
                        oList.setBusy(false);
                    }
                },

            onCloseAvailableAnimals:
                function () {
                    const oPanel =
                        this.byId(
                            "availableAnimalsPanel"
                        );

                    if (oPanel) {
                        oPanel.setVisible(false);
                    }
                },

            // =====================================================
            // APPLY FOR ADOPTION
            // =====================================================

            onApplyForAnimal: function (
                oAnimal
            ) {
                if (!oAnimal || oAnimal.animalStatus !== "Available") {
                    MessageToast.show("Only animals marked Available can be adopted.");
                    return;
                }

                const oSession =
                    this.getView()
                        .getModel("session")
                        .getData();

                if (!oSession.ID) {
                    MessageBox.error(
                        "The signed-in user profile could not be loaded."
                    );

                    return;
                }

                const oReason =
                    new TextArea({
                        width: "100%",
                        rows: 3,
                        maxLength: 500,
                        growing: true,
                        growingMaxLines: 5,

                        placeholder:
                            "Explain why you want to adopt this animal"
                    });

                const oHousing =
                    new TextArea({
                        width: "100%",
                        rows: 3,
                        maxLength: 500,
                        growing: true,
                        growingMaxLines: 5,

                        placeholder:
                            "Describe your housing arrangements"
                    });

                const oExperience =
                    new TextArea({
                        width: "100%",
                        rows: 3,
                        maxLength: 500,
                        growing: true,
                        growingMaxLines: 5,

                        placeholder:
                            "Describe your previous pet experience"
                    });

                const oDialogContent =
                    new VBox({
                        width: "100%",
                        class:
                            "sapUiSmallMargin",

                        items: [
                            new Label({
                                text:
                                    "Applicant"
                            }),

                            new Text({
                                text:
                                    oSession.displayName +
                                    " - " +
                                    oSession.email
                            }),

                            new Label({
                                text:
                                    "Reason For Adoption",

                                labelFor:
                                    oReason,

                                required:
                                    true,

                                class:
                                    "sapUiSmallMarginTop"
                            }),

                            oReason,

                            new Label({
                                text:
                                    "Housing Details",

                                labelFor:
                                    oHousing,

                                required:
                                    true,

                                class:
                                    "sapUiSmallMarginTop"
                            }),

                            oHousing,

                            new Label({
                                text:
                                    "Pet Experience",

                                labelFor:
                                    oExperience,

                                required:
                                    true,

                                class:
                                    "sapUiSmallMarginTop"
                            }),

                            oExperience
                        ]
                    });

                const oDialog =
                    new Dialog({
                        title:
                            "Apply For Adoption - " +
                            (
                                oAnimal.name ||
                                "Animal"
                            ),

                        contentWidth:
                            "500px",

                        content: [
                            oDialogContent
                        ],

                        beginButton:
                            new Button({
                                text:
                                    "Submit",

                                type:
                                    "Emphasized",

                                press:
                                    async () => {
                                        const sReason =
                                            oReason
                                                .getValue()
                                                .trim();

                                        const sHousing =
                                            oHousing
                                                .getValue()
                                                .trim();

                                        const sExperience =
                                            oExperience
                                                .getValue()
                                                .trim();

                                        if (
                                            !sReason ||
                                            !sHousing ||
                                            !sExperience
                                        ) {
                                            MessageToast.show(
                                                "Please complete all required fields"
                                            );

                                            return;
                                        }

                                        const oSubmitButton =
                                            oDialog
                                                .getBeginButton();

                                        oSubmitButton
                                            .setEnabled(
                                                false
                                            );

                                        oDialog.setBusy(
                                            true
                                        );

                                        try {
                                            await this._fetchJson(
                                                "/odata/v4/user/SubmitApplication",
                                                {
                                                    method:
                                                        "POST",

                                                    headers:
                                                        {
                                                            "Content-Type":
                                                                "application/json",

                                                            "Accept":
                                                                "application/json"
                                                        },

                                                    body:
                                                        JSON.stringify(
                                                            {
                                                                animalID:
                                                                    oAnimal.ID,

                                                                reasonForAdoption:
                                                                    sReason,

                                                                housingDetails:
                                                                    sHousing,

                                                                petExperience:
                                                                    sExperience
                                                            }
                                                        )
                                                }
                                            );

                                            MessageToast.show(
                                                "Application submitted successfully for " +
                                                    (
                                                        oAnimal.name ||
                                                        "the animal"
                                                    )
                                            );

                                            oDialog.close();

                                            await this
                                                .loadDashboard();

                                            const oApplicationsPanel =
                                                this.byId(
                                                    "applicationsPanel"
                                                );

                                            if (
                                                oApplicationsPanel &&
                                                oApplicationsPanel
                                                    .getVisible()
                                            ) {
                                                await this
                                                    .onApplicationsTilePress();
                                            }
                                        } catch (oError) {
                                            console.error(
                                                "Application submission failed:",
                                                oError
                                            );

                                            MessageToast.show(
                                                oError.message ||
                                                    "Failed to submit application"
                                            );
                                        } finally {
                                            oDialog.setBusy(
                                                false
                                            );

                                            oSubmitButton
                                                .setEnabled(
                                                    true
                                                );
                                        }
                                    }
                            }),

                        endButton:
                            new Button({
                                text:
                                    "Cancel",

                                press:
                                    function () {
                                        oDialog.close();
                                    }
                            }),

                        afterClose:
                            function () {
                                oDialog.destroy();
                            }
                    });

                oDialog.open();
            },

            // =====================================================
            // MY APPLICATIONS
            // =====================================================

            onApplicationsTilePress:
                async function () {
                    const sApplicantID =
                        this._getCurrentUserID();

                    if (!sApplicantID) {
                        MessageBox.error(
                            "The signed-in user ID is unavailable."
                        );

                        return;
                    }

                    const oPanel =
                        this.byId(
                            "applicationsPanel"
                        );

                    const oList =
                        this.byId(
                            "applicationsList"
                        );

                    oPanel.setVisible(true);
                    oPanel.setExpanded(true);

                    oList.removeAllItems();
                    oList.setBusy(true);

                    try {
                        const sFilter =
                            encodeURIComponent(
                                "applicant_ID eq " +
                                    sApplicantID
                            );

                        const oData =
                            await this._fetchJson(
                                "/odata/v4/user/AdoptionApplications" +
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
                            "No adoption applications found for your account"
                        );

                        aApplications.forEach(
                            (oApplication) => {
                                const sStatus =
                                    oApplication.status ||
                                    "Unknown";

                                const sDate =
                                    oApplication.applicationDate ||
                                    "Not available";

                                const sReason =
                                    oApplication.reasonForAdoption ||
                                    "Not provided";

                                const bCanWithdraw =
                                    sStatus ===
                                        "Submitted" ||
                                    sStatus ===
                                        "Under Review";

                                let sState =
                                    "None";

                                if (
                                    sStatus ===
                                        "Approved"
                                ) {
                                    sState =
                                        "Success";
                                } else if (
                                    sStatus ===
                                        "Submitted" ||
                                    sStatus ===
                                        "Under Review"
                                ) {
                                    sState =
                                        "Warning";
                                } else if (
                                    sStatus ===
                                        "Rejected" ||
                                    sStatus ===
                                        "Withdrawn"
                                ) {
                                    sState =
                                        "Error";
                                }

                                const oApplicationInfo =
                                    new VBox({
                                        width:
                                            "420px",

                                        items: [
                                            new ObjectStatus({
                                                title:
                                                    "Status",

                                                text:
                                                    sStatus,

                                                state:
                                                    sState
                                            }),

                                            new Text({
                                                text:
                                                    "Application Date: " +
                                                    sDate
                                            }),

                                            new Text({
                                                text:
                                                    "Reason: " +
                                                    sReason,

                                                wrapping:
                                                    true
                                            })
                                        ]
                                    });

                                const aRowItems = [
                                    oApplicationInfo
                                ];

                                if (
                                    bCanWithdraw
                                ) {
                                    aRowItems.push(
                                        new Button({
                                            text:
                                                "Withdraw",

                                            type:
                                                "Reject",

                                            icon:
                                                "sap-icon://decline",

                                            class:
                                                "sapUiMediumMarginBegin",

                                            press:
                                                this.onWithdrawApplication.bind(
                                                    this,
                                                    oApplication
                                                )
                                        })
                                    );
                                }

                                oList.addItem(
                                    new CustomListItem({
                                        content: [
                                            new HBox({
                                                width:
                                                    "100%",

                                                alignItems:
                                                    "Center",

                                                justifyContent:
                                                    "SpaceBetween",

                                                wrap:
                                                    "Wrap",

                                                items:
                                                    aRowItems
                                            })
                                        ]
                                    })
                                );
                            }
                        );
                    } catch (oError) {
                        console.error(
                            "Applications loading failed:",
                            oError
                        );

                        oList.setNoDataText(
                            "Unable to load applications"
                        );

                        MessageToast.show(
                            oError.message ||
                                "Failed to load applications"
                        );
                    } finally {
                        oList.setBusy(false);
                    }
                },

            onCloseApplications:
                function () {
                    const oPanel =
                        this.byId(
                            "applicationsPanel"
                        );

                    if (oPanel) {
                        oPanel.setVisible(false);
                    }
                },

            // =====================================================
            // MY ADOPTIONS
            // =====================================================

            onAdoptionsTilePress:
                async function () {
                    const sApplicantID =
                        this._getCurrentUserID();

                    if (!sApplicantID) {
                        MessageBox.error(
                            "The signed-in user ID is unavailable."
                        );

                        return;
                    }

                    const oPanel =
                        this.byId(
                            "adoptionsPanel"
                        );

                    const oList =
                        this.byId(
                            "adoptionsList"
                        );

                    oPanel.setVisible(true);
                    oPanel.setExpanded(true);

                    oList.removeAllItems();
                    oList.setBusy(true);

                    try {
                        const sApplicationFilter =
                            encodeURIComponent(
                                "applicant_ID eq " +
                                    sApplicantID +
                                    " and status eq 'Approved'"
                            );

                        const oApplicationsData =
                            await this._fetchJson(
                                "/odata/v4/user/AdoptionApplications" +
                                "?$filter=" +
                                sApplicationFilter
                            );

                        const aApprovedApplications =
                            Array.isArray(
                                oApplicationsData.value
                            )
                                ? oApplicationsData.value
                                : [];

                        oList.setNoDataText(
                            "No completed adoptions found for your account"
                        );

                        if (
                            aApprovedApplications
                                .length === 0
                        ) {
                            return;
                        }

                        const oAdoptionsData =
                            await this._fetchJson(
                                "/odata/v4/user/Adoptions" +
                                "?$orderby=adoptionDate%20desc"
                            );

                        const aAdoptions =
                            Array.isArray(
                                oAdoptionsData.value
                            )
                                ? oAdoptionsData.value
                                : [];

                        const aApplicationIDs =
                            aApprovedApplications.map(
                                (
                                    oApplication
                                ) =>
                                    oApplication.ID
                            );

                        const aUserAdoptions =
                            aAdoptions.filter(
                                (oAdoption) =>
                                    aApplicationIDs.includes(
                                        oAdoption.application_ID
                                    )
                            );

                        aUserAdoptions.forEach(
                            (oAdoption) => {
                                const oAdoptionInfo =
                                    new VBox({
                                        width:
                                            "100%",

                                        items: [
                                            new ObjectStatus({
                                                title:
                                                    "Status",

                                                text:
                                                    oAdoption.status ||
                                                    "Completed",

                                                state:
                                                    "Success"
                                            }),

                                            new Text({
                                                text:
                                                    "Adoption Date: " +
                                                    (
                                                        oAdoption.adoptionDate ||
                                                        "Not available"
                                                    )
                                            }),

                                            new Text({
                                                text:
                                                    "Completed By: " +
                                                    (
                                                        oAdoption.completedBy ||
                                                        "Admin"
                                                    )
                                            }),

                                            new Text({
                                                text:
                                                    "Remarks: " +
                                                    (
                                                        oAdoption.remarks ||
                                                        "No remarks"
                                                    ),

                                                wrapping:
                                                    true
                                            })
                                        ]
                                    });

                                oList.addItem(
                                    new CustomListItem({
                                        content: [
                                            oAdoptionInfo
                                        ]
                                    })
                                );
                            }
                        );
                    } catch (oError) {
                        console.error(
                            "Adoptions loading failed:",
                            oError
                        );

                        oList.setNoDataText(
                            "Unable to load adoptions"
                        );

                        MessageToast.show(
                            oError.message ||
                                "Failed to load adoptions"
                        );
                    } finally {
                        oList.setBusy(false);
                    }
                },

            onCloseAdoptions:
                function () {
                    const oPanel =
                        this.byId(
                            "adoptionsPanel"
                        );

                    if (oPanel) {
                        oPanel.setVisible(false);
                    }
                },

            // =====================================================
            // WITHDRAW APPLICATION
            // =====================================================

            onWithdrawApplication:
                function (oApplication) {
                    MessageBox.confirm(
                        "Do you want to withdraw this adoption application?",
                        {
                            title:
                                "Withdraw Application",

                            emphasizedAction:
                                MessageBox.Action.OK,

                            actions: [
                                MessageBox.Action.OK,
                                MessageBox.Action.CANCEL
                            ],

                            onClose:
                                async (
                                    sAction
                                ) => {
                                    if (
                                        sAction !==
                                        MessageBox.Action.OK
                                    ) {
                                        return;
                                    }

                                    try {
                                        await this._fetchJson(
                                            "/odata/v4/user/WithdrawApplication",
                                            {
                                                method:
                                                    "POST",

                                                headers:
                                                    {
                                                        "Content-Type":
                                                            "application/json",

                                                        "Accept":
                                                            "application/json"
                                                    },

                                                body:
                                                    JSON.stringify(
                                                        {
                                                            applicationID:
                                                                oApplication.ID
                                                        }
                                                    )
                                            }
                                        );

                                        MessageToast.show(
                                            "Application withdrawn successfully"
                                        );

                                        await this
                                            .loadDashboard();

                                        await this
                                            .onApplicationsTilePress();
                                    } catch (oError) {
                                        console.error(
                                            "Application withdrawal failed:",
                                            oError
                                        );

                                        MessageToast.show(
                                            oError.message ||
                                                "Failed to withdraw application"
                                        );
                                    }
                                }
                        }
                    );
                },

                       // =====================================================
            // NAVIGATION
            // =====================================================

            onAnimalsPress: function () {
                this.onAvailableAnimalsPress();
            },

            onApplicationsPress: function () {
                this.onApplicationsTilePress();
            },

            onUserAppPress: function () {
                window.location.assign(
                    "/animaladoption.user.sprintproject1/index.html"
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