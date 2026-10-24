sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"nimaladoption/workflow/admin/applicationworkflow/test/integration/pages/AdoptionApplicationsList.gen",
	"nimaladoption/workflow/admin/applicationworkflow/test/integration/pages/AdoptionApplicationsObjectPage.gen"
], function (JourneyRunner, AdoptionApplicationsListGenerated, AdoptionApplicationsObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('nimaladoption/workflow/admin/applicationworkflow') + '/test/flp.html#app-preview',
        pages: {
			onTheAdoptionApplicationsListGenerated: AdoptionApplicationsListGenerated,
			onTheAdoptionApplicationsObjectPageGenerated: AdoptionApplicationsObjectPageGenerated
        },
        async: true
    });

    return runner;
});

