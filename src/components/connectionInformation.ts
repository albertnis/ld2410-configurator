import { stateUpdates } from "@/client";
import { queryElement } from "@/dom/queryTemplateElement";
import { filter, map } from "rxjs";

const elements = {
  firmwareVersion: queryElement(".connectionInformation-firmwareVersion"),
  macAddress: queryElement(".connectionInformation-macAddress"),
  protocolVersion: queryElement(".connectionInformation-protocolVersion"),
  disconnectButton: queryElement(".connectionInformation-disconnectButton"),
};

stateUpdates
  .pipe(
    map((x) => x.firmwareVersion),
    filter((x) => x != null)
  )
  .subscribe((x) => {
    elements.firmwareVersion.innerHTML = x;
  });

stateUpdates
  .pipe(
    map((x) => x.macAddress),
    filter((x) => x != null)
  )
  .subscribe((x) => {
    elements.macAddress.innerHTML = x;
  });

stateUpdates
  .pipe(
    map((x) => x.protocolVersion),
    filter((x) => x != null)
  )
  .subscribe((x) => {
    elements.protocolVersion.innerHTML = x.toString();
  });

elements.disconnectButton.addEventListener("click", () => {
  window.location.reload();
});
