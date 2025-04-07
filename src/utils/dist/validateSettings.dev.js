"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function validateSettings(section, data) {
  console.log("validating");

  switch (section) {
    case "general":
      if (!data.platformName || typeof data.platformName !== "string") return "Invalid or missing platformName";
      if (!data.logoUrl || typeof data.logoUrl !== "string") return "Invalid or missing logoUrl";
      if (typeof data.maintenanceMode !== "boolean") return "maintenanceMode must be true or false";
      if (typeof data.maintenanceMessage !== "string") return "maintenanceMessage must be a string";
      if (!data.primaryColor || typeof data.primaryColor !== "string") return "Invalid or missing primaryColor";
      break;

    case "ownerManagement":
      if (typeof data.kycRequired !== "boolean") return "kycRequired must be a boolean";
      if (typeof data.autoApproveOwner !== "boolean") return "autoApproveOwner must be a boolean";
      if (!data.defaultOwnerRole || typeof data.defaultOwnerRole !== "string") return "Missing defaultOwnerRole";
      if (!Array.isArray(data.roles)) return "Roles must be an array";
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = data.roles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var role = _step.value;
          if (!role.name || typeof role.name !== "string") return "Role name is required";
          if (!Array.isArray(role.permissions)) return "Permissions must be an array";
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (typeof data.payoutDelayDays !== "number") return "payoutDelayDays must be a number";
      if (typeof data.maxYachtsPerOwner !== "number") return "maxYachtsPerOwner must be a number";
      break;

    case "bookingAndTransaction":
      if (typeof data.requireBookingApproval !== "boolean") return "Invalid requireBookingApproval";
      if (typeof data.allowPartialPayments !== "boolean") return "Invalid allowPartialPayments";
      if (typeof data.platformCommissionPercent !== "number") return "Invalid commission percent";
      if (!["percentage", "fixed"].includes(data.commissionMode)) return "commissionMode must be 'percentage' or 'fixed'";
      if (typeof data.refundWindowHours !== "number") return "refundWindowHours must be a number";
      if (typeof data.autoRefundFailedBookings !== "boolean") return "Invalid autoRefundFailedBookings";
      if (typeof data.cancellationFeePercent !== "number") return "Invalid cancellationFeePercent";
      if (!data.currency || typeof data.currency !== "string") return "Missing currency";
      if (!data.paymentGateways || _typeof(data.paymentGateways) !== "object") return "Missing paymentGateways config";
      break;

    case "reportsAndAnalytics":
      if (!Array.isArray(data.enabledReports)) return "enabledReports must be an array";
      if (!["last30days", "custom", "allTime"].includes(data.defaultDateRange)) return "Invalid defaultDateRange";
      if (!data.exportOptions || _typeof(data.exportOptions) !== "object") return "Missing exportOptions";
      if (!data.autoGenerateReports || _typeof(data.autoGenerateReports) !== "object") return "Missing autoGenerateReports config";
      if (typeof data.dataRetentionDays !== "number") return "Invalid dataRetentionDays";
      break;

    case "notificationsAndAlerts":
      if (!data.channels || _typeof(data.channels) !== "object") return "Missing channels config";
      if (!data.notifications || _typeof(data.notifications) !== "object") return "Missing notifications config";
      if (!data.smsProvider || _typeof(data.smsProvider) !== "object") return "Missing smsProvider";
      if (!data.emailProvider || _typeof(data.emailProvider) !== "object") return "Missing emailProvider";
      if (!data.defaultSenderEmail || typeof data.defaultSenderEmail !== "string") return "Invalid defaultSenderEmail";
      if (typeof data.allowUserToggleNotifications !== "boolean") return "Invalid allowUserToggleNotifications";
      break;

    case "apiAndIntegration":
      if (typeof data.testMode !== "boolean") return "testMode must be boolean";
      if (!data.paymentGateways || _typeof(data.paymentGateways) !== "object") return "Missing paymentGateways";
      if (!data.webhooks || _typeof(data.webhooks) !== "object") return "Missing webhooks";
      if (!data.analytics || _typeof(data.analytics) !== "object") return "Missing analytics config";
      if (!data.crmIntegration || _typeof(data.crmIntegration) !== "object") return "Missing CRM integration config";
      break;

    case "dataAndPrivacy":
      if (!data.privacyPreferences || _typeof(data.privacyPreferences) !== "object") return "Missing privacyPreferences";
      if (!data.dataRetention || _typeof(data.dataRetention) !== "object") return "Missing dataRetention";
      if (!data.backup || _typeof(data.backup) !== "object") return "Missing backup config";
      if (!data.fraudDetection || _typeof(data.fraudDetection) !== "object") return "Missing fraudDetection config";
      if (!data.compliance || _typeof(data.compliance) !== "object") return "Missing compliance config";
      break;

    case "chatSupport":
      if (typeof data.enabled !== "boolean") return "enabled must be boolean";
      if (!data.provider || typeof data.provider !== "string") return "Missing or invalid chat provider";
      if (typeof data.adminAccessOnly !== "boolean") return "adminAccessOnly must be boolean";
      break;

    default:
      return "Invalid settings section";
  }

  return null; // ✅ Valid settings
}

module.exports = validateSettings;