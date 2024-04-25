import * as Sentry from '@sentry/electron';
import * as CONSTANT from "../shared/constants"
import { InitialiseApplication } from "../shared/setup/AppSetup";

Sentry.init({
  dsn: "https://396e4f7bfb3b4ae856b9b47c829cb556@o1294571.ingest.sentry.io/4506375092633600",
});

InitialiseApplication(CONSTANT.TOOL.NETWORK_TOOL);
