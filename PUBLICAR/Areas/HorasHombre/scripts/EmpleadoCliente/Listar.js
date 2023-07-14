///Variables globales
var $TABLA_USUARIOS = null;
var DATA_SELECCIONADOS = [];
var $TABLA_REPORTE = null;
var ANIO = null;
var MES = null;
var FILTROID = 0;
var DATA_USUARIO = [];
var ARRAY_USUARIOSID = [];
var AREAID = 0;
var EMPRESAID = 0;
//Onload page
$(function () {
    // ConstruirTablaUsuarios();
    crearSelectAnos();

    $("#AnioId").change(function () {
        $('#MesId').empty();
        var anio = this.value;
        var mes = moment().format('MM');
        var anioActual = moment().format('YYYY');
        var meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
        var mesesNum = new Array("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12");
        if (anio == anioActual) {
            for (var i = 0 ; i < mes; i++)

                $('#MesId').append($('<option />').val(mesesNum[i]).html(meses[i]));
        } else {
            for (var i = 0 ; i < 12; i++)
                $('#MesId').append($('<option />').val(i).html(meses[i]));
        }

    });

    $('input[type=radio][name=FiltroId]').change(function () {
        DATA_SELECCIONADOS.length = 0;
        $("#input-filtro").val("");
        var empresa = $("#EmpresaId").val();
        if (this.value == 1) {
            $("#TablaUsuarios").removeClass('hidden');
            $("#Bton_GenerarReporte").removeClass('hidden');
            $("#ListaAreas").addClass('hidden');
            $("#content-reporte").addClass("hidden");
            //   FiltrarUsuariosPorEmpresa();
        }
        if (this.value == 2) {

            if (empresa == '') {
                Utils._BuilderMessage("danger", 'Debe seleccionar una empresa!');
                return false;
            } else {
                $("#TablaUsuarios").addClass('hidden');
                $("#Bton_GenerarReporte").removeClass('hidden');
                $("#ListaAreas").removeClass('hidden');
                $("#content-reporte").addClass("hidden");
                ListarAreasPorEmpresa(empresa);
                //FiltrarUsuariosPorArea();
            }

        }
    });

    $('#AnioId').val(new Date().getFullYear());
    cambiarMes();
    $("#form-filtro-reporte").submit(function () { return false; })

    AutoCompletarUsuarios();
});

function ListarAreasPorEmpresa(empresa) {
    var empresa = empresa;
    if (empresa > 0) {
        var parameters = {
            id: empresa
        };
        var $elementList = $("#AreaId");
        Utils._GetDataDropDownList($elementList, URL_LISTAR_AREAS_POR_EMPRESA, parameters);
    }
}

function cambiarMes() {
    $('#MesId').empty();
    var anio = $('#AnioId').val();
    var mes = moment().format('MM');
    var anioActual = moment().format('YYYY');
    var meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
    var mesesNum = new Array("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12");
    if (anio == anioActual) {
        for (var i = 0 ; i < mes; i++)

            $('#MesId').append($('<option />').val(mesesNum[i]).html(meses[i]));
    } else {
        for (var i = 0 ; i < 12; i++)
            $('#MesId').append($('<option />').val(i).html(meses[i]));
    }
}

function crearSelectAnos() {
    for (var i = new Date().getFullYear() ; i >= 2017; i--)
        $('#AnioId').append($('<option />').val(i).html(i));

}

function FiltrarTablaUsuarios() {

    if ($TABLA_USUARIOS != null) {
        $TABLA_USUARIOS.draw();
    }
    return false;
};

