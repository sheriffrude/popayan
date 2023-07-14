function init() {
    var estadoProceso = $("#estadoProceso").val();
    var mensajeProceso = $("#mensajeProceso").val();

    if (estadoProceso == 1)
        Utils._BuilderMessage("success", mensajeProceso, redirigirProceso);
    if (estadoProceso == 0)
        Utils._BuilderMessage("danger", mensajeProceso);
}

function OnBeginFormCrearEmpresaDocumentoLegal(jqXHR, settings) {
    var data = $(this).serializeObject();
    settings.data = jQuery.param(data);
    return true;
}

function OnSucessFormCrearEmpresaDocumentoLegal(result) {
    var tipoRespuesta = (result.state == true) ? "success" : "danger";
    Utils._BuilderMessage(tipoRespuesta, result.message);
}

$(function () {
    init();
});

function redirigirProceso() {
    window.location = urlRedireccion;
}   