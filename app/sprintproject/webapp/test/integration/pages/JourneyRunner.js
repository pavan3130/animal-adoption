sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"animaladoption/admin/sprintproject/test/integration/pages/AnimalsList.gen",
	"animaladoption/admin/sprintproject/test/integration/pages/AnimalsObjectPage.gen"
], function (JourneyRunner, AnimalsListGenerated, AnimalsObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('animaladoption/admin/sprintproject') + '/test/flp.html#app-preview',
        pages: {
			onTheAnimalsListGenerated: AnimalsListGenerated,
			onTheAnimalsObjectPageGenerated: AnimalsObjectPageGenerated
        },
        async: true
    });

    return runner;
});

