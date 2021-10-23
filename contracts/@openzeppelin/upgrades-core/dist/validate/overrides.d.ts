import { ValidationError } from './run';
import { ProxyDeployment } from '../manifest';
export interface ValidationOptions {
    unsafeAllowCustomTypes?: boolean;
    unsafeAllowLinkedLibraries?: boolean;
    unsafeAllow?: ValidationError['kind'][];
    kind?: ProxyDeployment['kind'];
}
export declare const ValidationErrorUnsafeMessages: Record<ValidationError['kind'], string[]>;
export declare function withValidationDefaults(opts: ValidationOptions): Required<ValidationOptions>;
export declare function processExceptions(contractName: string, errors: ValidationError[], opts: ValidationOptions): ValidationError[];
export declare function silenceWarnings(): void;
export declare function isSilencingWarnings(): boolean;
//# sourceMappingURL=overrides.d.ts.map