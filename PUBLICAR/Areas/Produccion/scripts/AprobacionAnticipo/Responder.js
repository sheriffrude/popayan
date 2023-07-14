/**
 * AprobacionAnticipoResponder
 */
var AprobacionAnticipoResponder = {
    APROBACION_STATUS: {
        Aprobar: 2,
        Rechazar: 3
    },
    APROBACION_STATUS_OPCION: null,

    Aprobar: function () {
        AprobacionAnticipoResponder.APROBACION_STATUS_OPCION = AprobacionAnticipoResponder.APROBACION_STATUS.Aprobar;
        $("#form_aprobacion_anticipo_responder").submit();
    },

    Rechazar: function () {
        AprobacionAnticipoResponder.APROBACION_STATUS_OPCION = AprobacionAnticipoResponder.APROBACION_STATUS.Rechazar;
        $("#form_aprobacion_anticipo_responder").submit();
    },
    OnBegin: function (jqXHR, settings) {
        if (Validations._IsNull(AprobacionAnticipoResponder.APROBACION_STATUS_OPCION)) {
            Utils._BuilderMessage("warning", "Debe Aprobar o Rechazar para poder continuar.");
            return false;
        }
        var data = $(this).serializeObject();
        data["AprobacionStatusId"] = AprobacionAnticipoResponder.APROBACION_STATUS_OPCION;
        settings.data = jQuery.param(data);
        return true;
    },
    OnComplete: function (response) {
        var resultado = RequestHttp._ValidateResponse(response);
        if (resultado != null) {
            console.log(resultado);
            if (resultado.message == "Transacción finalizada Correctamente.") {
                Utils._BuilderMessage("success", resultado.message);
                Utils._CloseModal();
            }
            else
                Utils._BuilderMessage("danger", resultado.message);

            AprobacionAnticipoListar.RecargarTablaPage();
        }
    }
}