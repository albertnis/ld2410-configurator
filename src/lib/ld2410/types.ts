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

export type ReadParamterCommandPayload = {
  type: "READ_PARAMETER_COMMAND";
};

export type ReadParamterCommandPayloadAck = {
  type: "READ_PARAMETER_COMMAND_ACK";
  status: "SUCCESS" | "FAILURE";
  maximumDistanceGate: number;
  maximumMovingDistanceGate: number;
  maximumStaticDistanceGate: number;
  sensitivity: Sensitivity;
  timeout: number;
};

export type Sensitivity = {
  0: {
    motion: number;
    rest: number;
  };
  1: {
    motion: number;
    rest: number;
  };
  2: {
    motion: number;
    rest: number;
  };
  3: {
    motion: number;
    rest: number;
  };
  4: {
    motion: number;
    rest: number;
  };
  5: {
    motion: number;
    rest: number;
  };
  6: {
    motion: number;
    rest: number;
  };
  7: {
    motion: number;
    rest: number;
  };
  8: {
    motion: number;
    rest: number;
  };
};

export type MaximumDistanceGateCommandPayload = {
  type: "MAXIMUM_DISTANCE_GATE";
  maximumMovingDistanceGate: number;
  maximumStaticDistanceGate: number;
  timeout: number;
};

export type MaximumDistanceGateCommandAckPayload = {
  type: "MAXIMUM_DISTANCE_GATE_ACK";
  status: "SUCCESS" | "FAILURE";
};

export type RangeGateSensitivityCommandPayload = {
  type: "RANGE_GATE_SENSITIVITY";
  gate: number | "ALL_GATES";
  motionSensitivity: number;
  staticSensitivity: number;
};

export type RangeGateSensitivityCommandAckPayload = {
  type: "RANGE_GATE_SENSITIVITY_ACK";
  status: "SUCCESS" | "FAILURE";
};

export type UnknownPayload = {
  type: "UNKNOWN";
};

export type LD2410WritePayload =
  | EnableConfigurationCommandPayload
  | EndConfigurationCommandPayload
  | ReadFirmwareVerionCommandPayload
  | GetMacAddressPayload
  | ReadParamterCommandPayload
  | RangeGateSensitivityCommandPayload
  | MaximumDistanceGateCommandPayload;

export type LD2410ReadPayload =
  | RadarDataOutputBasicPayload
  | EnableConfigurationCommandAckPayload
  | EndConfigurationCommandAckPayload
  | ReadFirmwareVerionCommandAckPayload
  | GetMacAddressPayloadAck
  | ReadParamterCommandPayloadAck
  | MaximumDistanceGateCommandAckPayload
  | RangeGateSensitivityCommandAckPayload
  | UnknownPayload;

export type LD2410Payload = LD2410WritePayload | LD2410ReadPayload;
