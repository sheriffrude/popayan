/**
* Variables globales
*/
var $TABLA_PRESUPUESTO_HISTORICO = null;


/**
 * OnLoad Presupuesto Historico
 */
function OnLoadPresupuestoHistorico() {
    CrearTablaPresupuestoHistorico();
}

/**
 * Crear tabla presupuesto historico
 */
function CrearTablaPresupuestoHistorico() {
    $TABLA_PRESUPUESTO_HISTORICO = $("#tabla_presupuesto_historico").DataTable({
        "scrollX": true,
        "ajax": {
            "url": URL_PRESUPUESTO_HISTORICO_LISTAR,
            "type": "POST",
            "data": function (d) {
                //d.search['value'] = $filtro.val();
                d.presupuestoId = PresupuestoConsultar.PRESUPUESTO_ID;
                return $.extend({}, d, {
                    "adicional": {
                    }
                });
            }
        },
        "columns": [
            { "data": "VersionInterna" },
            { "data": "VersionExterna" },
            { "data": "Referencia" },
            { "data": "FechaVigenciaInicial" },
            { "data": "FechaVigenciaFinal" },
            { "data": "NotaAdicional" },
            { "data": "NumeroAprobacion" },
            { "data": "LugarEjecucion" },
            { "data": "DirigidoA" },
            { "data": "Observaciones" },
            { "data": "EstadoPresupuesto" },
            { "data": "PersonaModificacion" },
            { "data": "FechaHoraModificacion" },
        ],
        "order": [[12, "desc"]],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}
