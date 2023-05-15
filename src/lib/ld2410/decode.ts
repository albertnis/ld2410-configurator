import { everyEqual } from "$lib/array/everyEqual";
import type { LD2410Payload, RadarDataOutputTargetStatus } from "./types";

const radarDataOutputPayloadHeader = [0xf4, 0xf3, 0xf2, 0xf1];
const radarDataOutputPayloadTrailer = [0xf8, 0xf7, 0xf6, 0xf5];

const RadarDataOutputTargetStatusMap: Record<
  number,
  RadarDataOutputTargetStatus
> = {
  0x00: "NO_TARGET",
  0x01: "MOVEMENT_TARGET",
  0x02: "STATIONARY_TARGET",
  0x03: "MOVEMENT_AND_STATIONARY_TARGET",
};

export const decodeByteArrayToData = (vals: Uint8Array): LD2410Payload => {
  if (
    everyEqual(vals.slice(0, 4), radarDataOutputPayloadHeader) &&
    everyEqual(vals.slice(-4), radarDataOutputPayloadTrailer)
  ) {
    return {
      type: "RADAR_DATA_OUTPUT",
      dataType: "TARGET_BASIC_INFORMATION",
      targetStatus: RadarDataOutputTargetStatusMap[vals[8]],
      movementTargetDistanceCm: (vals[10] << 2) + vals[9],
      movementTargetEnergy: vals[11],
      stationaryTargetDistanceCm: (vals[13] << 2) + vals[12],
      stationaryTargetEnergy: vals[14],
      detectionDistanceCm: (vals[16] << 2) + vals[15],
    };
  }

  return { type: "UNKNOWN" };
};
