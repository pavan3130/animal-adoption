import cds from "@sap/cds";

const { SELECT, INSERT, UPDATE, DELETE } = cds.ql;

export default cds.service.impl(async function () {
    const {
        Users,
        Shelters,
        Animals,
        AdoptionApplications,
        Adoptions,
        HealthRecords,
        Inspections
    } = cds.entities("animaladoption");

    const today = () =>
        new Date().toISOString().slice(0, 10);
// =====================================================
// AUTHENTICATED USER HELPER
// =====================================================

const getSignedInUser = async (req) => {
    const userID =
        req.user?.id?.trim();

    if (
        !userID ||
        userID === "anonymous"
    ) {
        return req.reject(
            401,
            "Authentication is required"
        );
    }

    const user = await SELECT.one
        .from(Users)
        .where({
            email: userID
        });

    if (!user) {
        return req.reject(
            404,
            "No application profile exists for the signed-in account"
        );
    }

    if (user.status !== "Active") {
        return req.reject(
            403,
            "The signed-in user profile is not active"
        );
    }

    return user;
};


    // =====================================================
    // USERS
    // =====================================================

    this.on("CreateUser", async (req) => {
        await INSERT.into(Users).entries({
            firstName: req.data.firstName,
            lastName: req.data.lastName,
            email: req.data.email,
            phoneNumber: req.data.phoneNumber,
            address: req.data.address,
            city: req.data.city,
            state: req.data.state,
            postalCode: req.data.postalCode,
            role: req.data.role,
            status: req.data.status
        });

        return "User Created";
    });

    this.on("UpdateUser", async (req) => {
        const { userID, ...data } = req.data;

        const affectedRows = await UPDATE(Users)
            .set(data)
            .where({ ID: userID });

        if (!affectedRows) {
            return req.reject(404, "User not found");
        }

        return "User Updated";
    });

    this.on("DeleteUser", async (req) => {
        const affectedRows = await DELETE
            .from(Users)
            .where({ ID: req.data.userID });

        if (!affectedRows) {
            return req.reject(404, "User not found");
        }

        return "User Deleted";
    });

    // =====================================================
    // SHELTERS
    // =====================================================

    this.on("CreateShelter", async (req) => {
        await INSERT.into(Shelters).entries({
            ...req.data,
            currentOccupancy: 0
        });

        return "Shelter Created";
    });

    this.on("UpdateShelter", async (req) => {
        const { shelterID, ...data } = req.data;

        const affectedRows = await UPDATE(Shelters)
            .set(data)
            .where({ ID: shelterID });

        if (!affectedRows) {
            return req.reject(404, "Shelter not found");
        }

        return "Shelter Updated";
    });

    this.on("DeleteShelter", async (req) => {
        const linkedAnimal = await SELECT.one
            .from(Animals)
            .where({
                shelter_ID: req.data.shelterID
            });

        if (linkedAnimal) {
            return req.reject(
                409,
                "The shelter cannot be deleted because animals are assigned to it"
            );
        }

        const affectedRows = await DELETE
            .from(Shelters)
            .where({ ID: req.data.shelterID });

        if (!affectedRows) {
            return req.reject(404, "Shelter not found");
        }

        return "Shelter Deleted";
    });

    // =====================================================
    // ANIMALS
    // =====================================================

    this.on("CreateAnimal", async (req) => {
        if (req.data.shelterID) {
            const shelter = await SELECT.one
                .from(Shelters)
                .where({
                    ID: req.data.shelterID
                });

            if (!shelter) {
                return req.reject(
                    404,
                    "Shelter not found"
                );
            }
        }

        await INSERT.into(Animals).entries({
            shelter_ID: req.data.shelterID,
            name: req.data.name,
            species: req.data.species,
            breed: req.data.breed,
            gender: req.data.gender,
            age: req.data.age,
            arrivalDate: today(),
            animalStatus: "Available",
            vaccinationStatus:
                req.data.vaccinationStatus,
            spayedOrNeutered:
                req.data.spayedOrNeutered,
            description: req.data.description
        });

        return "Animal Created";
    });

    this.on("UpdateAnimal", async (req) => {
        const { animalID, ...data } = req.data;

        const affectedRows = await UPDATE(Animals)
            .set(data)
            .where({ ID: animalID });

        if (!affectedRows) {
            return req.reject(404, "Animal not found");
        }

        return "Animal Updated";
    });

    this.on("DeleteAnimal", async (req) => {
        const linkedApplication = await SELECT.one
            .from(AdoptionApplications)
            .where({
                animal_ID: req.data.animalID
            });

        if (linkedApplication) {
            return req.reject(
                409,
                "The animal cannot be deleted because applications reference it"
            );
        }

        const affectedRows = await DELETE
            .from(Animals)
            .where({ ID: req.data.animalID });

        if (!affectedRows) {
            return req.reject(404, "Animal not found");
        }

        return "Animal Deleted";
    });

    // =====================================================
    // APPLICATION CRUD
    // =====================================================

    this.on("CreateApplication", async (req) => {
        const animal = await SELECT.one
            .from(Animals)
            .where({ ID: req.data.animalID });

        if (!animal) {
            return req.reject(404, "Animal not found");
        }

        if (animal.animalStatus !== "Available") {
            return req.reject(
                400,
                "Applications can only be created for available animals"
            );
        }

        if (req.data.applicantID) {
            const applicant = await SELECT.one
                .from(Users)
                .where({
                    ID: req.data.applicantID
                });

            if (!applicant) {
                return req.reject(
                    404,
                    "Applicant not found"
                );
            }
        }

        await INSERT
            .into(AdoptionApplications)
            .entries({
                animal_ID: req.data.animalID,
                applicant_ID:
                    req.data.applicantID,
                reasonForAdoption:
                    req.data.reasonForAdoption,
                housingDetails:
                    req.data.housingDetails,
                petExperience:
                    req.data.petExperience,
                applicationDate: today(),
                status: "Submitted",
                reviewedBy: "",
                staffRemarks: ""
            });

        return "Application Created";
    });

    this.on("UpdateApplication", async (req) => {
        const { applicationID, ...data } = req.data;

        const affectedRows =
            await UPDATE(AdoptionApplications)
                .set(data)
                .where({ ID: applicationID });

        if (!affectedRows) {
            return req.reject(
                404,
                "Application not found"
            );
        }

        return "Application Updated";
    });

    this.on("DeleteApplication", async (req) => {
        const existingAdoption = await SELECT.one
            .from(Adoptions)
            .where({
                application_ID:
                    req.data.applicationID
            });

        if (existingAdoption) {
            return req.reject(
                409,
                "The application cannot be deleted because an adoption exists"
            );
        }

        const affectedRows =
            await DELETE
                .from(AdoptionApplications)
                .where({
                    ID: req.data.applicationID
                });

        if (!affectedRows) {
            return req.reject(
                404,
                "Application not found"
            );
        }

        return "Application Deleted";
    });
// =====================================================
// CURRENT AUTHENTICATED SESSION
// =====================================================

this.on("CurrentSession", async (req) => {
    const user =
        await getSignedInUser(req);

    return {
        ID: user.ID,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status
    };
});

// =====================================================
// CURRENT SIGNED-IN USER
// =====================================================

this.on("CurrentUser", async (req) => {
    const user =
        await getSignedInUser(req);

    if (user.role !== "User") {
        return req.reject(
            403,
            "Only adoption users can access the user dashboard"
        );
    }

    return {
        ID: user.ID,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status
    };
});

// =====================================================
// USER-SPECIFIC KPI FUNCTIONS
// =====================================================

this.on(
    "MyTotalApplications",
    async (req) => {
        const user =
            await getSignedInUser(req);

        const applications =
            await SELECT
                .from(AdoptionApplications)
                .where({
                    applicant_ID: user.ID
                });

        return applications.length;
    }
);

this.on(
    "MyPendingApplications",
    async (req) => {
        const user =
            await getSignedInUser(req);

        const applications =
            await SELECT
                .from(AdoptionApplications)
                .where({
                    applicant_ID: user.ID
                });

        return applications.filter(
            (application) =>
                application.status === "Submitted" ||
                application.status === "Under Review"
        ).length;
    }
);

this.on(
    "MyTotalAdoptions",
    async (req) => {
        const user =
            await getSignedInUser(req);

        const applications =
            await SELECT
                .from(AdoptionApplications)
                .columns("ID")
                .where({
                    applicant_ID: user.ID
                });

        if (applications.length === 0) {
            return 0;
        }

        const applicationIDs =
            applications.map(
                (application) =>
                    application.ID
            );

        const adoptions =
            await SELECT.from(Adoptions);

        return adoptions.filter(
            (adoption) =>
                applicationIDs.includes(
                    adoption.application_ID
                )
        ).length;
    }
);
// =====================================================
// AUTHENTICATED USER APPLICATION SUBMISSION
// =====================================================

this.on(
    "SubmitApplication",
    async (req) => {
        const {
            animalID,
            reasonForAdoption,
            housingDetails,
            petExperience
        } = req.data;

        const applicant =
            await getSignedInUser(req);

        if (applicant.role !== "User") {
            return req.reject(
                403,
                "Only adoption users can submit applications"
            );
        }

        if (!animalID) {
            return req.reject(
                400,
                "Animal ID is required"
            );
        }

        if (!reasonForAdoption?.trim()) {
            return req.reject(
                400,
                "Reason for adoption is required"
            );
        }

        if (!housingDetails?.trim()) {
            return req.reject(
                400,
                "Housing details are required"
            );
        }

        if (!petExperience?.trim()) {
            return req.reject(
                400,
                "Pet experience is required"
            );
        }

        const animal = await SELECT.one
            .from(Animals)
            .where({
                ID: animalID
            });

        if (!animal) {
            return req.reject(
                404,
                "Animal not found"
            );
        }

        if (
            animal.animalStatus !==
            "Available"
        ) {
            return req.reject(
                400,
                "The selected animal is no longer available"
            );
        }

        const existingApplications =
            await SELECT
                .from(AdoptionApplications)
                .where({
                    applicant_ID:
                        applicant.ID,

                    animal_ID:
                        animalID
                });

        const activeApplication =
            existingApplications.find(
                (application) =>
                    application.status ===
                        "Submitted" ||
                    application.status ===
                        "Under Review"
            );

        if (activeApplication) {
            return req.reject(
                409,
                "You already have an active application for this animal"
            );
        }

        await INSERT
            .into(AdoptionApplications)
            .entries({
                applicant_ID:
                    applicant.ID,

                animal_ID:
                    animalID,

                reasonForAdoption:
                    reasonForAdoption.trim(),

                housingDetails:
                    housingDetails.trim(),

                petExperience:
                    petExperience.trim(),

                applicationDate:
                    today(),

                status:
                    "Submitted",

                reviewedBy:
                    "",

                staffRemarks:
                    ""
            });

        return "Application Submitted";
    }
);
    // =====================================================
    // BOUND APPLICATION WORKFLOW
    // =====================================================

    this.on(
        "Review",
        "AdoptionApplications",
        async (req) => {
            const applicationID =
                req.params?.[0]?.ID;

            if (!applicationID) {
                return req.reject(
                    400,
                    "Application ID is missing"
                );
            }

            const application = await SELECT.one
                .from(AdoptionApplications)
                .where({ ID: applicationID });

            if (!application) {
                return req.reject(
                    404,
                    "Application not found"
                );
            }

            if (
                application.status !== "Submitted"
            ) {
                return req.reject(
                    400,
                    "Only submitted applications can be reviewed"
                );
            }

            await UPDATE(AdoptionApplications)
                .set({
                    status: "Under Review",
                    reviewedBy: "Admin",
                    staffRemarks:
                        "Application is under review"
                })
                .where({ ID: applicationID });

            return "Application Under Review";
        }
    );

    this.on(
        "Reject",
        "AdoptionApplications",
        async (req) => {
            const applicationID =
                req.params?.[0]?.ID;

            if (!applicationID) {
                return req.reject(
                    400,
                    "Application ID is missing"
                );
            }

            const application = await SELECT.one
                .from(AdoptionApplications)
                .where({ ID: applicationID });

            if (!application) {
                return req.reject(
                    404,
                    "Application not found"
                );
            }

            if (
                application.status !== "Submitted" &&
                application.status !== "Under Review"
            ) {
                return req.reject(
                    400,
                    "Only active applications can be rejected"
                );
            }

            await UPDATE(AdoptionApplications)
                .set({
                    status: "Rejected",
                    reviewedBy: "Admin",
                    staffRemarks:
                        "Application rejected by admin"
                })
                .where({ ID: applicationID });

            return "Application Rejected";
        }
    );

    this.on(
        "Approve",
        "AdoptionApplications",
        async (req) => {
            const applicationID =
                req.params?.[0]?.ID;

            if (!applicationID) {
                return req.reject(
                    400,
                    "Application ID is missing"
                );
            }

            const tx = cds.tx(req);

            const application = await tx.run(
                SELECT.one
                    .from(AdoptionApplications)
                    .where({ ID: applicationID })
            );

            if (!application) {
                return req.reject(
                    404,
                    "Application not found"
                );
            }

            if (
                application.status !== "Submitted" &&
                application.status !== "Under Review"
            ) {
                return req.reject(
                    400,
                    "Only active applications can be approved"
                );
            }

            if (!application.animal_ID) {
                return req.reject(
                    400,
                    "Application is not linked to an animal"
                );
            }

            const animal = await tx.run(
                SELECT.one
                    .from(Animals)
                    .where({
                        ID: application.animal_ID
                    })
            );

            if (!animal) {
                return req.reject(
                    404,
                    "Animal not found"
                );
            }

            if (animal.animalStatus !== "Available") {
                return req.reject(
                    400,
                    "The selected animal is no longer available"
                );
            }

            const existingAdoption = await tx.run(
                SELECT.one
                    .from(Adoptions)
                    .where({
                        application_ID: applicationID
                    })
            );

            if (existingAdoption) {
                return req.reject(
                    409,
                    "An adoption already exists for this application"
                );
            }

            await tx.run(
                UPDATE(AdoptionApplications)
                    .set({
                        status: "Approved",
                        reviewedBy: "Admin",
                        staffRemarks:
                            "Application approved"
                    })
                    .where({ ID: applicationID })
            );

            await tx.run(
                INSERT.into(Adoptions).entries({
                    application_ID: applicationID,
                    animal_ID:
                        application.animal_ID,
                    adoptionDate: today(),
                    status: "Completed",
                    completedBy: "Admin",
                    remarks:
                        "Created from approved adoption application"
                })
            );

            await tx.run(
                UPDATE(Animals)
                    .set({
                        animalStatus: "Adopted"
                    })
                    .where({
                        ID: application.animal_ID
                    })
            );

            const relatedApplications = await tx.run(
                SELECT.from(AdoptionApplications)
                    .columns("ID", "status")
                    .where({
                        animal_ID:
                            application.animal_ID
                    })
            );

            const competingApplications =
                relatedApplications.filter(
                    (otherApplication) =>
                        otherApplication.ID !==
                            applicationID &&
                        (
                            otherApplication.status ===
                                "Submitted" ||
                            otherApplication.status ===
                                "Under Review"
                        )
                );

            for (
                const competingApplication
                of competingApplications
            ) {
                await tx.run(
                    UPDATE(AdoptionApplications)
                        .set({
                            status: "Rejected",
                            reviewedBy: "System",
                            staffRemarks:
                                "Another application for this animal was approved"
                        })
                        .where({
                            ID:
                                competingApplication.ID
                        })
                );
            }

            return "Application Approved";
        }
    );
// =====================================================
// APPLICATION WITHDRAWAL
// =====================================================

this.on(
    "WithdrawApplication",
    async (req) => {
        const applicationID =
            req.data.applicationID;

        if (!applicationID) {
            return req.reject(
                400,
                "Application ID is required"
            );
        }

        const application =
            await SELECT.one
                .from(AdoptionApplications)
                .where({
                    ID: applicationID
                });

        if (!application) {
            return req.reject(
                404,
                "Application not found"
            );
        }

        const isAdmin =
            req.user?.is?.("Admin");

        if (!isAdmin) {
            const signedInUser =
                await getSignedInUser(req);

            if (
                application.applicant_ID !==
                signedInUser.ID
            ) {
                return req.reject(
                    403,
                    "You cannot withdraw another user's application"
                );
            }
        }

        if (
            application.status !==
                "Submitted" &&
            application.status !==
                "Under Review"
        ) {
            return req.reject(
                400,
                "Only submitted or under-review applications can be withdrawn"
            );
        }

        await UPDATE(AdoptionApplications)
            .set({
                status: "Withdrawn",

                staffRemarks: isAdmin
                    ? "Application withdrawn by admin"
                    : "Application withdrawn by user"
            })
            .where({
                ID: applicationID
            });

        return "Application Withdrawn";
    }
);

    // =====================================================
    // ADOPTIONS
    // =====================================================

    this.on("CreateAdoption", async (req) => {
        const application = await SELECT.one
            .from(AdoptionApplications)
            .where({
                ID: req.data.applicationID
            });

        if (!application) {
            return req.reject(
                404,
                "Application not found"
            );
        }

        const animal = await SELECT.one
            .from(Animals)
            .where({
                ID: req.data.animalID
            });

        if (!animal) {
            return req.reject(
                404,
                "Animal not found"
            );
        }

        const existingAdoption = await SELECT.one
            .from(Adoptions)
            .where({
                application_ID:
                    req.data.applicationID
            });

        if (existingAdoption) {
            return req.reject(
                409,
                "An adoption already exists"
            );
        }

        await INSERT.into(Adoptions).entries({
            application_ID:
                req.data.applicationID,
            animal_ID: req.data.animalID,
            adoptionDate: today(),
            status: "Completed",
            remarks: req.data.remarks
        });

        return "Adoption Created";
    });

    this.on("UpdateAdoption", async (req) => {
        const { adoptionID, ...data } = req.data;

        const affectedRows = await UPDATE(Adoptions)
            .set(data)
            .where({ ID: adoptionID });

        if (!affectedRows) {
            return req.reject(
                404,
                "Adoption not found"
            );
        }

        return "Adoption Updated";
    });

    this.on("DeleteAdoption", async (req) => {
        const linkedInspection = await SELECT.one
            .from(Inspections)
            .where({
                adoption_ID: req.data.adoptionID
            });

        if (linkedInspection) {
            return req.reject(
                409,
                "The adoption cannot be deleted because inspections reference it"
            );
        }

        const affectedRows = await DELETE
            .from(Adoptions)
            .where({
                ID: req.data.adoptionID
            });

        if (!affectedRows) {
            return req.reject(
                404,
                "Adoption not found"
            );
        }

        return "Adoption Deleted";
    });

    // =====================================================
    // HEALTH RECORDS
    // =====================================================

    this.on("CreateHealthRecord", async (req) => {
        const animal = await SELECT.one
            .from(Animals)
            .where({
                ID: req.data.animalID
            });

        if (!animal) {
            return req.reject(
                404,
                "Animal not found"
            );
        }

        const hasTreatment =
            Boolean(req.data.treatment?.trim());

        await INSERT.into(HealthRecords).entries({
            animal_ID: req.data.animalID,
            diagnosis: req.data.diagnosis,
            treatment: req.data.treatment,
            medication: req.data.medication,
            veterinarianName:
                req.data.veterinarianName,
            weight: req.data.weight,
            remarks: req.data.remarks,
            checkupDate: today(),
            healthStatus: hasTreatment
                ? "Under Treatment"
                : "Healthy"
        });

        if (hasTreatment) {
            await UPDATE(Animals)
                .set({
                    animalStatus:
                        "Under Treatment"
                })
                .where({
                    ID: req.data.animalID
                });
        }

        return "Health Record Created";
    });

    this.on("UpdateHealthRecord", async (req) => {
        const { recordID, ...data } = req.data;

        const affectedRows =
            await UPDATE(HealthRecords)
                .set(data)
                .where({ ID: recordID });

        if (!affectedRows) {
            return req.reject(
                404,
                "Health record not found"
            );
        }

        return "Health Record Updated";
    });

    this.on("DeleteHealthRecord", async (req) => {
        const affectedRows = await DELETE
            .from(HealthRecords)
            .where({
                ID: req.data.recordID
            });

        if (!affectedRows) {
            return req.reject(
                404,
                "Health record not found"
            );
        }

        return "Health Record Deleted";
    });

    this.on("ScheduleCheckup", async (req) => {
        const animal = await SELECT.one
            .from(Animals)
            .where({
                ID: req.data.animalID
            });

        if (!animal) {
            return req.reject(
                404,
                "Animal not found"
            );
        }

        await INSERT.into(HealthRecords).entries({
            animal_ID: req.data.animalID,
            checkupDate: req.data.checkupDate,
            veterinarianName:
                req.data.veterinarianName,
            healthStatus: "Scheduled"
        });

        return "Checkup Scheduled";
    });

    // =====================================================
    // BOUND HEALTH WORKFLOW
    // =====================================================

    this.on(
        "HealthMarkUnderTreatment",
        "HealthRecords",
        async (req) => {
            const healthRecordID =
                req.params?.[0]?.ID;

            if (!healthRecordID) {
                return req.reject(
                    400,
                    "Health record ID is missing"
                );
            }

            const healthRecord = await SELECT.one
                .from(HealthRecords)
                .where({ ID: healthRecordID });

            if (!healthRecord) {
                return req.reject(
                    404,
                    "Health record not found"
                );
            }

            if (!healthRecord.animal_ID) {
                return req.reject(
                    400,
                    "Health record is not linked to an animal"
                );
            }

            const animal = await SELECT.one
                .from(Animals)
                .where({
                    ID: healthRecord.animal_ID
                });

            if (!animal) {
                return req.reject(
                    404,
                    "Animal not found"
                );
            }

            if (animal.animalStatus === "Adopted") {
                return req.reject(
                    400,
                    "An adopted animal cannot be moved into shelter treatment"
                );
            }

            await UPDATE(HealthRecords)
                .set({
                    healthStatus:
                        "Under Treatment"
                })
                .where({ ID: healthRecordID });

            await UPDATE(Animals)
                .set({
                    animalStatus:
                        "Under Treatment"
                })
                .where({
                    ID: healthRecord.animal_ID
                });

            return "Animal marked under treatment";
        }
    );

    this.on(
        "HealthMarkRecovered",
        "HealthRecords",
        async (req) => {
            const healthRecordID =
                req.params?.[0]?.ID;

            if (!healthRecordID) {
                return req.reject(
                    400,
                    "Health record ID is missing"
                );
            }

            const healthRecord = await SELECT.one
                .from(HealthRecords)
                .where({ ID: healthRecordID });

            if (!healthRecord) {
                return req.reject(
                    404,
                    "Health record not found"
                );
            }

            if (!healthRecord.animal_ID) {
                return req.reject(
                    400,
                    "Health record is not linked to an animal"
                );
            }

            if (
                healthRecord.healthStatus !==
                "Under Treatment"
            ) {
                return req.reject(
                    400,
                    "Only an animal under treatment can be marked recovered"
                );
            }

            await UPDATE(HealthRecords)
                .set({
                    healthStatus: "Recovered",
                    remarks:
                        healthRecord.remarks ||
                        "Animal recovered after treatment"
                })
                .where({ ID: healthRecordID });

            await UPDATE(Animals)
                .set({
                    animalStatus: "Available"
                })
                .where({
                    ID: healthRecord.animal_ID
                });

            return "Animal marked recovered";
        }
    );

    this.on(
        "ScheduleNextCheckup",
        "HealthRecords",
        async (req) => {
            const healthRecordID =
                req.params?.[0]?.ID;

            const nextCheckupDate =
                req.data.nextCheckupDate;

            if (!healthRecordID) {
                return req.reject(
                    400,
                    "Health record ID is missing"
                );
            }

            if (!nextCheckupDate) {
                return req.reject(
                    400,
                    "Next checkup date is required"
                );
            }

            const healthRecord = await SELECT.one
                .from(HealthRecords)
                .where({ ID: healthRecordID });

            if (!healthRecord) {
                return req.reject(
                    404,
                    "Health record not found"
                );
            }

            if (nextCheckupDate < today()) {
                return req.reject(
                    400,
                    "Next checkup date cannot be in the past"
                );
            }

            await UPDATE(HealthRecords)
                .set({
                    nextCheckupDate
                })
                .where({ ID: healthRecordID });

            return "Next checkup scheduled";
        }
    );

    // =====================================================
    // INSPECTIONS
    // =====================================================

    this.on("CreateInspection", async (req) => {
        const adoption = await SELECT.one
            .from(Adoptions)
            .where({
                ID: req.data.adoptionID
            });

        if (!adoption) {
            return req.reject(
                404,
                "Adoption not found"
            );
        }

        if (req.data.inspectorID) {
            const inspector = await SELECT.one
                .from(Users)
                .where({
                    ID: req.data.inspectorID
                });

            if (!inspector) {
                return req.reject(
                    404,
                    "Inspector not found"
                );
            }
        }

        await INSERT.into(Inspections).entries({
            adoption_ID: req.data.adoptionID,
            inspector_ID: req.data.inspectorID,
            inspectionDate:
                req.data.inspectionDate,
            inspectionType:
                req.data.inspectionType,
            remarks: req.data.remarks,
            result: "Pending"
        });

        return "Inspection Created";
    });

    this.on("UpdateInspection", async (req) => {
        const {
            inspectionID,
            ...data
        } = req.data;

        const affectedRows =
            await UPDATE(Inspections)
                .set(data)
                .where({ ID: inspectionID });

        if (!affectedRows) {
            return req.reject(
                404,
                "Inspection not found"
            );
        }

        return "Inspection Updated";
    });

    this.on("DeleteInspection", async (req) => {
        const affectedRows = await DELETE
            .from(Inspections)
            .where({
                ID: req.data.inspectionID
            });

        if (!affectedRows) {
            return req.reject(
                404,
                "Inspection not found"
            );
        }

        return "Inspection Deleted";
    });

    this.on("ScheduleInspection", async (req) => {
        const {
            adoptionID,
            inspectorID,
            inspectionDate,
            inspectionType,
            existingPetDetails,
            remarks
        } = req.data;

        if (!adoptionID) {
            return req.reject(
                400,
                "Adoption is required"
            );
        }

        if (!inspectorID) {
            return req.reject(
                400,
                "Inspector is required"
            );
        }

        if (!inspectionDate) {
            return req.reject(
                400,
                "Inspection date is required"
            );
        }

        if (!inspectionType?.trim()) {
            return req.reject(
                400,
                "Inspection type is required"
            );
        }

        const adoption = await SELECT.one
            .from(Adoptions)
            .where({ ID: adoptionID });

        if (!adoption) {
            return req.reject(
                404,
                "Adoption not found"
            );
        }

        if (adoption.status !== "Completed") {
            return req.reject(
                400,
                "Inspections can only be scheduled for completed adoptions"
            );
        }

        const inspector = await SELECT.one
            .from(Users)
            .where({ ID: inspectorID });

        if (!inspector) {
            return req.reject(
                404,
                "Inspector not found"
            );
        }

        const pendingInspection =
            await SELECT.one
                .from(Inspections)
                .where({
                    adoption_ID: adoptionID,
                    result: "Pending"
                });

        if (pendingInspection) {
            return req.reject(
                409,
                "A pending inspection already exists for this adoption"
            );
        }

        await INSERT.into(Inspections).entries({
            adoption_ID: adoptionID,
            inspector_ID: inspectorID,
            inspectionDate,
            inspectionType:
                inspectionType.trim(),
            existingPetDetails:
                existingPetDetails?.trim() || "",
            remarks: remarks?.trim() || "",
            result: "Pending"
        });

        return "Inspection Scheduled";
    });

    this.on("ValidateInspection", async (req) => {
        const allowedResults = [
            "Passed",
            "Failed"
        ];

        if (
            !allowedResults.includes(
                req.data.result
            )
        ) {
            return req.reject(
                400,
                "Inspection result must be Passed or Failed"
            );
        }

        const affectedRows =
            await UPDATE(Inspections)
                .set({
                    result: req.data.result,
                    remarks: req.data.remarks
                })
                .where({
                    ID: req.data.inspectionID
                });

        if (!affectedRows) {
            return req.reject(
                404,
                "Inspection not found"
            );
        }

        return "Inspection Validated";
    });

    // =====================================================
    // BOUND INSPECTION VALIDATION
    // =====================================================

    this.on(
        "Validate",
        "Inspections",
        async (req) => {
            const inspectionID =
                req.params?.[0]?.ID;

            const result =
                req.data.result?.trim();

            const remarks =
                req.data.remarks?.trim();

            if (!inspectionID) {
                return req.reject(
                    400,
                    "Inspection ID is missing"
                );
            }

            if (!result) {
                return req.reject(
                    400,
                    "Inspection result is required"
                );
            }

            if (
                !["Passed", "Failed"].includes(
                    result
                )
            ) {
                return req.reject(
                    400,
                    "Inspection result must be Passed or Failed"
                );
            }

            const inspection = await SELECT.one
                .from(Inspections)
                .where({ ID: inspectionID });

            if (!inspection) {
                return req.reject(
                    404,
                    "Inspection not found"
                );
            }

            if (inspection.result !== "Pending") {
                return req.reject(
                    400,
                    "Only pending inspections can be validated"
                );
            }

            await UPDATE(Inspections)
                .set({
                    result,
                    remarks:
                        remarks ||
                        (
                            result === "Passed"
                                ? "Inspection passed"
                                : "Inspection failed"
                        )
                })
                .where({ ID: inspectionID });

            return "Inspection Validated";
        }
    );

    // =====================================================
    // ANIMAL STATUS
    // =====================================================

    this.on("MarkAvailable", async (req) => {
        const affectedRows = await UPDATE(Animals)
            .set({
                animalStatus: "Available"
            })
            .where({
                ID: req.data.animalID
            });

        if (!affectedRows) {
            return req.reject(
                404,
                "Animal not found"
            );
        }

        return "Animal Available";
    });

    this.on("MarkAdopted", async (req) => {
        const affectedRows = await UPDATE(Animals)
            .set({
                animalStatus: "Adopted"
            })
            .where({
                ID: req.data.animalID
            });

        if (!affectedRows) {
            return req.reject(
                404,
                "Animal not found"
            );
        }

        return "Animal Adopted";
    });

    this.on("MarkUnderTreatment", async (req) => {
        const affectedRows = await UPDATE(Animals)
            .set({
                animalStatus: "Under Treatment"
            })
            .where({
                ID: req.data.animalID
            });

        if (!affectedRows) {
            return req.reject(
                404,
                "Animal not found"
            );
        }

        return "Animal Under Treatment";
    });

    this.on("MarkRecovered", async (req) => {
        const affectedRows = await UPDATE(Animals)
            .set({
                animalStatus: "Available"
            })
            .where({
                ID: req.data.animalID
            });

        if (!affectedRows) {
            return req.reject(
                404,
                "Animal not found"
            );
        }

        return "Animal Recovered";
    });

    // =====================================================
    // DASHBOARD KPIs
    // =====================================================

    const countRows = async (
        entity,
        predicate
    ) => {
        const rows = await SELECT.from(entity);

        return predicate
            ? rows.filter(predicate).length
            : rows.length;
    };

    this.on("TotalAnimals", async () =>
        countRows(Animals)
    );

    this.on("AvailableAnimals", async () =>
        countRows(
            Animals,
            (animal) =>
                animal.animalStatus === "Available"
        )
    );

    this.on("AdoptedAnimals", async () =>
        countRows(
            Animals,
            (animal) =>
                animal.animalStatus === "Adopted"
        )
    );

    this.on("AnimalsUnderTreatment", async () =>
        countRows(
            Animals,
            (animal) =>
                animal.animalStatus ===
                "Under Treatment"
        )
    );

    this.on("PendingApplications", async () =>
        countRows(
            AdoptionApplications,
            (application) =>
                application.status === "Submitted" ||
                application.status === "Under Review"
        )
    );

    this.on("ApprovedApplications", async () =>
        countRows(
            AdoptionApplications,
            (application) =>
                application.status === "Approved"
        )
    );

    this.on("RejectedApplications", async () =>
        countRows(
            AdoptionApplications,
            (application) =>
                application.status === "Rejected"
        )
    );

    this.on("TotalApplications", async () =>
        countRows(AdoptionApplications)
    );

    this.on("TotalShelters", async () =>
        countRows(Shelters)
    );

    this.on("TotalAdoptions", async () =>
        countRows(Adoptions)
    );

    this.on("TotalHealthRecords", async () =>
        countRows(HealthRecords)
    );

    this.on("TotalInspections", async () =>
        countRows(Inspections)
    );
});