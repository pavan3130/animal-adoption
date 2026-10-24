using UserService as service from '../../srv/service';
annotate service.Animals with @(
    UI.HeaderInfo : {
        TypeName : 'Animal',
        TypeNamePlural : 'Animals',
        Title : { Value : name },
        Description : { Value : breed },
        ImageUrl : photo,
    },
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'name',
                Value : name,
            },
            {
                $Type : 'UI.DataField',
                Label : 'species',
                Value : species,
            },
            {
                $Type : 'UI.DataField',
                Label : 'breed',
                Value : breed,
            },
            {
                $Type : 'UI.DataField',
                Label : 'gender',
                Value : gender,
            },
            {
                $Type : 'UI.DataField',
                Label : 'age',
                Value : age,
            },
            {
                $Type : 'UI.DataField',
                Label : 'arrivalDate',
                Value : arrivalDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'animalStatus',
                Value : animalStatus,
            },
            {
                $Type : 'UI.DataField',
                Label : 'vaccinationStatus',
                Value : vaccinationStatus,
            },
            {
                $Type : 'UI.DataField',
                Label : 'spayedOrNeutered',
                Value : spayedOrNeutered,
            },
            {
                $Type : 'UI.DataField',
                Label : 'photo',
                Value : photo,
            },
            {
                $Type : 'UI.DataField',
                Label : 'description',
                Value : description,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'Photo',
            Value : photo,
        },
        {
            $Type : 'UI.DataField',
            Label : 'name',
            Value : name,
        },
        {
            $Type : 'UI.DataField',
            Label : 'species',
            Value : species,
        },
        {
            $Type : 'UI.DataField',
            Label : 'breed',
            Value : breed,
        },
        {
            $Type : 'UI.DataField',
            Label : 'gender',
            Value : gender,
        },
        {
            $Type : 'UI.DataField',
            Label : 'age',
            Value : age,
        },
    ],
);


// Mark the photo URL so Fiori elements renders it as an image.
annotate service.Animals with {
    photo @UI.IsImageUrl : true;
};
