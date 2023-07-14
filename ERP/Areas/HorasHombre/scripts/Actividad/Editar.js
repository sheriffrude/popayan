/**
 * Variables Globales
 */
var $TABLA_OT_EDITAR = null;
var OT_ID_EDITAR = 0;

var TIPO_REGISTO = {
    Agencia: 1,
    Cliente: 2
};

/**
 * Onload Page
 */
function OnLoadEditar() {
    $("#Fecha").val(FECHA_ACTUAL);

    $('input[type=radio][name=TipoRegistroId]').change(function () { OnChangeTipoRegistroEditar($(this).val()); });

    ///Autocompletar de cliente
    $(".cliente").autocomplete({
        source: function (request, response) {
            var empresaId = $("#EmpresaId").val();
            if (empresaId == 0) {
                Utils._BuilderMessage("warning", "Debe seleccionar una empresa.");
            } else {
                $.ajax({
                    url: URL_CLIENTES_POR_EMPRESA,
                    type: "POST",
                    dataType: "json",
                    data: {
                        Filtro: request.term,
                        EmpresaId: $("#EmpresaId").val()
                    },
                    success: function (result) {
                        if (result.state == true) {
                            response(result.data);
                            var total = result.data.length;
                            if (total == 0) {
                                Utils._BuilderMessage("danger", "No existen clientes con este nombre asociados a la empresa!");
                            }
                        } else {
                            Utils._BuilderMessage("danger", result.message);
                        }
                    },
                    error: function(request, status, error) {
                        Utils._BuilderMessage("danger", error);
                    }
                });
            };
        },
        minLength: 2,
        select: function (event, ui) {
            $("#contenedor_ot").removeClass("hide");
            SeleccionarClienteEditar(ui.item.id);
        },
        search: function (event, ui) {
            OT_ID_EDITAR = 0;
            $("#input-filtro-ot").val('');
            $("#contenedor_ot").addClass("hide");
        }
    });

    $('[data-toggle="tooltip"]').tooltip();

    if (!Validations._IsNull($("#ClienteId").val()))
        ListarOtsPorClienteEditar();
}

/**
 * Evento OnChange Tipo de Registro
 * @param {any} e
 */
function OnChangeTipoRegistroEditar(tipoRegistro) {
    if (tipoRegistro == TIPO_REGISTO.Agencia) {
        $("#contenedor_tipo_registro_cliente").addClass("hide");
    } else {
        $("#contenedor_tipo_registro_cliente").removeClass("hide");
    }

    ///Presupuesto
    $("#contenedor_presupuesto").addClass('hidden');
    $("#PresupuestoId").empty();

    ConsultarTipoActividadEditar(tipoRegistro);
}

/**
 * Consultar los tipos de actividad
 * @param {any} tipoRegistro
 */
function ConsultarTipoActividadEditar(tipoRegistro) {
    var $dropDownList = $("#TipoActividadId");
    var parameters = {
        TipoRegistro: tipoRegistro
    };
    Utils._GetDropDownList($dropDownList, URL_LISTA_TIPOS_ACTIVIDADES, parameters);
}

/**
 * Evento OnChange Empresa
 * @param {any} e
 * @param {any} url
 */
function OnChangeEmpresa(e, url) {
    OT_ID_EDITAR = 0;

    $("#ClienteId").val('');
    $("#PresupuestoId").val('');
    $('#contenedor_tabla_ot').addClass("hide");

    if (!Validations._IsNull($TABLA_OT_EDITAR)) {
        $TABLA_OT_EDITAR.destroy();
        $TABLA_OT_EDITAR = null;
    }
}

/**
 * Evento Seleccionar Cliente
 * @param {any} cliente
 */
function SeleccionarClienteEditar(cliente) {
    $("#ClienteId").val(cliente);
    ListarOtsPorClienteEditar();
}

/**
 * Consultar OTs por Cliente
 */
function ListarOtsPorClienteEditar() {
    $('#contenedor_ot').removeClass("hide");
    $('#contenedor_tabla_ot').removeClass("hide");

    if (!Validations._IsNull($TABLA_OT_EDITAR))
        $TABLA_OT_EDITAR.destroy();

    var $filtro = $("#input-filtro-ot");

    $TABLA_OT_EDITAR = $("#tabla_ot_editar").DataTable({
        "destroy": true,
        "ajax": {
            "url": URL_OT_POR_CLIENTE,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                d.empresaId = $("#EmpresaId").val();
                d.clienteId = $("#ClienteId").val();
                d.anio = $("#AnioOt").val();
                d.estado = $("#EstadoOtId").val();
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
                    return '<input type="checkbox" onchange="SeleccionarOtEditar(this)" data_codigo="' + full.Codigo + '" name="checkbox-seleccionar-cliente" value="' + data + '">';
                }
            },
            { "data": "Codigo" },
            { "data": "Referencia" },
            { "data": "Estado" }
        ],
        "order": [[1, "desc"]],
        "drawCallback": function (settings) {
            var otId = $("#OtId").val();
            if (!Validations._IsNull(otId))
                $("#tabla_ot_editar").find("input[type=checkbox][value=" + otId + "]").prop("checked", true).trigger("change");
        }
    });

    $('#contenedor_tabla_ot').removeClass("hide");
}

