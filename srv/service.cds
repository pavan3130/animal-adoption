using { animaladoption as db } from '../db/schema';

// ====================================================================
// ADMIN SERVICE
// ====================================================================

@requires : 'Admin'
service AdminService {

    // =====================================================
    // ENTITIES
    // =====================================================

    entity Users
        as projection on db.Users;

    entity Shelters
        as projection on db.Shelters;

    entity Animals
        as projection on db.Animals;

    entity AdoptionApplications
        as projection on db.AdoptionApplications
        actions {
            action Review()
                returns String;

            action Approve()
                returns String;

            action Reject()
                returns String;
        };

    entity Adoptions
        as projection on db.Adoptions;

    entity HealthRecords
        as projection on db.HealthRecords
        actions {
            action HealthMarkUnderTreatment()
                returns String;

            action HealthMarkRecovered()
                returns String;

            action ScheduleNextCheckup(
                nextCheckupDate : Date
            ) returns String;
        };

    entity Inspections
        as projection on db.Inspections;

    // =====================================================
    // USER CRUD
    // =====================================================

    action CreateUser(
        firstName : String,
        lastName : String,
        email : String,
        phoneNumber : String,
        address : String,
        city : String,
        state : String,
        postalCode : String,
        role : String,
        status : String
    ) returns String;

    action UpdateUser(
        userID : UUID,
        firstName : String,
        lastName : String,
        email : String,
        phoneNumber : String,
        address : String,
        city : String,
        state : String,
        postalCode : String,
        role : String,
        status : String
    ) returns String;

    action DeleteUser(
        userID : UUID
    ) returns String;

    // =====================================================
    // SHELTER CRUD
    // =====================================================

    action CreateShelter(
        shelterName : String,
        shelterCode : String,
        addressLine1 : String,
        addressLine2 : String,
        city : String,
        state : String,
        postalCode : String,
        country : String,
        contactNumber : String,
        email : String,
        website : String,
        capacity : Integer,
        shelterType : String,
        licenseNumber : String
    ) returns String;

    action UpdateShelter(
        shelterID : UUID,
        shelterName : String,
        capacity : Integer,
        currentOccupancy : Integer,
        contactNumber : String,
        email : String
    ) returns String;

    action DeleteShelter(
        shelterID : UUID
    ) returns String;

    // =====================================================
    // ANIMAL CRUD
    // =====================================================

    action CreateAnimal(
        shelterID : UUID,
        name : String,
        species : String,
        breed : String,
        gender : String,
        age : Integer,
        vaccinationStatus : String,
        spayedOrNeutered : String,
        description : String
    ) returns String;

    action UpdateAnimal(
        animalID : UUID,
        name : String,
        breed : String,
        age : Integer,
        animalStatus : String,
        description : String
    ) returns String;

    action DeleteAnimal(
        animalID : UUID
    ) returns String;

    // =====================================================
    // APPLICATION CRUD
    // =====================================================

    action CreateApplication(
        animalID : UUID,
        applicantID : UUID,
        reasonForAdoption : String,
        housingDetails : String,
        petExperience : String
    ) returns String;

    action UpdateApplication(
        applicationID : UUID,
        status : String,
        staffRemarks : String
    ) returns String;

    action DeleteApplication(
        applicationID : UUID
    ) returns String;

    action WithdrawApplication(
        applicationID : UUID
    ) returns String;

    // =====================================================
    // ADOPTION CRUD
    // =====================================================

    action CreateAdoption(
        applicationID : UUID,
        animalID : UUID,
        remarks : String
    ) returns String;

    action UpdateAdoption(
        adoptionID : UUID,
        status : String,
        remarks : String
    ) returns String;

    action DeleteAdoption(
        adoptionID : UUID
    ) returns String;

    // =====================================================
    // HEALTH RECORD CRUD
    // =====================================================

    action CreateHealthRecord(
        animalID : UUID,
        diagnosis : String,
        treatment : String,
        medication : String,
        veterinarianName : String,
        weight : Decimal(10,2),
        remarks : String
    ) returns String;

    action UpdateHealthRecord(
        recordID : UUID,
        diagnosis : String,
        treatment : String,
        medication : String,
        remarks : String
    ) returns String;

    action DeleteHealthRecord(
        recordID : UUID
    ) returns String;

    action ScheduleCheckup(
        animalID : UUID,
        checkupDate : Date,
        veterinarianName : String
    ) returns String;

    // =====================================================
    // INSPECTION CRUD
    // =====================================================

    action CreateInspection(
        adoptionID : UUID,
        inspectorID : UUID,
        inspectionDate : Date,
        inspectionType : String,
        remarks : String
    ) returns String;

    action UpdateInspection(
        inspectionID : UUID,
        result : String,
        remarks : String
    ) returns String;

    action DeleteInspection(
        inspectionID : UUID
    ) returns String;

    action ScheduleInspection(
        adoptionID : UUID,
        inspectorID : UUID,
        inspectionDate : Date,
        inspectionType : String,
        existingPetDetails : String,
        remarks : String
    ) returns String;

    action ValidateInspection(
        inspectionID : UUID,
        result : String,
        remarks : String
    ) returns String;

    // =====================================================
    // ANIMAL STATUS ACTIONS
    // =====================================================

    action MarkAvailable(
        animalID : UUID
    ) returns String;

    action MarkAdopted(
        animalID : UUID
    ) returns String;

    action MarkUnderTreatment(
        animalID : UUID
    ) returns String;

    action MarkRecovered(
        animalID : UUID
    ) returns String;

    // =====================================================
    // DASHBOARD KPI FUNCTIONS
    // =====================================================

    function TotalAnimals()
        returns Integer;

    function AvailableAnimals()
        returns Integer;

    function AdoptedAnimals()
        returns Integer;

    function AnimalsUnderTreatment()
        returns Integer;

    function PendingApplications()
        returns Integer;

    function ApprovedApplications()
        returns Integer;

    function RejectedApplications()
        returns Integer;

    function TotalApplications()
        returns Integer;

    function TotalShelters()
        returns Integer;

    function TotalAdoptions()
        returns Integer;

    function TotalHealthRecords()
        returns Integer;

    function TotalInspections()
        returns Integer;
}

