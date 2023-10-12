import {
  configurationPayloadHeader,
  configurationPayloadTrailer,
  enableConfigurationCommandWord,
  endConfigurationCommandWord,
  getMacAddressCommandWord,
  maximumDistanceGateCommandWord,
  rangeGateSensitivityCommandWord,
  readFirmwareVersionCommandWord,
  readParameterCommandWord,
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
    case "READ_PARAMETER_COMMAND":
      return new Uint8Array([
        ...configurationPayloadHeader,
        0x02,
        0x00,
        readParameterCommandWord,
        0x00,
        ...configurationPayloadTrailer,
      ]);
    case "MAXIMUM_DISTANCE_GATE":
      return new Uint8Array([
        ...configurationPayloadHeader,
        0x14,
        0x00,
        maximumDistanceGateCommandWord,
        0x00,
        0x00,
        0x00,
        payload.maximumMovingDistanceGate,
        0x00,
        0x00,
        0x00,
        0x01,
        0x00,
        payload.maximumStaticDistanceGate,
        0x00,
        0x00,
        0x00,
        0x02,
        0x00,
        payload.timeout & 0x000000ff,
        (payload.timeout & 0x0000ff00) >> 8,
        0x00,
        0x00,
        ...configurationPayloadTrailer,
      ]);
    case "RANGE_GATE_SENSITIVITY":
      return new Uint8Array([
        ...configurationPayloadHeader,
        0x14,
        0x00,
        rangeGateSensitivityCommandWord,
        0x00,
        0x00,
        0x00,
        payload.gate === "ALL_GATES" ? 0xff : payload.gate,
        payload.gate === "ALL_GATES" ? 0xff : 0x00,
        0x00,
        0x00,
        0x01,
        0x00,
        payload.motionSensitivity,
        0x00,
        0x00,
        0x00,
        0x02,
        0x00,
        payload.staticSensitivity,
        0x00,
        0x00,
        0x00,
        ...configurationPayloadTrailer,
      ]);
    case "BLUETOOTH":
      return new Uint8Array([
        ...configurationPayloadHeader,
        0x04,
        0x00,
        0xa4,
        0x00,
        payload.enabled ? 0x01 : 0x00,
        0x00,
        ...configurationPayloadTrailer,
      ]);
    case "ENGINEERING_MODE":
      return new Uint8Array([
        ...configurationPayloadHeader,
        0x02,
        0x00,
        payload.enabled ? 0x62 : 0x63,
        0x00,
        ...configurationPayloadTrailer,
      ]);
  }
};
