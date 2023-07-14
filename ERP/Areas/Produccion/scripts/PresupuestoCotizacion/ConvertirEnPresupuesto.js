var PresupuestoCotizacionConvertirEnPresupuesto = {
    ConfirmarConvertir: function () {
        Utils._BuilderConfirmation("Eliminar Ítem", "¿Está seguro de convertir la Cotización en un Presupuesto?", PresupuestoCotizacionConvertirEnPresupuesto.Convertir);
        return false;
    },
    Convertir: function () {
        var parametros = {
            PresupuestoId: PresupuestoConsultar.PRESUPUESTO_ID
        }
        RequestHttp._Post(URL_PRESUPUESTO_COTIZACION_CONVERTIR_EN_PRESUPUESTO, parametros, null, function (response) {
            if (!Validations._IsNull(response)) {
                if (response.state)
                    Utils._BuilderMessage("success", response.message, Utils._ReloadPage);
                else
                    Utils._BuilderMessage("danger", response.message);
            }
        });
    }
}