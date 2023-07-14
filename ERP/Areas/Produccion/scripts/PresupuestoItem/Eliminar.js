/**
 * Object PresupuestoItemEliminar
 */
var PresupuestoItemEliminar = {
    /**
     * Confirmar Eliminar Item
     * @param {any} e
     */
    ConfirmarEliminar: function (e) {
        Utils._BuilderConfirmation("Eliminar Ítem", "¿Está seguro de eliminar el ítem?", PresupuestoItemEliminar.Eliminar, null, e);
        return false;
    },

    /**
     * Eliminar Item
     * @param {any} e
     */
    Eliminar: function (e) {
        var itemId = $(e).val();
        var parametros = {
            id: itemId,
            presupuestoId: PresupuestoConsultar.PRESUPUESTO_ID
        };
        RequestHttp._Post(URL_PRESUPUESTO_ITEM_ELIMINAR, parametros, null, function (response) {
            if (!Validations._IsNull(response)) {
                if (!response.state)
                    Utils._BuilderMessage("danger", response.message);
                else {
                    if (itemId == PresupuestoItemListar.PRESUPUESTO_ITEM_SELECCIONADO)
                        PresupuestoItemListar.PRESUPUESTO_ITEM_SELECCIONADO = null;
                }

                PresupuestoItemListar.RecargarPaginaTabla();
            }
        });
        return false;
    }
}