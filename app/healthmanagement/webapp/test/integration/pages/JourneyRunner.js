sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"animaladoption/health/admin/healthmanagement/test/integration/pages/HealthRecordsList.gen",
	"animaladoption/health/admin/healthmanagement/test/integration/pages/HealthRecordsObjectPage.gen"
], function (JourneyRunner, HealthRecordsListGenerated, HealthRecordsObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('animaladoption/health/admin/healthmanagement') + '/test/flp.html#app-preview',
        pages: {
			onTheHealthRecordsListGenerated: HealthRecordsListGenerated,
			onTheHealthRecordsObjectPageGenerated: HealthRecordsObjectPageGenerated
        },
        async: true
    });

    return runner;
});

