sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"animaladoption/user/sprintproject1/test/integration/pages/AnimalsList.gen",
	"animaladoption/user/sprintproject1/test/integration/pages/AnimalsObjectPage.gen"
], function (JourneyRunner, AnimalsListGenerated, AnimalsObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('animaladoption/user/sprintproject1') + '/test/flp.html#app-preview',
        pages: {
			onTheAnimalsListGenerated: AnimalsListGenerated,
			onTheAnimalsObjectPageGenerated: AnimalsObjectPageGenerated
        },
        async: true
    });

    return runner;
});

