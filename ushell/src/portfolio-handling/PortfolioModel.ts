// export class PortfolioModel {
//   /** MUSS MIT '/' ENDEN!!! */
//   public loadedFrom: string;

//   public oAuthProxyUrl: string = "https://re-define-it.de/oauth/";
//   public oAuthProxyProfile: string = "";

//   /* 00000000-0000-0000-0000-000000000000 means DISABLED - NO LOGIN REQUIRED!!! */
//   public primaryUiTokenSourceUid: string =
//     "00000000-0000-0000-0000-000000000000";

//   public applicationTitle: string = "Web-Frontend";

//   // can be null, a fixed-key-string or "%T" to use the auth-token
//   public uShellLicenceKey: string = "%T";

//   /* this can be one of the following:
//     backend-generated
//     frontend-generated-mode1
//     config-fixed
//     given-url-param
//     given-cookie
//     none (disables login-screen)
//   */
//   public authTokenSource: string = "frontend-generated";

//   /* contains authTokenSource-specific details:
//     for 'backend-generated': auth-service-url
//     for 'frontend-generated-mode1': { iss: "issuer-name", exp:"10D"|"2M", sub:"%U"} (singn-secret will be the pwd!)
//     for: "config-fixed": token-string
//     for: 'given-url-param': name of the url-param
//     for 'given-cookie':  name of the cookie
//     for 'none': null
//   */
//   public authTokenSourceParam: object = {};

//   public authTokenIsPersistent: boolean = true;

//   public ciConfigUrl: string;
//   // public loadedCiConfig: CiConfigModel = null; // << will be set by the PortfolioLoader!

//   public legalContactMdUrl: string;
//   public resolvedLegalContactMdUrl: string; // << will be set by the PortfolioLoader!

//   public intialRuntimeTags: string[];

//   public licenseAgreementMdUrl: string;
//   public resolvedLicenseAgreementMdUrl: string; // << will be set by the PortfolioLoader!

//   public moduleDescriptionUrls: string[];
//   public loadedModuleDescriptions: ModuleDescription[] = []; // << will be set by the PortfolioLoader!

//   //default workspace - for example "dashboard"
//   public landingWorkspaceName: string;
// }

// export class CiConfigModel {
//   public loadedFrom: string;

//   public logoUrlLight: string = "assets/layout/images/logo-cte.png";
//   public logoUrlDark: string = "assets/layout/images/logo-cte-dark.png";

//   public resolvedLogoUrlLight: string | null = null; // << will be set by the PortfolioLoader!
//   public resolvedLogoUrlDark: string | null = null; // << will be set by the PortfolioLoader!

//   public menuMode: string = "static";
//   public pageColorMode: string = "light";
//   public menuColorMode: string = "light";
//   public topBarColorMode: string = "dim";
//   public inputBgFilled: boolean = true;
//   public ripple: boolean = false;
//   public rtl: boolean = false;
//   public componentTheme: string = "cyan";
//   public allowUserCustomizing: boolean = true;
// }

// export class ModuleDescription {
//   public moduleUid: string;
//   public moduleTitle: string;
//   public moduleScopingKey: string;

//   public datasources: DatasourceDescription[];

//   public workspaces: WorkspaceDescription[];
//   public usecases: UsecaseDescription[];
//   public commands: CommandDescription[];
// }
// export class DatasourceDescription {
//   public datasourceUid: string = "";
//   public providerClass: string = "";
//   public providerArguments: object = {};
//   public entityName?: string = "";
// }

// export class UsecaseDescription {
//   public useCaseKey: string = "myUC";
//   public title: string = "my UC";
//   public singletonActionkey: string = "";
//   public widgetClass: string = "";
//   public widgetArguments: object = {};

//   public component: string;
//   public module: string;
//   public url: string;
// }
// export class WorkspaceDescription {
//   public workspaceKey: string = "";
//   public workspaceTitle: string = "";
//   public iconName?: string;
//   public defaultStaticUseCaseKeys: string[] = [];
//   public isSidebar: boolean = false;
// }

// export class CommandDescription {
//   //"{M}sms-sxxxxxxxxxxxx"
//   public uniqueCommandKey: string;

//   public label: string;

//   //"primray|secondary|success|info|warning|help|danger",
//   public semantic: string;

//   public description?: string;

//   //"pi pi-tag"
//   public iconKey?: string;

//   //"pi pi-tag"
//   public iconKeyChecked?: string;

//   //can be null
//   public WarningToConfirm?: string;

//   //": "{M}sms/institutes   KANN AUCH NULL SEIN, dann ist es modal (aber auch mit tabs!! submit ist dann gemeinsam!), oder der maigic-value '<CURRENT>'",
//   public targetWorkspacePath?: string;

//   //":{ "idToEdit": "selectedId (PropAmQuellUc), für alle anderen vom widget geforderten args geht ein modaler dialog auf"},
//   public useCaseArgumentMapping?: object;

//   //ENABLED!
//   public requiredRuntimeTagsForAvailability?: string[];

//   //VISIBLE               for example ["devmode"]
//   public requiredRuntimeTagsForVisibility?: string[];

//   //CHECKED (WHEN...)     for example "devmode"
//   public checkedRepresentingRuntimeTag?: string;

//   //": "{M}sms-sxxxxxxxxxxxx",
//   public locateAfterCommand?: string;
//   public locationPriority?: number = 100;

//   //if not set, than the global primary application menu is addressed",
//   public menuOwnerUseCaseKey?: string;

//   //empty is not allowed (null or '' will automatically replaced to '...' (the misc-menu))
//   //additional to that where are the following magic-values for wellknown othe menüs:
//   //'MY' -> the 'USER-MENU' on the right upper side'
//   public menuFolder: string;

//   //":"start-usecase     nur für dynmische!!!!, weil statische sind immer in einem workpace oder enderen UC drin",
//   public commandType: string;

//   // For commandType=="set-runtime-tag" ##################################

//   // ["tagtoSet", "!tagToToggle", "-tagToRemove"]
//   public tagsToSet?: string[];

//   // For commandType=="navigate" ##################################
//   public routerLink?: any;

//   // For commandType=="activate-workspace" ##################################
//   public targetWorkspaceKey?: string;

//   // For commandType=="start-usecase" ##################################
//   public targetUsecaseKey?: string;

//   // "useCaseArgumentMapping":{ "idToEdit": "selectedId (PropAmQuellUc), für alle anderen vom widget geforderten args geht ein modaler dialog auf"},
// }
