/**
 * Variables Globales
 */
var $TABLA_OT = null;
var OT_ID = 0;

var TIPO_REGISTO = {
    Agencia: 1,
    Cliente: 2
};

/**
 * Onload Page
 */
function OnLoadCrear() {
    $("#Fecha").val(FECHA_ACTUAL);

    $('input[type=radio][name=TipoRegistroId]').change(function () { OnChangeTipoRegistro($(this).val()); });

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
            SeleccionarCliente(ui.item.id);
        },
        search: function (event, ui) {
            OT_ID = 0;
            $("#input-filtro-ot").val('');
            $("#contenedor_ot").addClass("hide");
        }
    });

    $('[data-toggle="tooltip"]').tooltip();

    ///Seleccionar la Hora Inicial
    var horaInicial24 = moment(HORA_INICIAL, "hh:mm A").format("HH:mm");
    $("#HoraInicio option").each(function () {
        if ($(this).val() == horaInicial24) {
            $(this).prop("selected", true);
            return false;
        }
    });

    ///Seleccionar la Hora Final
    var horaFinal24 = moment(HORA_FINAL, "hh:mm A").format("HH:mm");
    if (horaFinal24 == '00:00' || horaFinal24 == '24:00')
        horaFinal24 = '23:59';
    $("#HoraFin option").each(function () {
        if ($(this).val() == horaFinal24) {
            $(this).prop("selected", true);
            return false;
        }
    });
}

/**
 * Evento OnChange Tipo de Registro
 * @param {any} e
 */
function OnChangeTipoRegistro(tipoRegistro) {
    if (tipoRegistro == TIPO_REGISTO.Agencia) {
        $("#contenedor_tipo_registro_cliente").addClass("hide");
    } else {
        $("#contenedor_tipo_registro_cliente").removeClass("hide");
    }

    ///Presupuesto
    $("#contenedor_presupuestos").addClass('hidden');
    $("#PresupuestoId").empty();

    ConsultarTipoActividad(tipoRegistro);
}

/**
 * Consultar los tipos de actividad
 * @param {any} tipoRegistro
 */
function ConsultarTipoActividad(tipoRegistro) {
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
    OT_ID = 0;

    $("#ClienteId").val('');
    $("#PresupuestoId").val('');
    $('#contenedor_tabla_ot').addClass("hide");

    if (!Validations._IsNull($TABLA_OT)) {
        $TABLA_OT.destroy();
        $TABLA_OT = null;
    }
}

/**
 * Evento Seleccionar Cliente
 * @param {any} cliente
 */
function SeleccionarCliente(cliente) {
    $("#ClienteId").val(cliente);
    ListarOtsPorCliente();
}

/**
 * Consultar OTs por Cliente
 */
function ListarOtsPorCliente() {
    $('#contenedor_ot').removeClass("hide");
    $('#contenedor_tabla_ot').removeClass("hide");

    if (!Validations._IsNull($TABLA_OT))
        $TABLA_OT.destroy();

    var $filtro = $("#input-filtro-ot");

    $TABLA_OT = $("#tabla_ot").DataTable({
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
                    return '<input type="checkbox" onchange="SeleccionarOt(this)" data_codigo="' + full.Codigo + '" name="checkbox-seleccionar-cliente" value="' + data + '">';
                }
            },
            { "data": "Codigo" },
            { "data": "Referencia" },
            { "data": "Estado" }
        ],
        "order": [[1, "desc"]]
    });

    $('#contenedor_tabla_ot').show();
}

/**
 * Evento Seleccionar OT_ID
 * @param {any} e
 */
function SeleccionarOt(e) {
    $("#contenedor_presupuestos").addClass('hidden');
    $("#PresupuestoId").empty();

    if ($(e).is(':checked')) {
        $("input[type=checkbox][name='checkbox-seleccionar-cliente']").prop('checked', false);
        $("#tabla_ot tbody tr").hide();
        $(e).closest("tr").show();
        $(e).prop('checked', true);
        OT_ID = $(e).val();
    } else {
        OT_ID = null;
        $("#tabla_ot tbody tr").show();
    }

    $("#OtId").val(OT_ID);

    ConsultarPresupuestos(OT_ID);
}

/**
 * Consultar presupuestos
 * @param {any} otId
 */
function ConsultarPresupuestos(otId) {
    var $dropDownList = $("#PresupuestoId");

    if (!Validations._IsNull(otId)) {

        $("#contenedor_presupuestos").removeClass('hidden');

        var parameters = {
            EmpresaId: $("#EmpresaId").val(),
            ClienteId: $("#ClienteId").val(),
            OtId: otId
        };
        Utils._GetDropDownList($dropDownList, URL_PRESUPUESTOS_POR_OT, parameters);
    } else {
        Utils._ClearDropDownList($dropDownList);
    }
}

/**
 * Evento OnBengin Formulario Crear Actividad
 * @param {any} jqXHR
 * @param {any} settings
 */
function OnBeginCrearActividad(jqXHR, settings) {
    var horaInicial = moment($('#HoraInicio').val(), 'hh:mm A');
    var horaFinal = moment($('#HoraFin').val(), 'hh:mm A');

    if (horaFinal.isBefore(horaInicial)) {
        Utils._BuilderMessage("warning", "La Hora Final debe ser mayor que la Hora Inicial.");
        return false;
    }

    var tipoRegistro = $("#TipoRegistroId:checked").val();

    var data = $(this).serializeObject();
    data['HoraInicio'] = moment($('#HoraInicio option:selected').val(), "HH:mm").format("hh:mm A");
    data['HoraFin'] = moment($('#HoraFin option:selected').val(), "HH:mm").format("hh:mm A");

    if (tipoRegistro == TIPO_REGISTO.Cliente) {
        if ($("#ClienteId").val() == 0) {
            Utils._BuilderMessage("warning", "Debe seleccionar un Cliente.");
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
 * Evento OnSuccess Formulario Crear Actividad
 * @param {any} resultado
 */
function OnSuccessCrearActividad(resultado) {
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
function ResetearFiltroTablaOt() {
    $("#input-filtro-ot").val('');
    $('#AnioOtId').val('');
    $('#EstadoId').val('');
    ListarOtsPorCliente();
}