function ConstruirTablaUsuarios() {
    var $filtro = $("#input-filtro");
    $TABLA_USUARIOS = $("#tabla-Resultados").DataTable({
        "order": [1, "asc"],
        "ajax": {
            "url": URL_LISTAR_USUARIOS,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            },
        },
        "columns": [
            {
                "data": "UsuarioId",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
                    var checked = (ValidarCheck(data)) ? "checked='checked'" : null;
                    return '<div class="custom-radiobutton">' +
                        '<input type="checkbox"' + checked + ' name="checkbox-usuario" value="' + data + '" onchange="OnChangeSeleccionar(this)" >' +
                        '<label for="radio-cliente-' + data + '"></label>' +
                        '</div>';
                }
            },
            { "data": "Nombre" },
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
};

function FiltrarUsuariosPorEmpresa() {
    var $filtro = $("#input-filtro");

    var empresaId = $("#EmpresaId").val();
    if ($TABLA_USUARIOS != null) {
        $TABLA_USUARIOS.destroy();
    }
    $TABLA_USUARIOS = $("#tabla-Resultados").DataTable({
        "ajax": {
            "url": URL_LISTAR_USUARIOS_POR_EMPRESA,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                d.empresaId = empresaId;
                return $.extend({}, d, {
                    "adicional": {}
                });
            },

        }, "columns": [
            {
                "data": "UsuarioId",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
                    var checked = (ValidarCheck(data)) ? "checked='checked'" : null;

                    return '<div class="custom-radiobutton">' +
                            '<input type="checkbox"' + checked + ' name="checkbox-usuario" value="' + data + '"onchange="OnChangeSeleccionar(this)" >' +
                            '<label for="radio-cliente-' + data + '"></label>' +
                            '</div>';
                }
            },
            { "data": "Nombre" },
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}

function marcar(e) {
    if ($(e).is(":checked")) {
        $("#tabla-Resultados input[name=checkbox-usuario]").each(function () {
            $(this).prop("checked", true);
            DATA_SELECCIONADOS.push($(this).val());
        });

        $("#tabla-Resultados input[name=checkbox-unidad-negocio]").each(function () {
            $(this).prop("checked", true);
            DATA_SELECCIONADOS.push($(this).val());
        });

        $("#tabla-Resultados input[name=checkbox-area]").each(function () {
            $(this).prop("checked", true);
            DATA_SELECCIONADOS.push($(this).val());
        });
    } else {
        var tamanoData = DATA_SELECCIONADOS.length;

        $("#tabla-Resultados input[name=checkbox-usuario]").each(function () {
            $(this).prop("checked", false);
            var id = $(this).val();
            for (var i = 0; i < tamanoData; i++) {
                if (DATA_SELECCIONADOS[i] == id) {
                    DATA_SELECCIONADOS.splice(i, 1);
                    break;
                }
            }
        });

        $("#tabla-Resultados input[name=checkbox-unidad-negocio]").each(function () {
            $(this).prop("checked", false);
            var id = $(this).val();
            for (var i = 0; i < tamanoData; i++) {
                if (DATA_SELECCIONADOS[i] == id) {
                    DATA_SELECCIONADOS.splice(i, 1);
                    break;
                }
            }
        });

        $("#tabla-Resultados input[name=checkbox-area]").each(function () {
            $(this).prop("checked", false);
            var id = $(this).val();
            for (var i = 0; i < tamanoData; i++) {
                if (DATA_SELECCIONADOS[i] == id) {
                    DATA_SELECCIONADOS.splice(i, 1);
                    break;
                }
            }
        });
    }
}

function FiltrarUsuariosPorArea() {
    var $filtro = $("#input-filtro");
    var empresaId = $("#EmpresaId").val();
    if ($TABLA_USUARIOS != null) {
        $TABLA_USUARIOS.destroy();
    }
    $TABLA_USUARIOS = $("#tabla-Resultados").DataTable({
        "info": false,
        "ajax": {
            "url": URL_LISTAR_USUARIOS_POR_AREA,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                d.empresaId = empresaId;
                return $.extend({}, d, {
                    "adicional": {}
                });
            },
        },
        "columns": [
            {
                "data": "UsuarioId",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
                    var checked = (ValidarCheck(data)) ? "checked='checked'" : null;
                    return '<div class="custom-radiobutton">' +
                            '<input type="checkbox" ' + checked + ' name="checkbox-area" id="radio-cliente-' + data + '" value="' + data + '"onchange="OnChangeSeleccionar(this)" >' +
                            '<label for="radio-cliente-' + data + '"></label>' +
                            '</div>';
                }
            },
            { "data": "Nombre" },
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}

function FiltrarUsuariosPorUnidadesNegocio() {
    var $filtro = $("#input-filtro");
    var empresaId = $("#EmpresaId").val();
    if ($TABLA_USUARIOS != null) {
        $TABLA_USUARIOS.destroy();
    }
    $TABLA_USUARIOS = $("#tabla-Resultados").DataTable({
        "ajax": {
            "url": URL_LISTAR_USUARIOS_POR_UNIDAD,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                d.empresaId = empresaId;
                return $.extend({}, d, {
                    "adicional": {}
                });
            },

        }, "columns": [
            {
                "data": "UsuarioId",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {

                    var checked = (ValidarCheck(data)) ? "checked='checked'" : null;
                    return '<div class="custom-radiobutton">' +
                        '<input type="checkbox" ' + checked + ' name="checkbox-unidad-negocio" id="radio-cliente-' + data + '" value="' + data + '" onchange="OnChangeSeleccionar(this)" >' +
                        '<label for="radio-cliente-' + data + '"></label>' +
                        '</div>';

                }
            },
            { "data": "Nombre" },
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}

function ValidarCheck(val) {

    var bandera = false;
    var tamanoData = DATA_SELECCIONADOS.length;
    for (var i = 0; i < tamanoData; i++) {

        if (DATA_SELECCIONADOS[i] == val) {
            bandera = true;
            break
        }
    }
    return bandera;
}

function OnChangeSeleccionar(e) {
    var id = $(e).val();
    if ($(e).is(":checked")) {
        if (!ExisteDatos(id))
            DATA_SELECCIONADOS.push(id);
    } else {
        var tamanoData = DATA_SELECCIONADOS.length;
        for (var i = 0; i < tamanoData; i++) {
            if (DATA_SELECCIONADOS[i] == id) {
                DATA_SELECCIONADOS.splice(i, 1);
                break;
            }
        }
    }
}

function ExisteDatos(id) {
    var existe = false;
    var tamanoData = DATA_SELECCIONADOS.length;
    for (var i = 0; i < tamanoData; i++) {
        if (DATA_SELECCIONADOS[i] == id) {
            existe = true;
            break;
        }
    }
    return existe;
}

function Generar() {
    ARRAY_USUARIOSID = [];
    if ($("#FiltroId").is(':checked')) {
        var tam = DATA_USUARIO.length;
        if (tam == 0) {
            Utils._BuilderMessage("danger", "Debes seleccionar al menos un usuario para continuar.");
            return false;
        }
        USUARIOSID();
        PieUsuarios();
        tablaUsuario();
    } else {
        AREAID = $("#AreaId").val();
        if (AREAID == '') {
            Utils._BuilderMessage("danger", "Debes seleccionar un Area para continuar.");
            return false;
        }
        PieAreas();
        TablaUsuarioPorArea();
    }
}

function USUARIOSID() {
    var tam = DATA_USUARIO.length;
    for (var i = 0; i < tam; i++) {
        ARRAY_USUARIOSID.push(DATA_USUARIO[i]['id']);
    }

}


function PieUsuarios() {
    $("#content-reporte").removeClass("hidden");
    anioId = $("#AnioId option:selected").val();
    mesId = $("#MesId option:selected").val();
    var fecha = '01/' + mesId + '/' + anioId;
    var parametros = {
        fecha: fecha,
        filtro: $("input[type=radio][name=FiltroId]:checked").val(),
        datos: ARRAY_USUARIOSID
    };
    $.ajax({
        url: URL_GRAFICA_PIE,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (data) {
            obj = data;
            var tam = obj.dataPoints.length;
            if (0 != tam) {
                var chart = new CanvasJS.Chart("chartContainer_pie", {
                    title: {
                        text: "Grafica"
                    },
                    data: [obj]
                });
                chart.render();
            } else {
                $("#chartContainer_pie").html("<center><b> NINGÚN DATO DISPONIBLE EN ESTA GRAFICA</b></center>");
            }

        }
    });
}

function tablaUsuario() {
    var SUM = 0;
    var SUMPORCENT = 0;
    var SUMHORAS = 0;
    var $filtro = $("#input-filtro");
    ANIO = $("#AnioId option:selected").val();
    MES = $("#MesId option:selected").val();

    FILTROID = $("input[type=radio][name=FiltroId]:checked").val();
    var fecha = '01/' + MES + '/' + ANIO;
    datos = DATA_SELECCIONADOS;
    filtro = $("input[type=radio][name=FiltroId]:checked").val();
    if ($TABLA_REPORTE != null) {
        $TABLA_REPORTE.destroy();
    }
    $TABLA_REPORTE = $("#tabla-Datos").DataTable({
        "info": false,
        "bPaginate": false,
        "ajax": {
            "url": URL_GRAFICA_TABLA,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                d.fecha = '01/' + MES + '/' + anioId;
                d.filtro = $("input[type=radio][name=FiltroId]:checked").val();
                d.datos = ARRAY_USUARIOSID;
                return $.extend({}, d, {
                    "adicional": {}
                });
            },

        }, "columns": [
            {
                "data": "Empresa",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {

                    if (data == null) {
                        return '<a href="' + URL_MODAL + '?id=' + full.EmpresaId + '"  data-toggle="modal" data-target="#" data-execute-Onload = "OnloadModal" >Agencia</a>';
                    } else {
                        return '<a href="' + URL_MODAL + '?id=' + full.EmpresaId + '"  data-toggle="modal" data-target="#" data-execute-Onload = "OnloadModal" >' + data + '</a>';
                    }
                }
            },
            {
                "data": "Horas",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
                    SUMHORAS += data;
                    return data;
                }
            },
            {
                "data": "Porcentaje",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
                    SUMPORCENT += data;
                    return data.toFixed(2) + "%";
                }
            },
         {
             "data": "Valor",
             "orderable": false,
             "searchable": false,
             "render": function (data, type, full, meta) {
                 SUM += parseInt(data);
                 return '<label data-format-price="">' + parseInt(data) + '</label>';

             }
         },
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
            $("#Horas").html($('<label class="text-right">' + SUMHORAS.toFixed(2) + '</label>'));
            $("#SumPorcent").html($('<label class="text-right"> ' + SUMPORCENT.toFixed(2) + '%</label>'));
            $("#Sumatoria").html($('<label class="text-right" data-format-price="">' + SUM + '</label>'));
            Utils._InputFormatPrice();
        }
    });
}


function PieAreas() {
    $("#content-reporte").removeClass("hidden");
    anioId = $("#AnioId option:selected").val();
    mesId = $("#MesId option:selected").val();
    EMPRESAID = $("#EmpresaId option:selected").val();
    var fecha = '01/' + mesId + '/' + anioId;

    var parametros = {
        fecha: fecha,
        empresaId: EMPRESAID,
        areaId: AREAID
    };
    $.ajax({
        url: URL_GRAFICA_PIE_AREA,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (data) {
            obj = data;
            var tam = obj.dataPoints.length;
            if (0 != tam) {
                var chart = new CanvasJS.Chart("chartContainer_pie", {
                    title: {
                        text: "Grafica"
                    },
                    data: [obj]
                });
                chart.render();
            } else {
                $("#chartContainer_pie").html("<center><b> NINGÚN DATO DISPONIBLE EN ESTA GRAFICA</b></center>");
            }

        }
    });
}


function TablaUsuarioPorArea() {
    var SUM = 0;
    var SUMPORCENT = 0;
    var SUMHORAS = 0;
    var $filtro = $("#input-filtro");
    ANIO = $("#AnioId option:selected").val();
    MES = $("#MesId option:selected").val();
    var fecha = '01/' + MES + '/' + ANIO;
    datos = AREAID;
    if ($TABLA_REPORTE != null) {
        $TABLA_REPORTE.destroy();
    }
    $TABLA_REPORTE = $("#tabla-Datos").DataTable({
        "info": false,
        "bPaginate": false,
        "ajax": {
            "url": URL_TABLA_EMPRESA_AREA,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                d.fecha = '01/' + MES + '/' + anioId;
                d.areaId = datos;
                return $.extend({}, d, {
                    "adicional": {}
                });
            },

        }, "columns": [
            {
                "data": "Empresa",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {

                    if (data == null) {
                        return '<a href="' + URL_MODAL + '?id=' + full.EmpresaId + '"  data-toggle="modal" data-target="#" data-execute-Onload = "OnloadModal" >Agencia</a>';
                    } else {
                        return '<a href="' + URL_MODAL + '?id=' + full.EmpresaId + '"  data-toggle="modal" data-target="#" data-execute-Onload = "OnloadModal" >' + data + '</a>';
                    }
                }
            },
            {
                "data": "Horas",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
                    SUMHORAS += data;
                    return data;
                }
            },
            {
                "data": "Porcentaje",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
                    SUMPORCENT += data;
                    return data.toFixed(2) + "%";
                }
            },
         {
             "data": "Valor",
             "orderable": false,
             "searchable": false,
             "render": function (data, type, full, meta) {

                 SUM += parseInt(data);
                
                 return '<label data-format-price="">' +parseInt(data)+ '</label>';
             }
         },

        ],
        "drawCallback": function (settings) {
           
            Utils._BuilderModal();
            $("#Horas").html($('<label class="text-right">' + SUMHORAS.toFixed(2) + '</label>'));
            $("#SumPorcent").html($('<label class="text-right"> ' + SUMPORCENT.toFixed(2) + '%</label>'));
            $("#Sumatoria").html($('<label class="text-right" data-format-price="">' + SUM + '</label>'));
            Utils._InputFormatPrice();
        }

    });

}


