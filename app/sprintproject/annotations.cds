using AdminService as service from '../../srv/service';

// ====================================================================
// ANIMALS
// ====================================================================

annotate service.Animals with @(
    UI.HeaderInfo : {
        TypeName       : 'Animal',
        TypeNamePlural : 'Animals',
        Title          : {
            Value : name
        },
        Description    : {
            Value : breed
        },
        ImageUrl       : photo
    },

    UI.SelectionFields : [
        species,
        breed,
        animalStatus,
        vaccinationStatus
    ],

    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'Photo',
            Value : photo
        },
        {
            $Type : 'UI.DataField',
            Label : 'Animal Name',
            Value : name
        },
        {
            $Type : 'UI.DataField',
            Label : 'Species',
            Value : species
        },
        {
            $Type : 'UI.DataField',
            Label : 'Breed',
            Value : breed
        },
        {
            $Type : 'UI.DataField',
            Label : 'Gender',
            Value : gender
        },
        {
            $Type : 'UI.DataField',
            Label : 'Age',
            Value : age
        },
        {
            $Type : 'UI.DataField',
            Label : 'Animal Status',
            Value : animalStatus
        },
        {
            $Type : 'UI.DataField',
            Label : 'Vaccination Status',
            Value : vaccinationStatus
        }
    ],

    UI.Identification : [
        {
            $Type : 'UI.DataField',
            Label : 'Animal Name',
            Value : name
        },
        {
            $Type : 'UI.DataField',
            Label : 'Species',
            Value : species
        },
        {
            $Type : 'UI.DataField',
            Label : 'Breed',
            Value : breed
        },
        {
            $Type : 'UI.DataField',
            Label : 'Gender',
            Value : gender
        },
        {
            $Type : 'UI.DataField',
            Label : 'Age',
            Value : age
        },
        {
            $Type : 'UI.DataField',
            Label : 'Arrival Date',
            Value : arrivalDate
        },
        {
            $Type : 'UI.DataField',
            Label : 'Animal Status',
            Value : animalStatus
        },
        {
            $Type : 'UI.DataField',
            Label : 'Vaccination Status',
            Value : vaccinationStatus
        },
        {
            $Type : 'UI.DataField',
            Label : 'Spayed or Neutered',
            Value : spayedOrNeutered
        },
        {
            $Type : 'UI.DataField',
            Label : 'Description',
            Value : description
        }
    ]
);
// Mark the photo URL so Fiori elements renders it as an image.
annotate service.Animals with {
    photo @UI.IsImageUrl : true;
};
