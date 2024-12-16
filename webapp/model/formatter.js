sap.ui.define([
    "sap/ui/model/type/Currency",
	"sap/ui/core/format/DateFormat" 
], function(Currency, DateFormat){

    "use strict";
    return{
        currencyValue: function (sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},

		date: function(date) {
			if (!date) {
				return "";
			}
			const oDate = (date instanceof Date) ? date : new Date(date);
		
			return sap.ui.core.format.DateFormat.getDateInstance({
				style: "medium"
			}).format(oDate);
		},

        deliveryState: function (oRequiredDate, oShippedDate) {
			if (oShippedDate === null) {
				return "None";
			}

			// delivery is urgent (takes more than 7 days)
			if (oRequiredDate - oShippedDate > 0 && oRequiredDate - oShippedDate <= 432000000) {
				return "Warning";
			} else if (oRequiredDate < oShippedDate) { // delivery is too late
				return "Error";
			} else { // delivery is in time
				return "Success";
			}
		},

        deliveryText: function (oRequiredDate, oShippedDate) {
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

			if (oShippedDate === null) {
				return "None";
			}

			// delivery is urgent (takes more than 7 days)
			if (oRequiredDate - oShippedDate > 0 && oRequiredDate - oShippedDate <= 432000000) {
				return oResourceBundle.getText("formatterDeliveryUrgent");
			} else if (oRequiredDate < oShippedDate) { //d elivery is too late
				return oResourceBundle.getText("formatterDeliveryTooLate");
			} else { // delivery is in time
				return oResourceBundle.getText("formatterDeliveryInTime");
			}
		},

        deliveryIcon: function(oRequiredDate, oShippedDate){

            if (oRequiredDate - oShippedDate > 0 && oRequiredDate - oShippedDate <= 432000000) {
				return "sap-icon://flag" ;
			} else if (oRequiredDate < oShippedDate) { //delivery is too late
				return "sap-icon://lateness";
			} else { // delivery is in time
				return "sap-icon://sys-enter-2";
			}
        }
    }
})