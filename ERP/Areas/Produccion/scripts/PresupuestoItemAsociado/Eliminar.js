var PresupuestoItemAsociadoEliminar = {
    /**
     * Confirmar Eliminar Asociado
     * @param {any} e
     */
    ConfirmarEliminar: function (e) {
        Utils._BuilderConfirmation("Eliminar Asociado", "¿Está seguro de eliminar el asociado?", PresupuestoItemAsociadoEliminar.Eliminar, null, e);
        return false;
    },

    /**
     * Eliminar Asociado
     * @param {any} e
     */
    Eliminar: function (e) {
        var asociadoId = $(e).val();
        var itemId = $(e).attr("data-item-id");
        var parametros = {
            itemAsociadoId: asociadoId,
            itemId: itemId,
            presupuestoId: PresupuestoConsultar.PRESUPUESTO_ID
        };

        RequestHttp._Post(URL_PRESUPUESTO_ITEM_ASOCIADO_ELIMINAR, parametros, null, function (response) {
            if (!Validations._IsNull(response)) {
                if (!response.state)
                    Utils._BuilderMessage("danger", response.message);
                else {
                    if (asociadoId == PresupuestoItemAsociadoListar.ASOCIADO_SELECCIONADO)
                        PresupuestoItemAsociadoListar.ASOCIADO_SELECCIONADO = null;

                    PresupuestoItemAsociadoListar.RecargarPaginaTabla();
                    PresupuestoItemListar.RecargarPaginaTabla();
                }
            }
        });
        return false;
    }
}