function Pie() {
    anioId = $("#AnioId option:selected").val();
    mesId = $("#MesId option:selected").val();
    var fecha = '01/' + mesId + '/' + anioId;
    var parametros = {
        fecha: fecha,
        filtro: $("input[type=radio][name=FiltroId]:checked").val(),
        datos: DATA_SELECCIONADOS
    };
    $.ajax({
        url: URL_GRAFICA_PIE,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (data) {
            obj = data;
            var tam = obj.dataPoints.length;
            if (0 != tam) {
                var chart = new CanvasJS.Chart("chartContainer_pie", {
                    title: {
                        text: "Grafica"
                    },
                    data: [obj]
                });
                chart.render();
            } else {
                $("#chartContainer_pie").html("<center><b> NINGÚN DATO DISPONIBLE EN ESTA GRAFICA</b></center>");
            }

        }
    });
}

function LimpiarFiltroTablaUsuarios() {
    $("#input-filtro").val("");
    FiltrarTablaUsuarios();
}

function AutoCompletarUsuarios() {

    $("#input-filtro").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: URL_AUTOCOMPLETAR_USUARIO,
                type: "POST",
                dataType: "json",
                data: {
                    filtro: request.term,
                    empresaId: $("#EmpresaId").val(),
                },
                success: function (result) {
                    if (result.state == true) {
                        response(result.data);
                        var total = result.data.length;
                        if (total == 0) {
                            Utils._BuilderMessage("danger", "No existen usuarios asociados a la empresa!");
                        }
                    } else {
                        Utils._BuilderMessage("danger", result.message);
                    }
                },
                error: function(request, status, error) {
                    Utils._BuilderMessage("danger", error);
                }
            });

        },
        minLength: 3,
        select: function (event, ui) {

            seleccionarUsuario(ui.item.id, ui.item.label);
            $(this).val("");
            return false;
        },
        search: function (event, ui) {
        }

    });
    $('[data-toggle="tooltip"]').tooltip();
}


