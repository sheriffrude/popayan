/**
 * AprobacionPresupuestoResponder
 */
var AprobacionPresupuestoResponder = {
    APROBACION_STATUS: {
        Aprobar: 2,
        Rechazar: 3
    },
    APROBACION_STATUS_OPCION: null,

    Aprobar: function () {
        AprobacionPresupuestoResponder.APROBACION_STATUS_OPCION = AprobacionPresupuestoResponder.APROBACION_STATUS.Aprobar;
        $("#form_aprobacion_presupuesto_responder").submit();
    },
    Rechazar: function () {
        AprobacionPresupuestoResponder.APROBACION_STATUS_OPCION = AprobacionPresupuestoResponder.APROBACION_STATUS.Rechazar;
        $("#form_aprobacion_presupuesto_responder").submit();
    },

    OnBegin: function (jqXHR, settings) {
        if (Validations._IsNull(AprobacionPresupuestoResponder.APROBACION_STATUS_OPCION)) {
            Utils._BuilderMessage("warning", "Debe Aprobar o Rechazar para poder continuar.");
            return false;
        }
        var data = $(this).serializeObject();
        data["AprobacionStatusId"] = AprobacionPresupuestoResponder.APROBACION_STATUS_OPCION;
        settings.data = jQuery.param(data);
        return true;
    },

    OnComplete: function (response) {
        var resultado = RequestHttp._ValidateResponse(response);
        console.log(RequestHttp._ValidateResponse(response));
        if (resultado != null) {
            if (AprobacionPresupuestoResponder.APROBACION_STATUS_OPCION == 2) {
                Utils._BuilderMessage("success", resultado.message);
                Utils._CloseModal();
            }
            else
                Utils._BuilderMessage("danger", resultado.message);
            AprobacionPresupuestoListar.RecargarTablaPage();
        }
    }
}