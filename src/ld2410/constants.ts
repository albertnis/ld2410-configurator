import type { RadarDataOutputTargetStatus } from "./types";

export const DEFAULT_BLUETOOTH_PASSWORD = "HiLink";
export const DEFAULT_SERIAL_BAUD_RATE = 256000;

export const MAX_SENSOR_DISTANCE_CM = 600;

export const configurationPayloadHeader = [0xfd, 0xfc, 0xfb, 0xfa];
export const configurationPayloadTrailer = [0x04, 0x03, 0x02, 0x01];

export const readFirmwareVersionCommandWord = 0xa0;
export const getMacAddressCommandWord = 0xa5;
export const enableConfigurationCommandWord = 0xff;

export const endConfigurationCommandWord = 0xfe;
export const readParameterCommandWord = 0x61;
export const maximumDistanceGateCommandWord = 0x60;
export const rangeGateSensitivityCommandWord = 0x64;
export const bluetoothPasswordCommandWord = 0xa8;
export const restartCommandWord = 0xa3;

export const radarDataOutputPayloadHeader = [0xf4, 0xf3, 0xf2, 0xf1];
export const radarDataOutputPayloadTrailer = [0xf8, 0xf7, 0xf6, 0xf5];

export const RadarDataOutputTargetStatusMap: Record<
	number,
	RadarDataOutputTargetStatus
> = {
	0: "NO_TARGET",
	1: "MOVEMENT_TARGET",
	2: "STATIONARY_TARGET",
	3: "MOVEMENT_AND_STATIONARY_TARGET",
};
