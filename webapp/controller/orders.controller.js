sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/GroupHeaderListItem",
    "sap/ui/Device",
    "sap/ui/core/Fragment",
    "../model/formatter",
    "sap/ui/core/format/DateFormat"

], (Controller, JSONModel, Filter, FilterOperator, Sorter,
    GroupHeaderListItem, Device, Fragment, formatter, DateFormat) => {
    "use strict";
    
    return Controller.extend("orders1.controller.orders", {

        formatter: formatter,

        _createViewModel(){
            return new sap.ui.model.json.JSONModel({ titleCount : 0})
        },

        onInit() {

            var oList = this.byId("list"),
				oViewModel = this._createViewModel(),
                iOriginalBusyDelay = oList.getBusyIndicatorDelay();
				

                this._oGroupFunctions = {
                    CompanyName: function (oContext) {
                        console.log(oContext)
                        var sCompanyName = oContext.getProperty("Customers/CompanyName");
                        return {
                            key: sCompanyName,
                            text: sCompanyName
                        };
                    },

                    OrderDate: function (oContext) {
                        var oDate = oContext.getProperty("OrderDate"),
                            iYear = oDate.getFullYear(),
                            iMonth = oDate.getMonth() + 1,
                            sMonthName = this._oMonthNameFormat.format(oDate);
    
                        return {
                            key: iYear + "-" + iMonth,
                            text: this.getResourceBundle().getText("masterGroupTitleOrderedInPeriod", [sMonthName, iYear])
                        };
                    }.bind(this),

                    ShippedDate: function (oContext) {
                        var oDate = oContext.getProperty("ShippedDate");
                        // Special handling needed because shipping date may be empty (=> not yet shipped).
                        if (oDate != null) {
                            var iYear = oDate.getFullYear(),
                                iMonth = oDate.getMonth() + 1,
                                sMonthName = this._oMonthNameFormat.format(oDate);
    
                            return {
                                key: iYear + "-" + iMonth,
                                text: this.getResourceBundle().getText("masterGroupTitleShippedInPeriod", [sMonthName, iYear])
                            };
                        } else {
                            return {
                                key: 0,
                                text: this.getResourceBundle().getText("masterGroupTitleNotShippedYet")
                            };
                        }
                    }.bind(this)
                };

                this._oMonthNameFormat = DateFormat.getInstance({ pattern: "yMMMd"});

			    this._oList = oList;

			// keeps the filter and search state
			    this._oListFilterState = {
				    aFilter : [],
				    aSearch : []
			    };

                this.getOwnerComponent().setModel(oViewModel, "masterView");
	
			oList.attachEventOnce("updateFinished", function(){
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});

			// this.getView().addEventDelegate({
			// 	onBeforeFirstShow: function () {
			// 		this.getOwnerComponent().oListSelector.setBoundMasterList(oList);
			// 	}.bind(this)
			// });


			var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("master").attachPatternMatched(this._onMasterMatched, this);
			oRouter.attachBypassed(this.onBypassed, this);

        },

        onUpdateFinished : function (oEvent) {
			// update the master list object counter after new data is loaded
			this._updateListItemCount(oEvent.getParameter("total"));
		},

        onSearch : function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				this.onRefresh();
				return;
			}

			var sQuery = oEvent.getParameter("query");

			if (sQuery) {
				this._oListFilterState.aSearch = [new Filter("CustomerID", FilterOperator.Contains, sQuery)];
			} else {
				this._oListFilterState.aSearch = [];
			}
			this._applyFilterSearch();

		},

        _onMasterMatched: function(){

        },

        onRefresh : function () {
			this._oList.getBinding("items").refresh();
		},

        _updateListItemCount : function (iTotalItems) {
			// only update the counter if the length is final
			if (this._oList.getBinding("items").isLengthFinal()) {
				this.getOwnerComponent().getModel("masterView").setProperty("/titleCount", iTotalItems);
			}
		}
    });
});