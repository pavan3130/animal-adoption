sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"animaladoption/inspection/inspectionmanagement/test/integration/pages/InspectionsList.gen",
	"animaladoption/inspection/inspectionmanagement/test/integration/pages/InspectionsObjectPage.gen"
], function (JourneyRunner, InspectionsListGenerated, InspectionsObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('animaladoption/inspection/inspectionmanagement') + '/test/flp.html#app-preview',
        pages: {
			onTheInspectionsListGenerated: InspectionsListGenerated,
			onTheInspectionsObjectPageGenerated: InspectionsObjectPageGenerated
        },
        async: true
    });

    return runner;
});

