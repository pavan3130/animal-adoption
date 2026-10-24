using AdminService as service from '../../srv/service';

annotate service.AdoptionApplications with @(
    UI.HeaderInfo : {
        TypeName : 'Adoption Application',
        TypeNamePlural : 'Adoption Applications',
        Title : {
            Value : status
        },
        Description : {
            Value : reasonForAdoption
        }
    },

    UI.SelectionFields : [
        status,
        applicationDate
    ],

    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'Application Date',
                Value : applicationDate
            },
            {
                $Type : 'UI.DataField',
                Label : 'Reason For Adoption',
                Value : reasonForAdoption
            },
            {
                $Type : 'UI.DataField',
                Label : 'Housing Details',
                Value : housingDetails
            },
            {
                $Type : 'UI.DataField',
                Label : 'Pet Experience',
                Value : petExperience
            },
            {
                $Type : 'UI.DataField',
                Label : 'Status',
                Value : status
            },
            {
                $Type : 'UI.DataField',
                Label : 'Reviewed By',
                Value : reviewedBy
            },
            {
                $Type : 'UI.DataField',
                Label : 'Staff Remarks',
                Value : staffRemarks
            }
        ]
    },

    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup'
        }
    ],

    // Actions displayed on the Object Page header
    UI.Identification : [
        {
            $Type : 'UI.DataField',
            Label : 'Application Date',
            Value : applicationDate
        },
        {
            $Type : 'UI.DataField',
            Label : 'Status',
            Value : status
        },
        {
            $Type : 'UI.DataField',
            Label : 'Reviewed By',
            Value : reviewedBy
        },
        {
            $Type : 'UI.DataField',
            Label : 'Staff Remarks',
            Value : staffRemarks
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'AdminService.Review',
            Label : 'Review'
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'AdminService.Approve',
            Label : 'Approve'
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'AdminService.Reject',
            Label : 'Reject'
        }
    ],

    // Columns and actions displayed on the List Report
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'Application Date',
            Value : applicationDate
        },
        {
            $Type : 'UI.DataField',
            Label : 'Reason For Adoption',
            Value : reasonForAdoption
        },
        {
            $Type : 'UI.DataField',
            Label : 'Housing Details',
            Value : housingDetails
        },
        {
            $Type : 'UI.DataField',
            Label : 'Pet Experience',
            Value : petExperience
        },
        {
            $Type : 'UI.DataField',
            Label : 'Status',
            Value : status
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'AdminService.Review',
            Label : 'Review',
            Inline : false
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'AdminService.Approve',
            Label : 'Approve',
            Inline : false
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'AdminService.Reject',
            Label : 'Reject',
            Inline : false
        }
    ]
);


// ====================================================================
// ANIMAL VALUE HELP
// ====================================================================

annotate service.AdoptionApplications with {
    animal @Common.ValueList : {
        $Type : 'Common.ValueListType',
        CollectionPath : 'Animals',
        Parameters : [
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : animal_ID,
                ValueListProperty : 'ID'
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'name'
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'species'
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'breed'
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'gender'
            }
        ]
    }
};


// ====================================================================
// APPLICANT VALUE HELP
// ====================================================================

annotate service.AdoptionApplications with {
    applicant @Common.ValueList : {
        $Type : 'Common.ValueListType',
        CollectionPath : 'Users',
        Parameters : [
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : applicant_ID,
                ValueListProperty : 'ID'
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'firstName'
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'lastName'
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'email'
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'phoneNumber'
            }
        ]
    }
};