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

export type EnableConfigurationCommandPayload = {
  type: "ENABLE_CONFIGURATION_COMMAND";
};

export type EnableConfigurationCommandAckPayload = {
  type: "ENABLE_CONFIGURATION_COMMAND_ACK";
  status: "SUCCESS" | "FAILURE";
  protocolVersion: number;
  bufferSize: number;
};

export type EndConfigurationCommandPayload = {
  type: "END_CONFIGURATION_COMMAND";
};

export type EndConfigurationCommandAckPayload = {
  type: "END_CONFIGURATION_COMMAND_ACK";
  status: "SUCCESS" | "FAILURE";
};

export type ReadFirmwareVerionCommandPayload = {
  type: "READ_FIRMWARE_VERSION";
};

export type ReadFirmwareVerionCommandAckPayload = {
  type: "READ_FIRMWARE_VERSION_ACK";
  status: "SUCCESS" | "FAILURE";
  majorVersion: string;
  minorVersion: string;
};

export type GetMacAddressPayload = {
  type: "GET_MAC_ADDRESS";
};

export type GetMacAddressPayloadAck = {
  type: "GET_MAC_ADDRESS_ACK";
  status: "SUCCESS" | "FAILURE";
  macAddress: string;
};

export type UnknownPayload = {
  type: "UNKNOWN";
};

export type LD2410WritePayload =
  | EnableConfigurationCommandPayload
  | EndConfigurationCommandPayload
  | ReadFirmwareVerionCommandPayload
  | GetMacAddressPayload;

export type LD2410ReadPayload =
  | RadarDataOutputBasicPayload
  | EnableConfigurationCommandAckPayload
  | EndConfigurationCommandAckPayload
  | ReadFirmwareVerionCommandAckPayload
  | GetMacAddressPayloadAck
  | UnknownPayload;

export type LD2410Payload = LD2410WritePayload | LD2410ReadPayload;
