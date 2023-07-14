/**
 * Object PresupuestoItemAsociadoCrear
 */
var PresupuestoItemAsociadoCrear = {
    /**
    * Crear Asociado
    **/
    Crear: function () {
        var parametros = {
            presupuestoId: PresupuestoConsultar.PRESUPUESTO_ID,
            itemId: PresupuestoItemAsociadoListar.ITEM_ID,
            itemAsociadoSeleccionadoId: PresupuestoItemAsociadoListar.ASOCIADO_SELECCIONADO
        };

        RequestHttp._Post(URL_PRESUPUESTO_ITEM_ASOCIADO_CREAR, parametros, null, function (response) {
            if (!Validations._IsNull(response)) {
                if (response.state) {
                    PresupuestoItemAsociadoListar.RecargarPaginaTabla();
                    PresupuestoItemListar.RecargarPaginaTabla();
                } else
                    Utils._BuilderMessage("danger", response.message);
            }
        });
    }
}