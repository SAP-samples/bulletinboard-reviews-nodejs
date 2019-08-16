sap.ui.define([
	"sap/demo/bulletinboard/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function(BaseController, JSONModel, MessageToast) {
	"use strict";

	return BaseController.extend("sap.demo.bulletinboard.controller.CreateReview", {

		onInit : function() {
			this._oDetailsModel = new JSONModel({});
			this._initNewAdModel();
			this.setModel(this._oDetailsModel, "reviewDetails");
		},
		
		onSampleFill : function () {
			this._oDetailsModel.setData({
			    reviewer_email: "john.doe@some.org",
			    rating: 4,
			    comment: "Good product"
			}, false);
		},
	
		onSave : function() {
			var reviewData = this._oDetailsModel.getData();
			reviewData.reviewee_email = 'john.doe@some.org';
			this.fetchCsrfToken(reviewData, this._postAd.bind(this), this._onNewAdCreated.bind(this));
		},
		
		_postAd : function(oNewAdForServer, sCsrfToken, fSuccess) {
			$.ajax({
				method : "POST",
				url: this.getMainServiceURL() + '/reviews',
				data : JSON.stringify(oNewAdForServer),
				processData : false,
				contentType : "application/json",
				headers : { "x-csrf-token" : sCsrfToken }
			})
			.done(function(data, textStatus, oJqXHR) {fSuccess(oNewAdForServer, textStatus, oJqXHR)})
			.fail( function(oJqXHR, sTextStatus, sErrorThrown) {
					MessageToast.show("Failed to create your new ad.");
					jQuery.sap.log.error("Failed to create new ad.", sErrorThrown);
	
			});
		},
		
		_initNewAdModel : function () {
			this._oDetailsModel.setData({}, false);
		},

		_onNewAdCreated : function(oNewAdFromServer, sTextStatus, oJqXHR) {
			MessageToast.show("Your new ad has been created with ID " + oNewAdFromServer.id + ".");

			// Reset model for new reviews so that the data of the created instance
			// does not appear as initial data when creating another one.
			this._initNewAdModel();
			
			// Go back to list of ads.
			this.getRouter().navTo("main", {'reviewee_email': oNewAdFromServer.reviewee_email});
		}
	})
});