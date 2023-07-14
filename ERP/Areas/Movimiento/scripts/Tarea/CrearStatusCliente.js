var TAREA_STATUS_CLIENTE_CREAR = {
    OnLoad: function () {
        $("#FechaEntrega").datetimepicker({
            viewMode: 'days',
            format: 'DD/MM/YYYY',
            minDate: moment()
        });
    },
    OnComplete: function (response) {
        var resultado = RequestHttp._ValidateResponse(response);
        if (resultado != null) {
            var tipoMensaje = "danger";
            if (resultado.state == true) {
                tipoMensaje = "success"
                TAREA_STATUS_CLIENTE_LISTAR.RecargarTablaPage();
                Utils._CloseModal();
            }
            Utils._BuilderMessage(tipoMensaje, resultado.message);
        }
    },
}