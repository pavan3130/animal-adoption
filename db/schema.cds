namespace animaladoption;

using {
    cuid,
    managed
} from'@sap/cds/common';


entity Users : cuid, managed {

    firstName      : String(100);
    lastName       : String(100);
    email          : String(255);
    phoneNumber    : String(20);
    address        : String(255);
    city           : String(100);
    state          : String(100);
    postalCode     : String(20);
    role           : String(20);
    status         : String(20);

}


entity Shelters : cuid, managed {

    shelterName       : String(100);
    shelterCode       : String(20);

    addressLine1      : String(100);
    addressLine2      : String(100);

    city              : String(50);
    state             : String(50);
    postalCode        : String(20);
    country           : String(50);

    contactNumber     : String(20);
    email             : String(100);
    website           : String(200);

    capacity          : Integer;
    currentOccupancy  : Integer;

    operatingTime     : Time;
    closingTime       : Time;

    shelterType       : String(50);
    licenseNumber     : String(50);

}


entity Animals : cuid, managed {

    shelter             : Association to Shelters;

    name                : String(100);
    species             : String(50);
    breed               : String(100);
    gender              : String(20);

    age                 : Integer;
    arrivalDate         : Date;

    animalStatus        : String(20);

    vaccinationStatus   : String(100);
    spayedOrNeutered    : String(20);

    photo               : String(500);
    description         : String(500);

}


entity AdoptionApplications : cuid, managed {

    animal              : Association to Animals;
    applicant           : Association to Users;

    applicationDate     : Date;

    reasonForAdoption   : String(500);
    housingDetails      : String(500);
    petExperience       : String(500);

    status              : String(30);

    reviewedBy          : String(100);
    staffRemarks        : String(500);

}


entity Adoptions : cuid, managed {

    application         : Association to AdoptionApplications;
    animal              : Association to Animals;

    adoptionDate        : Date;

    status              : String(20);
    completedBy         : String(100);

    remarks             : String(500);

}


entity HealthRecords : cuid, managed {

    animal             : Association to Animals;

    checkupDate        : Date;
    healthStatus       : String(30);

    diagnosis          : String(500);
    treatment          : String(500);
    medication         : String(500);

    veterinarianName   : String(100);

    weight             : Decimal(10,2);

    nextCheckupDate    : Date;

    remarks            : String(500);

    medicalDocument    : String(500);

}


entity Inspections : cuid, managed {

    adoption            : Association to Adoptions;
    inspector           : Association to Users;

    inspectionDate      : Date;
    inspectionType      : String(30);

    existingPetDetails  : String(500);

    result              : String(20);

    remarks             : String(500);

    inspectionDocument  : String(500);

}