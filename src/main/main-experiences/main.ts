import * as CONSTANT from "../shared/constants"
import { InitialiseApplication } from "../shared/setup/AppSetup";

//TODO will need a new sentry project for the separate tool
// Sentry.init({
//   dsn: "https://93c089fc6a28856446c8de366ce9836e@o1294571.ingest.sentry.io/4505763516973056",
// });

InitialiseApplication(CONSTANT.TOOL.EXPERIENCE_TOOL);