function seleccionarUsuario(id, nombre) {
    var estado = false;
    var tamanoDataSetUsuario = DATA_USUARIO.length;
    if (tamanoDataSetUsuario == 0) {
        DATA_USUARIO.push({
            nombre: nombre,
            id: id
        })
    } else {
        for (var i = 0; tamanoDataSetUsuario > i; i++) {
            if (DATA_USUARIO[i]["id"] == id) {
                estado = false;
                break;
            } else {
                estado = true;
            }
        }
        if (estado == true) {
            DATA_USUARIO.push({
                nombre: nombre,
                id: id
            });
            if ($TABLA_USUARIOS != null)
                $TABLA_USUARIOS.fnDestroy();
        } else {
            Utils._BuilderMessage("danger", "La actividad ya ha sido seleccionada!");
        }
    }

    ContruirTablaUsuarios();
    return false;
}


function ContruirTablaUsuarios() {

    $TABLA_USUARIOS = $("#tabla-Resultados").dataTable({
        "destroy": true,
        "serverSide": false,
        "data": DATA_USUARIO,
        "columns": [
            {
                "title": "nombre",
                "data": "nombre",
                "orderable": false,
            },
            {
                "data": "id",
                "orderable": false,
                "searchable": false,
                "width": "20%",
                "render": function (data, type, full, meta) {
                    return '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="EliminarOpcion(' + data + ')" >';
                }
            }
        ]
    });
}



function EliminarOpcion(id) {
    var tamanoDataSetOpciones = DATA_USUARIO.length;

    for (var i = 0; tamanoDataSetOpciones > i; i++) {
        if (DATA_USUARIO[i]["id"] == id) {
            DATA_USUARIO.splice(i, 1);
            break;
        }
    }

    if ($TABLA_USUARIOS != null) {
        $TABLA_USUARIOS.fnDestroy();
    }
    ContruirTablaUsuarios();
}