// ====================================================================
// USER SERVICE
// ====================================================================

@requires : 'User'
service UserService {

    // =====================================================
    // ENTITIES
    // =====================================================

    @readonly
    entity Animals
        as projection on db.Animals;

    @readonly
    entity AdoptionApplications
        as projection on db.AdoptionApplications;

    @readonly
    entity Adoptions
        as projection on db.Adoptions;

    // =====================================================
    // CURRENT SIGNED-IN USER
    // =====================================================

    function CurrentUser()
        returns {
            ID : UUID;
            firstName : String;
            lastName : String;
            email : String;
            role : String;
            status : String;
        };

    // =====================================================
    // USER-SPECIFIC KPI FUNCTIONS
    // =====================================================

    function MyTotalApplications()
        returns Integer;

    function MyPendingApplications()
        returns Integer;

    function MyTotalAdoptions()
        returns Integer;

    // =====================================================
    // USER ACTIONS
    // =====================================================

    action SubmitApplication(
        animalID : UUID,
        reasonForAdoption : String,
        housingDetails : String,
        petExperience : String
    ) returns String;

    action WithdrawApplication(
        applicationID : UUID
    ) returns String;
}

// ====================================================================
// INSPECTOR SERVICE
// ====================================================================

@requires : ['Inspector', 'Admin']
service InspectorService {

    // =====================================================
    // ENTITIES
    // =====================================================

    @readonly
    entity Users as projection on db.Users {
        ID,
        firstName,
        lastName,
        email,
        phoneNumber,
        role,
        status
    };

    @readonly
    entity Adoptions
        as projection on db.Adoptions;

    entity Inspections
        as projection on db.Inspections
        actions {
            action Validate(
                result : String,
                remarks : String
            ) returns String;
        };

    // =====================================================
    // INSPECTION ACTIONS
    // =====================================================

    action ScheduleInspection(
        adoptionID : UUID,
        inspectorID : UUID,
        inspectionDate : Date,
        inspectionType : String,
        existingPetDetails : String,
        remarks : String
    ) returns String;
}

// ====================================================================
// SESSION SERVICE
// ====================================================================
@requires : 'authenticated-user'
service SessionService {

    function CurrentSession()
        returns {
            ID : UUID;
            firstName : String;
            lastName : String;
            email : String;
            role : String;
            status : String;
        };
}