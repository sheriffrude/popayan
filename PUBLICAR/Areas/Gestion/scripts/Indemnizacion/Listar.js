/**
 * Variables globales
 */
var $TABLA_INDEMNIZACION = null;
var FILTRO_UNIDAD_NEGOCIO_ID = 0;
var FILTRO_TIPO_DOCUMENTO_ID = 0;

/**
 * OnLoad Page
 */
$(function () {
    ConstruirTablaIndemnizacion();
    $("#form-filtro-tabla").submit(RecargarTablaIndemnizacion);
});

/**
 * RecargarTablaEmpleado
 */
function RecargarTablaIndemnizacion() {
    if ($TABLA_INDEMNIZACION != null) {
        $TABLA_INDEMNIZACION.draw();
    }
    return false;
}

/**
 * Evento de selección de unidad de negocio
 * @param {any} e
 */
function OnchangeUnidadNegocioIndemnizacion(e) {
    var unidadNegocioId = $(e).val();
    if (unidadNegocioId > 0) {
        FILTRO_UNIDAD_NEGOCIO_ID = unidadNegocioId;
        if ($TABLA_INDEMNIZACION != null) {
            $TABLA_INDEMNIZACION.draw();
        }
    }
}


/**
 * Evento de selección de unidad de negocio
 * @param {any} e
 */
function OnchangeTipoDocumentoIndemnizacion(e) {
    var tipoDocumentoId = $(e).val();
    if (tipoDocumentoId > 0) {
        FILTRO_TIPO_DOCUMENTO_ID = tipoDocumentoId;
        if ($TABLA_INDEMNIZACION != null) {
            $TABLA_INDEMNIZACION.draw();
        }
    }
}

/**
 * ConstruirTablaEmpleado
 */
function ConstruirTablaIndemnizacion() {
    var $filtro = $("#input-filtro");
    $TABLA_INDEMNIZACION = $("#tabla-indemnizacion").DataTable({
        "scrollX": true,
        "ajax": {
            "url": URL_LISTAR_INDEMNIZACION,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {
                        filtroUnidadNegocioId: FILTRO_UNIDAD_NEGOCIO_ID,
                        filtroTipoDocumentoId: FILTRO_TIPO_DOCUMENTO_ID
                    }
                });
            },
        }, "columns": [
            {
                "data": "UnidadNegocio"
            },
            {
                "data": "TipoDocumento"
            },
            {
                "data": "Documento"
            },
            {
                "data": "NombreCompleto"
            },
            {
                "data": "Cargo"
            },
            {
                "data": "FechaIngreso"
            },
            {
                "data": "FechaRetiro"
            },

            {
                "data": "TipoContrato"
            },
            {
                "data": "SalarioBase"
            },
            {
                "data": "BeneficiosNoPrestacionales"
            },
            {
                "data": "Otros"
            },
            {
                "data": "ValorIndemnizacion"
            },
        ]
    });
}
