export enum EstadoDescansoMedico {
    REGISTRO_EXITOSO = 'registro_exitoso',
    DOCUMENTACION_INCORRECTA = 'documentacion_incorrecta',
    POR_CANJEAR = 'por_canjear'
}

export enum EstadoCanje {
    CANJE_ORSERVADO = 'canje_observado',
    CANJE_INGRESADO = 'canje_ingresado',
    CANJE_CONFORME = 'canje_conforme'
}

export enum EstadoReembolso {
    REEMBOLSO_INGRESADO = 'reembolso_ingresado',
    REEMBOLSO_REALIZADO = 'reembolso_realizado',
    REEMBOLSO_OBSERVADO = 'reembolso_observado',
    REEMBOLSO_CONFORME = 'reembolso_conforme'
}

export enum EstadoCobro {
    COBRO_INGRESADO = 'cobro_ingresado',
    COBRO_REALIZADO = 'cobro_realizado',
    COBRO_PENDIENTE = 'cobro_pendiente'
}

// Map enum values to human-readable labels
export const LIST_ESTADOS_DESCANSOS_MEDICOS = {
    [EstadoDescansoMedico.REGISTRO_EXITOSO]: 'Registro exitoso',
    [EstadoDescansoMedico.DOCUMENTACION_INCORRECTA]: 'Documentación incorrecta',
    [EstadoDescansoMedico.POR_CANJEAR]: 'Por canjear',
};

export const LIST_ESTADOS_CANJE = {
    [EstadoCanje.CANJE_CONFORME]: 'Canje conforme',
    [EstadoCanje.CANJE_INGRESADO]: 'Canje ingresado',
    [EstadoCanje.CANJE_ORSERVADO]: 'Canje observado',
};

// Map observation types to default messages
export const MENSAJES_OBSERVACION: Record<string, string> = {
    [EstadoDescansoMedico.DOCUMENTACION_INCORRECTA]: "LA DOCUMENTACIÓN AGREGADA NO CUMPLE LOS REQUISITOS SOLICITADOS",
    [EstadoCanje.CANJE_ORSERVADO]: "LA DOCUMENTACIÓN AGREGADA NO CUMPLE LOS REQUISITOS SOLICITADOS",
    [EstadoReembolso.REEMBOLSO_OBSERVADO]: "LA DOCUMENTACIÓN AGREGADA NO CUMPLE LOS REQUISITOS SOLICITADOS"
};