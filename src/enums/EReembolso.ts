/**
 * @enum EReembolso
 * @description Define los posibles estados para un reembolso
 */
export enum EReembolso {
    REEMBOLSO_INGRESADO = 'Reembolso ingresado',
    PENDIENTE_SUBSIDIO = 'Pendiente de subsidio diario',
    SOLICITUD_ESSALUD = 'Solicitud a ESSALUD',
    REEMBOLSO_OBSERVADO = 'Reembolso observado',
    REEMBOLSO_CORRECTO = 'Reembolso correcto'
}