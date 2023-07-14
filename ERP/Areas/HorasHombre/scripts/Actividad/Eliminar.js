function OnLoadEliminar() {
}

function confirmarEliminar() {
    var titulo = "Eliminar registro de actividades";
    var body = "¿Está seguro de eliminar este registro de actividades?";
    Utils._BuilderConfirmation(titulo, body, 'Eliminar', null);
}

function Eliminar() {
    var id = $("#Id").val();

    var parametros = {
        id: id
    };

    RequestHttp._Post(URL_ELIMINAR, parametros, "POST", function (resultado) {
        if (resultado != null) {
            Utils._BuilderMessage("success", resultado.message);
            Utils._CloseModal();
            RecargarCalendario();
        }
    });
}
