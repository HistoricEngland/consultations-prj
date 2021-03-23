define([
    'underscore',
    'jquery',
    'arches',
    'knockout',
    'knockout-mapping',
    'views/components/workflows/new-tile-step'
], function(_, $, arches, ko, koMapping, NewTileStep) {
    function viewModel(params) {
        var self = this;
        NewTileStep.apply(this, [params]);

        params.applyOutputToTarget = ko.observable(true);
        if (!params.resourceid()) {
            params.resourceid(ko.unwrap(params.workflow.resourceId));
        }
        if (params.workflow.steps[params._index]) {
            params.tileid(ko.unwrap(params.workflow.steps[params._index].tileid));
        }
        this.workflowStepClass = ko.unwrap(params.class());
        this.nameheading = params.nameheading;
        this.namelabel = params.namelabel;
        this.applyOutputToTarget = params.applyOutputToTarget;
        params.tile = self.tile;

        params.defineStateProperties = function(){
            var wastebin = !!(ko.unwrap(params.wastebin)) ? koMapping.toJS(params.wastebin) : undefined;
            if (wastebin && 'resourceid' in wastebin) {
                wastebin.resourceid = ko.unwrap(params.resourceid);
            }
            return {
                resourceid: ko.unwrap(params.resourceid),
                tile: !!(ko.unwrap(params.tile)) ? koMapping.toJS(params.tile().data) : undefined,
                tileid: !!(ko.unwrap(params.tile)) ? ko.unwrap(params.tile().tileid): undefined,
                applyOutputToTarget: ko.unwrap(this.applyOutputToTarget),
                wastebin: wastebin,
                address: self.address
            };
        };

        self.getAddressString = ko.computed(function(){
            if (self.tile()){
                var building = self.tile().data["c7ec960d-28c8-11eb-aee4-f875a44e0e11"] ? ko.unwrap(self.tile().data["c7ec960d-28c8-11eb-aee4-f875a44e0e11"]) + ", " : '';
                var street   = self.tile().data["c7ec9611-28c8-11eb-b865-f875a44e0e11"] ? ko.unwrap(self.tile().data["c7ec9611-28c8-11eb-b865-f875a44e0e11"]) + ", " : '';
                var locality = self.tile().data["c7ec9613-28c8-11eb-966c-f875a44e0e11"] ? ko.unwrap(self.tile().data["c7ec9613-28c8-11eb-966c-f875a44e0e11"]) + ", " : '';
                var city     = self.tile().data["c7ec9607-28c8-11eb-acf0-f875a44e0e11"] ? ko.unwrap(self.tile().data["c7ec9607-28c8-11eb-acf0-f875a44e0e11"]) + ", " : '';
                var postcode = self.tile().data["c7ec9609-28c8-11eb-a6a3-f875a44e0e11"] ? ko.unwrap(self.tile().data["c7ec9609-28c8-11eb-a6a3-f875a44e0e11"]) : '';
                return building + street + locality + city + postcode;
            }
        });

        self.getAddressString.subscribe(function(val){
            if (self.applyOutputToTarget && val) {
                self.address = self.getAddressString();
            }
        });

        self.applyOutputToTarget.subscribe(function(val){
            if (val) {
                self.address = self.getAddressString();
            } else {
                self.address = null;
            }
        });

    }

    return ko.components.register('app-area-address-step', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/app-area-address-step.htm'
        }
    });
});
