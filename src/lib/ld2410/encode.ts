import {
  configurationPayloadHeader,
  configurationPayloadTrailer,
  enableConfigurationCommandWord,
  endConfigurationCommandWord,
  getMacAddressCommandWord,
  readFirmwareVersionCommandWord,
} from "./constants";
import type { LD2410WritePayload } from "./types";

export const encodePayloadToByteArray = (
  payload: LD2410WritePayload
): Uint8Array => {
  switch (payload.type) {
    case "ENABLE_CONFIGURATION_COMMAND":
      return new Uint8Array([
        ...configurationPayloadHeader,
        0x04,
        0x00,
        enableConfigurationCommandWord,
        0x00,
        0x01,
        0x00,
        ...configurationPayloadTrailer,
      ]);
    case "END_CONFIGURATION_COMMAND":
      return new Uint8Array([
        ...configurationPayloadHeader,
        0x02,
        0x00,
        endConfigurationCommandWord,
        0x00,
        ...configurationPayloadTrailer,
      ]);
    case "READ_FIRMWARE_VERSION":
      return new Uint8Array([
        ...configurationPayloadHeader,
        0x02,
        0x00,
        readFirmwareVersionCommandWord,
        0x00,
        ...configurationPayloadTrailer,
      ]);
    case "GET_MAC_ADDRESS":
      return new Uint8Array([
        ...configurationPayloadHeader,
        0x04,
        0x00,
        getMacAddressCommandWord,
        0x00,
        0x01,
        0x00,
        ...configurationPayloadTrailer,
      ]);
  }
};
