/**
 * AprobacionLegalizacionResponder
 */
var AprobacionLegalizacionResponder = {
    APROBACION_STATUS: {
        Aprobar: 2,
        Rechazar: 3
    },
    APROBACION_STATUS_OPCION: null,

    Aprobar: function () {
        AprobacionLegalizacionResponder.APROBACION_STATUS_OPCION = AprobacionLegalizacionResponder.APROBACION_STATUS.Aprobar;
        $("#form_aprobacion_legalizacion_responder").submit();
    },

    Rechazar: function () {
        AprobacionLegalizacionResponder.APROBACION_STATUS_OPCION = AprobacionLegalizacionResponder.APROBACION_STATUS.Rechazar;
        $("#form_aprobacion_legalizacion_responder").submit();
    },
    OnBegin: function (jqXHR, settings) {
        if (Validations._IsNull(AprobacionLegalizacionResponder.APROBACION_STATUS_OPCION)) {
            Utils._BuilderMessage("warning", "Debe Aprobar o Rechazar para poder continuar.");
            return false;
        }
        var data = $(this).serializeObject();
        data["AprobacionStatusId"] = AprobacionLegalizacionResponder.APROBACION_STATUS_OPCION;
        settings.data = jQuery.param(data);
        return true;
    },
    OnComplete: function (response) {
        var resultado = RequestHttp._ValidateResponse(response);
        if (resultado != null) {
            if (resultado.state) {
                Utils._BuilderMessage("success", resultado.message);
                Utils._CloseModal();
            }
            else
                Utils._BuilderMessage("danger", resultado.message);

            AprobacionLegalizacionListar.RecargarTablaPage();
        }
    }
}