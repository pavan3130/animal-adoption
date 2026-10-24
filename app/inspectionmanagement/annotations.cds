using InspectorService as service from '../../srv/service';

annotate service.Inspections with @(
    UI.HeaderInfo : {
        TypeName : 'Inspection',
        TypeNamePlural : 'Inspections',
        Title : {
            Value : inspectionType
        },
        Description : {
            Value : result
        }
    },

    UI.SelectionFields : [
        inspectionDate,
        inspectionType,
        result,
        inspector_ID
    ],

    UI.FieldGroup #GeneralInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'Adoption',
                Value : adoption_ID
            },
            {
                $Type : 'UI.DataField',
                Label : 'Inspector',
                Value : inspector_ID
            },
            {
                $Type : 'UI.DataField',
                Label : 'Inspection Date',
                Value : inspectionDate
            },
            {
                $Type : 'UI.DataField',
                Label : 'Inspection Type',
                Value : inspectionType
            },
            {
                $Type : 'UI.DataField',
                Label : 'Existing Pet Details',
                Value : existingPetDetails
            },
            {
                $Type : 'UI.DataField',
                Label : 'Result',
                Value : result
            },
            {
                $Type : 'UI.DataField',
                Label : 'Remarks',
                Value : remarks
            },
            {
                $Type : 'UI.DataField',
                Label : 'Inspection Document',
                Value : inspectionDocument
            }
        ]
    },

    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneralInformationFacet',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneralInformation'
        }
    ],

    UI.Identification : [
        {
            $Type : 'UI.DataField',
            Label : 'Inspection Date',
            Value : inspectionDate
        },
        {
            $Type : 'UI.DataField',
            Label : 'Inspection Type',
            Value : inspectionType
        },
        {
            $Type : 'UI.DataField',
            Label : 'Result',
            Value : result
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'InspectorService.Validate',
            Label : 'Validate Inspection'
        }
    ],

    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'Adoption',
            Value : adoption_ID
        },
        {
            $Type : 'UI.DataField',
            Label : 'Inspector',
            Value : inspector_ID
        },
        {
            $Type : 'UI.DataField',
            Label : 'Inspection Date',
            Value : inspectionDate
        },
        {
            $Type : 'UI.DataField',
            Label : 'Inspection Type',
            Value : inspectionType
        },
        {
            $Type : 'UI.DataField',
            Label : 'Existing Pet Details',
            Value : existingPetDetails
        },
        {
            $Type : 'UI.DataField',
            Label : 'Result',
            Value : result
        },
        {
            $Type : 'UI.DataField',
            Label : 'Remarks',
            Value : remarks
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'InspectorService.Validate',
            Label : 'Validate Inspection',
            Inline : false
        }
    ]
);


// ====================================================================
// ADOPTION VALUE HELP
// ====================================================================

annotate service.Inspections with {
    adoption @Common.ValueList : {
        $Type : 'Common.ValueListType',
        CollectionPath : 'Adoptions',
        Parameters : [
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : adoption_ID,
                ValueListProperty : 'ID'
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'adoptionDate'
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'status'
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'completedBy'
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'remarks'
            }
        ]
    }
};


// ====================================================================
// INSPECTOR VALUE HELP
// ====================================================================

annotate service.Inspections with {
    inspector @Common.ValueList : {
        $Type : 'Common.ValueListType',
        CollectionPath : 'Users',
        Parameters : [
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : inspector_ID,
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