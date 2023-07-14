//Onload page
$(function () {
    ORDEN_TRABAJO_LISTAR.OnLoad();
    TAREA_PENDIENTE_LISTAR.OnLoad();
    TAREA_CONTESTADA_LISTAR.OnLoad();
    TAREA_ASIGNADA_LISTAR.OnLoad();
});

var ORDEN_TRABAJO_LISTAR = {
    $TABLA: null,
    ORDEN_TRABAJO_ESTADO: {
        Abierta: 1,
        Cerrada: 2,
        Traslada: 3
    },
    ID_SELECIONADO: 0,
    CODIGOOT: null,
    OPCION: 1,
    CLIENTE: null,
    PRODUCTO: null,
    EMPRESAID: 0,

    OnLoad: function () {
        ORDEN_TRABAJO_LISTAR.CrearTabla();

        $("#form_filtro_tabla_ordenes_trabajo")[0].reset();
        $("#form_filtro_tabla_ordenes_trabajo").submit(ORDEN_TRABAJO_LISTAR.RecargarTabla);
    },
    CrearTabla: function () {
        var $filtro = $("#input-filtro");
        console.log($filtro);
        console.log(URL_ORDEN_TRABAJO_LISTAR);
        ORDEN_TRABAJO_LISTAR.$TABLA = $("#tabla-Ot").DataTable({
            "order": [[8, "desc"]],
            "ajax": {
                "url": URL_ORDEN_TRABAJO_LISTAR,
                "type": "POST",
                "data": function (d) {
                    d.search['value'] = $filtro.val();
                    d.tipoCreacionId = $("#TipoCreacionId").val();
                    d.estado = $("#EstadoId").val();
                    d.anio = $("#AnioId").val();
                    return $.extend({}, d, {
                        "adicional": {}
                    });
                },
            },
            "columns": [
                {
                    "data": "Id",
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        var checked = (ORDEN_TRABAJO_LISTAR.ID_SELECIONADO == data) ? 'checked="checked"' : '';
                        return '<div class="container-radio">' +
                            '<input type="radio" name="radio_button_orden_trabajo" ' + checked + ' id="radio_button_orden_trabajo_' + data + '" value="' + data + '" data-codigo="' + full.Codigo + '" data-producto="' + full.Producto + '" data-cliente="' + full.Cliente + '" onclick="ORDEN_TRABAJO_LISTAR.Seleccionar(this,' + full.EmpresaId + ')" />' +
                            '<label for="radio_button_orden_trabajo_' + data + '" class="custom-radio-label"></label>' +
                            '</div>';
                    }
                },
                {
                    "data": "Codigo",
                    "width": "10%",
                    "render": function (data, type, full, meta) {
                        return (PERMISO_ORDEN_TRABAJO_CONSULTAR)
                            ? '<a href="' + URL_ORDEN_TRABAJO_CONSULTAR + '/' + full.Id + '" data-toggle="modal" data-size="lg" data-target="#"  >' + data + '</a>'
                            : data;
                    }
                },
                { "data": "Referencia" },
                { "data": "NombreEjecutivo" },
                { "data": "NombreDirector" },
                { "data": "Empresa" },
                { "data": "UnidadNegocio" },
                { "data": "Cliente" },
                { "data": "Producto" },
                { "data": "FechaHoraCreacion" },
                { "data": "Estado" },
                {
                    "data": "PresupuestoID",
                    "render": function (data, type, full, meta) {
                        return '<a href="' + URL_ORDEN_TRABAJO_CONSULTAR + '/' + full.Id + '" data-toggle="modal" data-size="lg" data-target="#"  >' + data + '</a>';
                    }
                },
                {
                    "data": "EstadoId",
                    "orderable": false,
                    "width": "5%",
                    "render": function (data, type, full, meta) {
                        if (full.EstadoId != ORDEN_TRABAJO_LISTAR.ORDEN_TRABAJO_ESTADO.Traslada) {
                            var checked = (data == ORDEN_TRABAJO_LISTAR.ORDEN_TRABAJO_ESTADO.Abierta) ? 'checked="checked"' : '';
                            return '<div class="col-md-12 text-center">' +
                                '<input type="checkbox" class="checkbox_cambiar_estado_orden_trabajo" onchange="ORDEN_TRABAJO_LISTAR.ConfirmarCambiarEstado(this)" ' + checked + ' data-toggle="toggle" data-onstyle="success" data-size="mini" value="' + full.Id + '">' +
                                '</div>';
                        }
                        else
                            return "";
                    }
                },
                {
                    "data": "Estado",
                    "orderable": false,
                    "width": "10%",
                    "render": function (data, type, full, meta) {
                        var html = "";
                        if (PERMISO_ORDEN_TRABAJO_EDITAR || PERMISO_ORDEN_TRABAJO_TRASLADAR || PERMISO_ORDEN_TRABAJO_CONSULTAR) {
                            html = '<div class="btn-group">' +
                                '<button type= "button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown"> Acciones <span class="caret"></span ></button>' +
                                '<ul class="dropdown-menu">';
                            if (PERMISO_ORDEN_TRABAJO_CONSULTAR)
                                html += '<li><a href="' + URL_ORDEN_TRABAJO_CONSULTAR + '/' + full.Id + '" data-toggle="modal" data-target="#" data-size="lg" >Ver detalle</a></li>';
                            if (PERMISO_ORDEN_TRABAJO_EDITAR && full.EstadoId == ORDEN_TRABAJO_LISTAR.ORDEN_TRABAJO_ESTADO.Abierta)
                                html += '<li><a href="' + URL_ORDEN_TRABAJO_EDITAR + '/' + full.Id + '" data-toggle="modal" data-target="#" data-size="lg">Editar</a></li>';
                            if (PERMISO_ORDEN_TRABAJO_TRASLADAR && full.EstadoId != ORDEN_TRABAJO_LISTAR.ORDEN_TRABAJO_ESTADO.Traslada)
                                html += '<li><a href="' + URL_ORDEN_TRABAJO_TRASLADAR + '/' + full.Id + '" data-toggle="modal" data-target="#" data-size="lg">Trasladar</a></li>';
                            html += '</ul>' +
                                '</div>';
                        }
                        return html;
                    }
                }

            ],
            "fnRowCallback": function (nRow, aData) {
                var $nRow = $(nRow);
                if (aData.EstadoId == ORDEN_TRABAJO_LISTAR.ORDEN_TRABAJO_ESTADO.Cerrada)
                    $nRow.addClass("bg-red");
                else if (aData.EstadoId == ORDEN_TRABAJO_LISTAR.ORDEN_TRABAJO_ESTADO.Traslada)
                    $nRow.addClass("bg-gray");
                else
                    $nRow.addClass("bg-white");
                return nRow;
            },
            "drawCallback": function (settings) {
                Utils._BuilderModal();

                $(".checkbox_cambiar_estado_orden_trabajo").bootstrapToggle({
                    on: '',
                    off: ''
                });
            }
        });
    },
    RecargarTabla: function () {
        ORDEN_TRABAJO_LISTAR.$TABLA.draw();
        return false;
    },
    RecargarTablaPage: function () {
        ORDEN_TRABAJO_LISTAR.$TABLA.draw("Page");
        return false;
    },
    ResetearFiltroTabla: function () {
        $("#form_filtro_tabla_ordenes_trabajo")[0].reset();
        ORDEN_TRABAJO_LISTAR.RecargarTabla();
        Utils._BuilderDropDown();
    },
    Seleccionar: function (e, empresa) {
        var id = $(e).val();

        ORDEN_TRABAJO_LISTAR.ID_SELECIONADO = id;
        ORDEN_TRABAJO_LISTAR.EMPRESAID = empresa;
        ORDEN_TRABAJO_LISTAR.PRODUCTO = $(e).attr("data-producto");
        ORDEN_TRABAJO_LISTAR.CODIGOOT = $(e).attr("data-codigo");
        ORDEN_TRABAJO_LISTAR.CLIENTE = $(e).attr("data-cliente");
        $("#orden_trabajo_codigo").html($(e).attr("data-codigo"));

        TAREA_LISTAR.OnLoad(id);

        $("#container_ordenes_trabajo_btn_add").show();
        $("#Container_tareas").show();
        
        Utils._BuilderModal();
    },
    ConfirmarCambiarEstado: function (e) {
        var titulo = "";
        var mensaje = "";
        if ($(e).is(":checked")) {
            titulo = "Activar Orden de Trabajo";
            mensaje = "¿Esta seguro de realizar esta acción?";
        } else {
            titulo = "Desactivar Orden de Trabajo";
            mensaje = "¿Esta seguro de realizar esta acción?";
        }
        Utils._BuilderConfirmation(titulo, mensaje, ORDEN_TRABAJO_LISTAR.CambiarEstado, ORDEN_TRABAJO_LISTAR.RecargarTablaPage, e);
        return false;
    },
    CambiarEstado: function (e) {
        var ordenTrabajoId = $(e).val();
        var url = URL_ORDEN_TRABAJO_CAMBIAR_ESTADO + "/" + ordenTrabajoId;
        Utils._OpenModal(url, null, "lg");
    },
    ListarBrief: function () {
        var url = URL_BRIEF_LISTA + "?id=" + ORDEN_TRABAJO_LISTAR.ID_SELECIONADO + "&idEmpresa=" + ORDEN_TRABAJO_LISTAR.EMPRESAID;
        Utils._OpenModal(url, OnLoadListarBrief, "all");
    },
    ListarInformeEntrevista: function () {
        var url = URL_INFORME_ENTREVISTA_LISTAR + "/" + ORDEN_TRABAJO_LISTAR.ID_SELECIONADO;
        Utils._OpenModal(url, INFORME_REUNION_LISTAR.OnLoad, "all");
    },
    preview: function (e) {
        var html = "";
        html = '<img src="' + e +'">';
        
        alert(html);
    },
    OnChangeBloquear: function (e, bloqueo) {
        //PresupuestoConsultar.BLOQUEO = $(e).is(":checked");
        //alert(e.value());
        console.log(bloqueo);
        if (bloqueo == 0) {
            bloqueo = 1;
        } else {
            bloqueo = 0;
        }
        var parametros = {
            ordentrabajoId: ORDEN_TRABAJO_LISTAR.ID_SELECIONADO,
            estado: bloqueo
        };
        RequestHttp._Post(URL_ORDEN_TRABAJO_BLOQUEO, parametros, null, function (response) {
            if (!Validations._IsNull(response)) {
                if (response.state) {
                    Utils._BuilderMessage("success", response.message, Utils._ReloadPage);
                } else {
                    Utils._BuilderMessage("danger", response.message);
                }
            }
        });
        //alert(URL_ORDEN_TRABAJO_BLOQUEO);
        console.log(ORDEN_TRABAJO_LISTAR.ID_SELECIONADO);
    }
}