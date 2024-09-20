import * as Sentry from '@sentry/electron';
import * as CONSTANT from "../shared/constants"
import { InitialiseApplication } from "../shared/setup/AppSetup";

Sentry.init({
    dsn: "https://93c089fc6a28856446c8de366ce9836e@o1294571.ingest.sentry.io/4505763516973056",
});

InitialiseApplication(CONSTANT.TOOL.SIMPLE_QA);
