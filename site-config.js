window.SITE_CONFIG = {
    visitorAlertWebhook: "",
    ownerModeQueryParam: "owner",
    ownerModeStorageKey: "ps-owner-mode"
};

/*
To receive visit alerts by email:
1. Set visitorAlertWebhook to a webhook URL you control.
2. Have that webhook send you an email through Resend, Zapier, Make, or a serverless function.
3. Open your own site once with ?owner=1 in your browser to suppress alerts from that browser.
4. Use ?owner=0 later if you want to re-enable alerts on your device.

This is best-effort owner detection, not identity-proof detection.
*/
