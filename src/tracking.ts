import {
  clearUserData,
  disableAnonymousTracking,
  enableAnonymousTracking,
  newTracker,
  trackPageView,
} from "@snowplow/browser-tracker";

const SNOWPLOW_APP_ID = "test-app",
  SNOWPLOW_MINI_COLLECTOR = "http://localhost:9090",
  SNOWPLOW_PRODUCTION_COLLECTOR = "http://localhost:9090";

export interface SnowplowCookieHandler {
  areSnowplowCookiesEnabled(): boolean | Error;
}
export class SnowplowWrapper {
  private readonly cookieHandler: SnowplowCookieHandler;
  private readonly collectorUrl: string = SNOWPLOW_MINI_COLLECTOR;
  private readonly trackerName: string;
  public constructor(
    trackerName: string,
    isProduction: boolean,
    cookieHandler: SnowplowCookieHandler
  ) {
    if (isProduction) {
      this.collectorUrl = SNOWPLOW_PRODUCTION_COLLECTOR;
    }
    this.trackerName = trackerName;
    this.cookieHandler = cookieHandler;
  }
  public isProductionCollector = (): boolean =>
    this.collectorUrl === SNOWPLOW_PRODUCTION_COLLECTOR;
  public initTracker = (): void => {
    if (this.cookieHandler.areSnowplowCookiesEnabled()) {
      newTracker(this.trackerName, this.collectorUrl, {
        appId: SNOWPLOW_APP_ID,
        plugins: [],
        stateStorageStrategy: "cookieAndLocalStorage",
        discoverRootDomain: true,
      });
    } else {
      newTracker(this.trackerName, this.collectorUrl, {
        appId: SNOWPLOW_APP_ID,
        plugins: [],
        anonymousTracking: {
          withSessionTracking: true,
          withServerAnonymisation: true,
        },
        stateStorageStrategy: "cookieAndLocalStorage",
        discoverRootDomain: true,
      });
      console.log("where are not accepting the cookies", newTracker);
    }
  };
  public track = (): void => {
    if (this.cookieHandler.areSnowplowCookiesEnabled()) {
      this.trackWithCookies();
    } else {
      this.trackWithoutCookies();
    }
  };
  private readonly trackWithoutCookies = (): void => {
    enableAnonymousTracking({
      options: { withSessionTracking: true, withServerAnonymisation: true },
      stateStorageStrategy: "cookieAndLocalStorage",
    });
    clearUserData({ preserveSession: false, preserveUser: false });
  };
  private readonly trackWithCookies = (): void => {
    disableAnonymousTracking({ stateStorageStrategy: "cookieAndLocalStorage" });
  };
  public sendPageViewEvent = (): void => {
    this.track();
    trackPageView({}, [this.trackerName]);
  };
}
