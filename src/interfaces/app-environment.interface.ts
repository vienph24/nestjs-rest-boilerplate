export interface IAppEnvironment {
  initialize(): void;
  enableCors(): void;
  enableGlobalPrefix(): void;
  enableGlobalPipes(): void;
  enableCompression(): void;
  setupDocument(): void;
  setRequestSizeLimit(): void;
  setLogLevel(): void;
}
