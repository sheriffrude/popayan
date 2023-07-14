var $TABLA_PRESUPUESTO = null;

$(function () {
    OnLoad();
})

function OnLoad() {
    $("#ClienteId").prop("disabled", true);
    $("#OrdenTrabajoEstadoId").prop("disabled", true);
    $("#OrdenTrabajoId").prop("disabled", true);

    Utils._BuilderDropDown();

    $("#form_buscar_presupuestos")[0].reset();
    $("#form_buscar_presupuestos").submit(function () {
        CrearTablaPresupuestos();
        return false;
    });
}

function OnChangeFiltro(e) {
    var TipoFiltro = $(e).val();

    if (TipoFiltro == 1) {
        $("#contenedor-filtro").show();
        $("#contenedor-numero-presupuesto").hide();
        $("#lista-estado").hide();
        $("#lista-tipo").hide();
    }
    else if (TipoFiltro == 2) {
        $("#contenedor-filtro").hide();
        $("#contenedor-numero-presupuesto").show();
        $("#lista-estado").hide();
        $("#lista-tipo").hide();
    }
    else if (TipoFiltro == 3) {
        $("#contenedor-filtro").hide();
        $("#contenedor-numero-presupuesto").hide();
        $("#lista-estado").show();
        $("#lista-tipo").hide();
    }
    else if (TipoFiltro == 4) {
        $("#contenedor-filtro").hide();
        $("#contenedor-numero-presupuesto").hide();
        $("#lista-estado").hide();
        $("#lista-tipo").show();
    } else {
        $("#contenedor-filtro").hide();
        $("#contenedor-numero-presupuesto").hide();
        $("#lista-estado").hide();
        $("#lista-tipo").hide();
    }
}

function OnChangeEmpresa(e) {
    var empresaId = $(e).val();
    if (Validations._IsNull(empresaId)) {
        $("#ClienteId").prop("disabled", true);
        $("#OrdenTrabajoEstadoId").prop("disabled", true);
        $("#OrdenTrabajoId").prop("disabled", true);

        Utils._ClearDropDownList($("#ClienteId"));
        Utils._ClearDropDownList($("#OrdenTrabajoId"));

        Utils._BuilderDropDown();
        return false;
    } else {
        $("#ClienteId").prop("disabled", false);

        Utils._BuilderDropDown();
    }

    var $dropDownList = $("#ClienteId");
    var parameters = {
        empresaId: empresaId
    };

    Utils._GetDropDownList($dropDownList, URL_CLIENTE_LISTAR_POR_EMPRESA, parameters);
}

function OnChangeCliente(e) {
    var clienteId = $(e).val();

    if (Validations._IsNull(clienteId)) {
        $("#OrdenTrabajoEstadoId").prop("disabled", true);
        $("#OrdenTrabajoId").prop("disabled", true);

        Utils._ClearDropDownList($("#OrdenTrabajoId"));

        Utils._BuilderDropDown();
        return false;
    } else {
        $("#OrdenTrabajoEstadoId").val("").change();
        $("#OrdenTrabajoEstadoId").prop("disabled", false);

        Utils._BuilderDropDown();
    }
}

function OnChangeOrdenTrabajoEstado(e) {
    var estadoOrdenTrabajoId = $(e).val();

    if (Validations._IsNull(estadoOrdenTrabajoId)) {
        $("#OrdenTrabajoId").prop("disabled", true);

        Utils._ClearDropDownList($("#OrdenTrabajoId"));

        Utils._BuilderDropDown();
        return false;
    } else {
        $("#OrdenTrabajoId").prop("disabled", false);

        Utils._BuilderDropDown();
    }

    var empresaId = $("#EmpresaId").val();
    var clienteId = $("#ClienteId").val();
    var $dropDownList = $("#OrdenTrabajoId");

    var parameters = {
        clienteId: clienteId,
        empresaId: empresaId,
        estadoId: estadoOrdenTrabajoId
    };

    Utils._GetDropDownList($dropDownList, URL_ORDEN_TRABAJO_LISTAR, parameters);
}

function CrearTablaPresupuestos() {
    var opcion = $("#FiltroId").val();

    if (Validations._IsNull(opcion)) {
        Utils._BuilderMessage("warning", "Debe seleccionar el campo filtro obligatorio (*)");
        return true;
    }

    var opcion = parseInt(opcion);

    var filtro = null;
    switch (opcion) {
        case 1:
            filtro = $("#OrdenTrabajoId").val()
            if (Validations._IsNull(filtro)) {
                Utils._BuilderMessage("warning", "Debe seleccionar los campos Obligatorios.");
                return true;
            }
            break;
        case 2:
            filtro = $("#PresupuestoId").val()
            if (Validations._IsNull(filtro)) {
                Utils._BuilderMessage("warning", "Debe seleccionar ingresar un Número de presupuesto.");
                return true;
            }
            break;
        case 3:
            filtro = $("#EstadoId").val()
            if (Validations._IsNull(filtro)) {
                Utils._BuilderMessage("warning", "Debe seleccionar un Estado del Presupuesto.");
                return true;
            }
            break;
        case 4:
            filtro = $("#TipoPresupuestoId").val()
            if (Validations._IsNull(filtro)) {
                Utils._BuilderMessage("warning", "Debe seleccionar un Tipo de presupuesto.");
                return true;
            }
            break;
    }

    $("#tabla-oculta").show();

    if ($TABLA_PRESUPUESTO != null)
        $TABLA_PRESUPUESTO.destroy();

    $TABLA_PRESUPUESTO = $("#tabla-presupuestos").DataTable({
        "scrollX": true,
        "ajax": {
            "url": BUSCAR_PRESUPUESTO,
            "type": "POST",
            "data": function (d) {
                d.filtro = filtro;
                d.opcion = opcion;
                return $.extend({}, d, {
                    "adicional": {
                    }
                });
            }
        },
        "columns": [
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return '<div class="container-radio">' +
                        '<input type="radio" name="btn_radio_presupuesto" id="btn_radio_presupuesto_' + data + '" value="' + data + '" onclick="OnClickVerPresupuesto(' + data + ')">' +
                        '<label for="btn_radio_presupuesto_' + data + '"></label>' +
                        '</div>';
                }
            },
            { "data": "Id" },
            { "data": "ConsecutivoInterno" },
            { "data": "ConsecutivoExterno" },
            { "data": "TipoPresupuesto" },
            { "data": "Referencia" },
            {
                "data": "Empresa",
                "width": "10%",
            },
            {
                "data": "Cliente",
                "width": "10%",
            },
            {
                "data": "Producto",
                "width": "10%",
            },
            { "data": "OrdenTrabajo" },
            { "data": "EstadoPresupuesto" },
            { "data": "ValorPresupuesto" },
            { "data": "FechaHoraCreacion" }
        ],
        "order": [[1, "desc"]],
        "pageLength": 20,
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
    return false;
}

function OnClickVerPresupuesto(id) {
    window.open(URL_CONSULTAR_PRESUPUESTO + "/" + id, '_blank');
}
