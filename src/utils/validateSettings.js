function validateSettings(section, data) {
     console.log("validating")
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
         for (const role of data.roles) {
           if (!role.name || typeof role.name !== "string") return "Role name is required";
           if (!Array.isArray(role.permissions)) return "Permissions must be an array";
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
         if (!data.paymentGateways || typeof data.paymentGateways !== "object") return "Missing paymentGateways config";
         break;
   
       case "reportsAndAnalytics":
         if (!Array.isArray(data.enabledReports)) return "enabledReports must be an array";
         if (!["last30days", "custom", "allTime"].includes(data.defaultDateRange)) return "Invalid defaultDateRange";
         if (!data.exportOptions || typeof data.exportOptions !== "object") return "Missing exportOptions";
         if (!data.autoGenerateReports || typeof data.autoGenerateReports !== "object") return "Missing autoGenerateReports config";
         if (typeof data.dataRetentionDays !== "number") return "Invalid dataRetentionDays";
         break;
   
       case "notificationsAndAlerts":
         if (!data.channels || typeof data.channels !== "object") return "Missing channels config";
         if (!data.notifications || typeof data.notifications !== "object") return "Missing notifications config";
         if (!data.smsProvider || typeof data.smsProvider !== "object") return "Missing smsProvider";
         if (!data.emailProvider || typeof data.emailProvider !== "object") return "Missing emailProvider";
         if (!data.defaultSenderEmail || typeof data.defaultSenderEmail !== "string") return "Invalid defaultSenderEmail";
         if (typeof data.allowUserToggleNotifications !== "boolean") return "Invalid allowUserToggleNotifications";
         break;
   
       case "apiAndIntegration":
         if (typeof data.testMode !== "boolean") return "testMode must be boolean";
         if (!data.paymentGateways || typeof data.paymentGateways !== "object") return "Missing paymentGateways";
         if (!data.webhooks || typeof data.webhooks !== "object") return "Missing webhooks";
         if (!data.analytics || typeof data.analytics !== "object") return "Missing analytics config";
         if (!data.crmIntegration || typeof data.crmIntegration !== "object") return "Missing CRM integration config";
         break;
   
       case "dataAndPrivacy":
         if (!data.privacyPreferences || typeof data.privacyPreferences !== "object") return "Missing privacyPreferences";
         if (!data.dataRetention || typeof data.dataRetention !== "object") return "Missing dataRetention";
         if (!data.backup || typeof data.backup !== "object") return "Missing backup config";
         if (!data.fraudDetection || typeof data.fraudDetection !== "object") return "Missing fraudDetection config";
         if (!data.compliance || typeof data.compliance !== "object") return "Missing compliance config";
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
   