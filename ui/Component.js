sap.ui.define(["sap/ui/core/UIComponent", "sap/ui/Device"],
	function (UIComponent, Device) {
		"use strict";

		return UIComponent.extend("sap.demo.bulletinboard.Component", {

			metadata: {
				manifest: "json"
			},

			/**
			 * The component is initialized by UI5 automatically during the startup
			 * of the app and calls the init method once. In this method, the device
			 * models are set and the router is initialized.
			 * 
			 * @public
			 * @override
			 */
			init: function () {
				// call the base component's init function and create the App view
				UIComponent.prototype.init.apply(this, arguments);

				this.getRouter().initialize();
			},

			/**
			 * This method can be called to determine whether the sapUiSizeCompact
			 * or sapUiSizeCozy design mode class should be set, which influences
			 * the size appearance of some controls.
			 * 
			 * @public
			 * @return {string} css class, either 'sapUiSizeCompact' or
			 *         'sapUiSizeCozy' - or an empty string if no css class should
			 *         be set
			 */
			getContentDensityClass: function () {
				if (this._sContentDensityClass === undefined) {
					// check whether FLP has already set the content density class;
					// do nothing in this case
					if (jQuery(document.body).hasClass("sapUiSizeCozy")
						|| jQuery(document.body).hasClass("sapUiSizeCompact")) {
						this._sContentDensityClass = "";
					} else if (!Device.support.touch) { // apply "compact" mode if
						// touch is not supported
						this._sContentDensityClass = "sapUiSizeCompact";
					} else {
						// "cozy" in case of touch support; default for most sap.m
						// controls, but needed for desktop-first controls like
						// sap.ui.table.Table
						this._sContentDensityClass = "sapUiSizeCozy";
					}
				}
				return this._sContentDensityClass;
			},

			/**
			 * Checks if the app runs in a local dev/test environment (e.g. local
			 * Tomcat). In that case, certain parts change the behavior a bit to
			 * simplify local development, e.g. - provide initial fake ads for
			 * easier testing, and - avoid sending data to the server because it
			 * doesn't have the "users" service and thus cannot identify a "premium
			 * user" which is required to accept "write" requests.
			 */
			isLocalDevEnvironment: function () {
				return (document.domain == "localhost");
			}
		});
	});
	