/**
 * Evento Seleccionar OT_ID_EDITAR
 * @param {any} e
 */
function SeleccionarOtEditar(e) {
    $("#contenedor_presupuesto").addClass('hidden');
    $("#PresupuestoId").empty();

    if ($(e).is(':checked')) {
        $("input[type=checkbox][name='checkbox-seleccionar-cliente']").prop('checked', false);
        $("#tabla_ot_editar tbody tr").hide();
        $(e).closest("tr").show();
        $(e).prop('checked', true);
        OT_ID_EDITAR = $(e).val();
    } else {
        OT_ID_EDITAR = null;
        $("#tabla_ot_editar tbody tr").show();
        $("#contenedor_presupuestos").addClass('hidden');
        $("#PresupuestoId").attr("data-id", null);
    }

    $("#OtId").val(OT_ID_EDITAR);

    ConsultarPresupuestosEditar(OT_ID_EDITAR);
}

/**
 * Consultar presupuestos
 * @param {any} otId
 */
function ConsultarPresupuestosEditar(otId) {
    var $dropDownList = $("#PresupuestoId");

    if (!Validations._IsNull(otId)) {
        $("#contenedor_presupuestos").removeClass('hidden');

        var parameters = {
            EmpresaId: $("#EmpresaId").val(),
            ClienteId: $("#ClienteId").val(),
            OtId: otId
        };

        var presupuestoId = $("#PresupuestoId").attr("data-id");

        if (Validations._IsNull(presupuestoId))
            Utils._GetDropDownList($dropDownList, URL_PRESUPUESTOS_POR_OT, parameters);
        else
            Utils._GetDropDownList($dropDownList, URL_PRESUPUESTOS_POR_OT, parameters, null, presupuestoId);
    } else {
        Utils._ClearDropDownList($dropDownList);
    }
}

/**
 * Evento OnBengin Formulario Editar Actividad
 * @param {any} jqXHR
 * @param {any} settings
 */
function OnBeginEditarActividad(jqXHR, settings) {
    var horaInicial = moment($('#HoraInicio').val(), 'hh:mm A');
    var horaFinal = moment($('#HoraFin').val(), 'hh:mm A');

    if (horaFinal.isBefore(horaInicial)) {
        Utils._BuilderMessage("warning", "La Hora Final debe ser mayor que la Hora Inicial.");
        return false;
    }

    var tipoRegistroId = $("#TipoRegistroId:checked").val();

    var data = $(this).serializeObject();
    data['HoraInicio'] = moment($('#HoraInicio option:selected').val(), "HH:mm").format("hh:mm A");
    data['HoraFin'] = moment($('#HoraFin option:selected').val(), "HH:mm").format("hh:mm A");

    if (tipoRegistroId == TIPO_REGISTO.Cliente) {
        if ($("#ClienteId").val() == 0) {
            Utils._BuilderMessage("warning", "Debe seleccionar un Cliente.");
            return false;
        }

        if (OT_ID_EDITAR == 0) {
            Utils._BuilderMessage("warning", "Debe Seleccionar por lo menos una OT");
            return false;
        }
    } else {
        data['ClienteId'] = null;
        data['OtId'] = null;
        data['PresupuestoId'] = null;
    }

    settings.data = jQuery.param(data);
    return true;
}

/**
 * Evento OnSuccess Formulario Editar Actividad
 * @param {any} resultado
 */
function OnSuccessEditarActividad(resultado) {
    var tipoResultado = "danger";
    if (resultado.state == true) {
        tipoResultado = "success";
        Utils._CloseModal();
        RecargarCalendario();
    }
    Utils._BuilderMessage(tipoResultado, resultado.message);
}

/**
 * Resetear el filtro de la tabla OT
 */
function ResetearFiltroTablaOtEditar() {
    $("#input-filtro-ot").val('');
    $('#AnioOtId').val('');
    $('#EstadoId').val('');
    ListarOtsPorClienteEditar();
}