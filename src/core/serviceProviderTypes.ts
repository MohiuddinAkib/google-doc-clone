/**
 * InversifyJS need to use the type as identifiers at runtime.
 * We use symbols as identifiers but you can also use classes and or string literals.
 */
export const ServiceProviderTypes = {
    SmsService: Symbol("SmsService"),
    HttpClient: Symbol("HttpClient"),
    AuthService: Symbol("AuthService"),
    UserService: Symbol("UserService"),
    TopupService: Symbol("TopupService"),
    TargetService: Symbol("TargetService"),
    StatusService: Symbol("StatusService"),
    StudentService: Symbol("StudentService"),
    CampaignService: Symbol("CampaignService"),
    AnalyticService: Symbol("AnalyticService"),
    SettingsService: Symbol("SettingsService"),
    RetailerService: Symbol("RetailerService"),
    GuidelineService: Symbol("GuidelineService"),
    BrandCommunicationService: Symbol("BrandCommunicationService"),
};
