import { everyEqual } from "$lib/array/everyEqual";
import {
  configurationPayloadHeader,
  configurationPayloadTrailer,
  enableConfigurationCommandWord,
  endConfigurationCommandWord,
  getMacAddressCommandWord,
  radarDataOutputPayloadHeader,
  radarDataOutputPayloadTrailer,
  RadarDataOutputTargetStatusMap,
  readFirmwareVersionCommandWord,
  readParameterCommandWord,
} from "./constants";
import type { LD2410ReadPayload } from "./types";

export const decodeByteArrayToData = (vals: Uint8Array): LD2410ReadPayload => {
  if (
    everyEqual(vals.slice(0, 4), radarDataOutputPayloadHeader) &&
    everyEqual(vals.slice(-4), radarDataOutputPayloadTrailer)
  ) {
    return {
      type: "RADAR_DATA_OUTPUT",
      dataType: "TARGET_BASIC_INFORMATION",
      targetStatus: RadarDataOutputTargetStatusMap[vals[8]],
      movementTargetDistanceCm: (vals[10] << 8) + vals[9],
      movementTargetEnergy: vals[11],
      stationaryTargetDistanceCm: (vals[13] << 8) + vals[12],
      stationaryTargetEnergy: vals[14],
      detectionDistanceCm: (vals[16] << 8) + vals[15],
    };
  }

  if (
    everyEqual(vals.slice(0, 4), configurationPayloadHeader) &&
    everyEqual(vals.slice(-4), configurationPayloadTrailer)
  ) {
    if (vals[6] === readFirmwareVersionCommandWord) {
      return {
        type: "READ_FIRMWARE_VERSION_ACK",
        status: "SUCCESS",
        majorVersion: (vals[13] + vals[12] * 1e-2).toFixed(2),
        minorVersion: (
          vals[17] * 1e6 +
          vals[16] * 1e4 +
          vals[15] * 1e2 +
          vals[14]
        ).toString(),
      };
    }

    if (vals[6] === getMacAddressCommandWord) {
      return {
        type: "GET_MAC_ADDRESS_ACK",
        status: "SUCCESS",
        macAddress: [...vals.slice(10, 16)]
          .map((x) => x.toString(16).toUpperCase())
          .join(":"),
      };
    }

    if (vals[6] === enableConfigurationCommandWord) {
      return {
        type: "ENABLE_CONFIGURATION_COMMAND_ACK",
        status: vals[8] + vals[9] === 0 ? "SUCCESS" : "FAILURE",
        protocolVersion: (vals[11] << 2) + vals[10],
        bufferSize: (vals[13] << 2) + vals[12],
      };
    }

    if (vals[6] === endConfigurationCommandWord) {
      return {
        type: "END_CONFIGURATION_COMMAND_ACK",
        status: "SUCCESS",
      };
    }

    if (vals[6] === readParameterCommandWord) {
      return {
        type: "READ_PARAMETER_COMMAND_ACK",
        status: vals[8] + vals[9] === 0 ? "SUCCESS" : "FAILURE",
        maximumDistanceGate: vals[11],
        maximumMovingDistanceGate: vals[12],
        maximumStaticDistanceGate: vals[13],
        sensitivity: {
          0: {
            motion: vals[14],
            rest: vals[23],
          },
          1: {
            motion: vals[15],
            rest: vals[24],
          },
          2: {
            motion: vals[16],
            rest: vals[25],
          },
          3: {
            motion: vals[17],
            rest: vals[26],
          },
          4: {
            motion: vals[18],
            rest: vals[27],
          },
          5: {
            motion: vals[19],
            rest: vals[28],
          },
          6: {
            motion: vals[20],
            rest: vals[29],
          },
          7: {
            motion: vals[21],
            rest: vals[30],
          },
          8: {
            motion: vals[22],
            rest: vals[31],
          },
        },
        timeout: (vals[33] << 8) + vals[32],
      };
    }
  }

  return { type: "UNKNOWN" };
};
