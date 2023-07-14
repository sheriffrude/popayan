var ORDEN_TRABAJO_CREAR = {
    EMPRESA_ID: null,
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
            console.log(URL_USUARIO_EMPRESA_LISTAR_UNIDAD_NEGOCIO_USUARIOS_POR_EMPRESA);
        }
    },
    OnchangeEmpresa: function (e) {
        ORDEN_TRABAJO_CREAR.EMPRESA_ID = $(e).val();

        if (ORDEN_TRABAJO_CREAR.EMPRESA_ID > 0) {
            var parameters = {
                empresaId: ORDEN_TRABAJO_CREAR.EMPRESA_ID
            };
            var $elementList = $("#ClienteId");
            Utils._GetDropDownList($elementList, URL_USUARIO_CLIENTE_LISTAR_OPCIONES_POR_EMPRESA, parameters);

            var $elementEjecutivoList = $("#EjecutivoId");
            Utils._GetDropDownList($elementEjecutivoList, URL_USUARIO_EMPRESA_LISTAR_OPCIONES_USUARIOS_POR_EMPRESA, parameters);

            var $elementProdEjecutivoList = $("#ProductorEjecutivoId");
            Utils._GetDropDownList($elementProdEjecutivoList, URL_USUARIO_EMPRESA_LISTAR_OPCIONES_USUARIOS_POR_EMPRESA, parameters);

            var $elementUnidadNegocioList = $("#UnidadNegocioId");
            Utils._GetDropDownList($elementUnidadNegocioList, URL_USUARIO_EMPRESA_LISTAR_UNIDAD_NEGOCIO_USUARIOS_POR_EMPRESA, parameters);
        } else {
            var $elementList = $("#ClienteId");
            Utils._ClearDropDownList($elementList);

            var $elementEjecutivoList = $("#EjecutivoId");
            Utils._ClearDropDownList($elementEjecutivoList);

            var $elementProdEjecutivoList = $("#ProductorEjecutivoId");
            Utils._ClearDropDownList($elementProdEjecutivoList);

            var $elementUnidadNegocioList = $("#UnidadNegocioId");
            Utils._ClearDropDownList($elementList);
        }
    },
    OnchangeCliente: function (e) {
        var clienteId = $(e).val();
        if (clienteId > 0) {
            var parameters = {
                empresaId: ORDEN_TRABAJO_CREAR.EMPRESA_ID,
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

