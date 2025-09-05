export enum EstadoDescansoMedico {
    REGISTRO_EXITOSO = 'Registro exitoso',
    DOCUMENTACION_INCORRECTA = 'Documentación incorrecta',
    POR_CANJEAR = 'Por Canjear'
}

export enum EstadoCanje {
    CANJE_ORSERVADO = 'Canje observado',
    CANJE_INGRESADO = 'Canje ingresado',
    CANJE_CONFORME = 'Canje conforme'
}

export enum EstadoReembolso {
    REEMBOLSO_INGRESADO = 'Reembolso ingresado',
    REEMBOLSO_REALIZADO = 'Reembolso realizado',
    REEMBOLSO_OBSERVADO = 'Reembolso observado',
    REEMBOLSO_CONFORME = 'Reembolso conforme'
}

export enum EstadoCobro {
    COBRO_INGRESADO = 'Cobro ingresado',
    COBRO_REALIZADO = 'Cobro realizado',
    COBRO_PENDIENTE = 'Cobro pendiente'
}

export enum MensajesObservacion {
    DOCUMENTACION_INCORRECTA = "LA DOCUMENTACIÓN AGREGADA NO CUMPLE LOS REQUISITOS SOLICITADOS",
    CANJE_OBSERVADO = "LA DOCUMENTACIÓN AGREGADA NO CUMPLE LOS REQUISITOS SOLICITADOS",
    REEMBOLSO_OBSERVADO = "LA DOCUMENTACIÓN AGREGADA NO CUMPLE LOS REQUISITOS SOLICITADOS"
}