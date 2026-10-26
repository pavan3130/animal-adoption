using AdminService as service from '../../srv/service';

annotate service.HealthRecords with @(
    UI.HeaderInfo : {
        TypeName : 'Health Record',
        TypeNamePlural : 'Health Records',
        Title : {
            Value : diagnosis
        },
        Description : {
            Value : healthStatus
        }
    },

    UI.SelectionFields : [
        healthStatus,
        checkupDate,
        nextCheckupDate,
        veterinarianName
    ],

    UI.FieldGroup #GeneralInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'Animal',
                Value : animal_ID
            },
            {
                $Type : 'UI.DataField',
                Label : 'Checkup Date',
                Value : checkupDate
            },
            {
                $Type : 'UI.DataField',
                Label : 'Health Status',
                Value : healthStatus
            },
            {
                $Type : 'UI.DataField',
                Label : 'Diagnosis',
                Value : diagnosis
            },
            {
                $Type : 'UI.DataField',
                Label : 'Treatment',
                Value : treatment
            },
            {
                $Type : 'UI.DataField',
                Label : 'Medication',
                Value : medication
            },
            {
                $Type : 'UI.DataField',
                Label : 'Veterinarian',
                Value : veterinarianName
            },
            {
                $Type : 'UI.DataField',
                Label : 'Weight',
                Value : weight
            },
            {
                $Type : 'UI.DataField',
                Label : 'Next Checkup Date',
                Value : nextCheckupDate
            },
            {
                $Type : 'UI.DataField',
                Label : 'Remarks',
                Value : remarks
            },
            {
                $Type : 'UI.DataField',
                Label : 'Medical Document',
                Value : medicalDocument
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
            Label : 'Health Status',
            Value : healthStatus
        },
        {
            $Type : 'UI.DataField',
            Label : 'Diagnosis',
            Value : diagnosis
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'AdminService.HealthMarkUnderTreatment',
            Label : 'Mark Under Treatment'
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'AdminService.HealthMarkRecovered',
            Label : 'Mark Recovered'
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'AdminService.ScheduleNextCheckup',
            Label : 'Schedule Next Checkup'
        }
    ],

    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'Animal',
            Value : animal_ID
        },
        {
            $Type : 'UI.DataField',
            Label : 'Checkup Date',
            Value : checkupDate
        },
        {
            $Type : 'UI.DataField',
            Label : 'Health Status',
            Value : healthStatus
        },
        {
            $Type : 'UI.DataField',
            Label : 'Diagnosis',
            Value : diagnosis
        },
        {
            $Type : 'UI.DataField',
            Label : 'Treatment',
            Value : treatment
        },
        {
            $Type : 'UI.DataField',
            Label : 'Medication',
            Value : medication
        },
        {
            $Type : 'UI.DataField',
            Label : 'Veterinarian',
            Value : veterinarianName
        },
        {
            $Type : 'UI.DataField',
            Label : 'Next Checkup',
            Value : nextCheckupDate
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'AdminService.HealthMarkUnderTreatment',
            Label : 'Under Treatment',
            Inline : false
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'AdminService.HealthMarkRecovered',
            Label : 'Recovered',
            Inline : false
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'AdminService.ScheduleNextCheckup',
            Label : 'Schedule Checkup',
            Inline : false
        }
    ]
);


// ====================================================================
// ANIMAL VALUE HELP
// ====================================================================

annotate service.HealthRecords with {
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
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'animalStatus'
            }
        ]
    }
};