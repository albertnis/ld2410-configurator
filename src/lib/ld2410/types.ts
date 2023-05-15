export type RadarDataOutputTargetStatus =
  | "NO_TARGET"
  | "MOVEMENT_TARGET"
  | "STATIONARY_TARGET"
  | "MOVEMENT_AND_STATIONARY_TARGET";

export type RadarDataOutputBasicPayload = {
  type: "RADAR_DATA_OUTPUT";
  dataType: "TARGET_BASIC_INFORMATION";
  targetStatus: RadarDataOutputTargetStatus;
  movementTargetDistanceCm: number;
  movementTargetEnergy: number;
  stationaryTargetDistanceCm: number;
  stationaryTargetEnergy: number;
  detectionDistanceCm: number;
};

export type UnknownPayload = {
  type: "UNKNOWN";
};

export type LD2410Payload = RadarDataOutputBasicPayload | UnknownPayload;
