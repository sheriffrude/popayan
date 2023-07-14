var ORDEN_TRABAJO_TRALADO = {
    OnComplete: function (response) {
        var resultado = RequestHttp._ValidateResponse(response);
        if (resultado != null) {
            var tipoMensaje = "danger";
            if (resultado.state == true) {
                tipoMensaje = "success";
                ORDEN_TRABAJO_LISTAR.ResetearFiltroTabla();
                $("#input-filtro").val(resultado.data);
                ORDEN_TRABAJO_LISTAR.RecargarTabla();

                Utils._CloseModal();
            }
            Utils._BuilderMessage(tipoMensaje, resultado.message);
            ORDEN_TRABAJO_LISTAR.RecargarTabla();
        }
    },
    OnchangeCliente: function (e) {
        var clienteId = $(e).val();
        if (clienteId > 0) {
            var parameters = {
                empresaId: $("#EmpresaId").val(),
                clienteId: clienteId
            };
            var $elementList = $("#ProductoId");
            Utils._GetDropDownList($elementList, URL_USUARIO_CLIENTE_LISTAR_OPCIONES_PRODUCTOS_POR_EMPRESA_Y_CLIENTE, parameters);

            var parametrosCliente = {
                clienteId: clienteId
            }
            var $elementList2 = $("#ProfesionalClienteId");
            Utils._GetDropDownList($elementList2, URL_USUARIO_CLIENTE_LISTAR_OPCIONES_CONTACTOS_POR_CLIENTE, parametrosCliente);
        } else {
            var $elementList = $("#ProductoId");
            Utils._ClearDropDownList($elementList);

            var $elementList2 = $("#ProfesionalClienteId");
            Utils._ClearDropDownList($elementList2);
        }
    },
    //OnchangeProducto: function (e) {
    //    var empresaId = $(e).val();
    //    if (empresaId > 0) {
    //        var parameters = {
    //            id: empresaId
    //        };
    //        var $elementList = $("#SubProductoId");
    //        Utils._GetDataDropDownList($elementList, URL_CAMBIO_PRODUCTO, parameters);
    //    }
    //},
}