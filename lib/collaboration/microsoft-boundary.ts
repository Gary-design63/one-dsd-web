export type MicrosoftBridgeSelection = {
  adapter: "attended_personal_teams_bridge";
  status: "off";
  connected: false;
  readsExternalData: false;
  writesExternalData: false;
  nativeWorkspaceIsAuthoritative: true;
  environment: "Gary-controlled personal Microsoft account";
  surface: "Teams Free Community and channel";
  operatingRule: string;
  durableOption: "independent_m365_tab_bot_graph";
};

/**
 * Stage Zero records the selected route without exposing a transport. Nothing in this
 * module can authenticate to, read from, or write to Microsoft or an agency system.
 */
export function getMicrosoftBridgeState(): MicrosoftBridgeSelection {
  return {
    adapter: "attended_personal_teams_bridge",
    status: "off",
    connected: false,
    readsExternalData: false,
    writesExternalData: false,
    nativeWorkspaceIsAuthoritative: true,
    environment: "Gary-controlled personal Microsoft account",
    surface: "Teams Free Community and channel",
    operatingRule:
      "A future pilot must be attended, use synthetic information, verify the account and destination, prevent duplicates, and require review before every send.",
    durableOption: "independent_m365_tab_bot_graph",
  };
}
