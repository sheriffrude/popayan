var ARRAY_EMPRESAS = [];
var ARRAY_UNIDADES_NEGOCIO = [];
var ARRAY_ = [];
var $TABLA_EMPRESAS = null;
var EMPRESAID = 0;
var $TABLA_UNIDADES_FILTRO = null;
var UNIDADNEGOCIOID = 0;
var DATA_ESTADOS_UNIDAD_NEGOCIO = [];
var ESTADOID = 0;
var CLIENTEID = 0;
var ARRAY_EJECUTIVOS = [];
var EJECUTIVOID = 0;
$(function () {

    $("#FechaInicio").datepicker().datepicker("setDate", new Date());
    $("#FechaFin").datepicker().datepicker("setDate", new Date());

});


function SeleccionarEmpresa(empresaId) {
    var tamano = ARRAY_EMPRESAS.length;
    if (tamano == 0) {
        ARRAY_EMPRESAS.push(empresaId);
    } else {
        for (var i = 0; i < tamano; i++) {
            if (ARRAY_EMPRESAS[i] == empresaId) {
                ARRAY_EMPRESAS.splice(i, 1);
                PieEmpresa();
                return false;
            }
        }
        ARRAY_EMPRESAS.push(empresaId);

    }
    PieEmpresa();
    TablaEmpresa();
}

function TablaEmpresa() {
    $("#tabla_Empresas").removeClass('hidden');
    var fechaInicial = $("#FechaInicio").val();
    var fechaFin = $("#FechaFin").val();
    var $filtro = '';
    $TABLA_PAISES = $("#tabla-Empresas_Reporte").DataTable({
        "bDestroy": true,
        "ajax": {
            "url": URL_TABLA_EMPRESA,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = null;
                d.fechaInicial = fechaInicial;
                d.fechaFinal = fechaFin;
                d.empresasId = ARRAY_EMPRESAS;

            }
        },
        "columns": [
            { "data": "Empresa", },
            { "data": "Cant" }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}


function PieEmpresa() {
    fechaInicial = $("#FechaInicio").val();
    fechaFin = $("#FechaFin").val();
    var parametros = {
        fechaInicial: fechaInicial,
        fechaFinal: fechaFin,
        empresasId: ARRAY_EMPRESAS
    };
    $.ajax({
        url: URL_GRAFICA_EMPRESAS,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (data) {
            obj = data;
            var tam = obj.dataPoints.length;
            if (0 != tam) {
                var chart = new CanvasJS.Chart("chartContainer_pieEmpresas", {
                    backgroundColor: "rgb(232, 232, 232)",
                    title: {
                        text: "Grafica"
                    },
                    exportEnabled: true,
                    animationEnabled: true,
                    legend: {
                        verticalAlign: "center",
                        horizontalAlign: "left",
                        fontSize: 12,
                        fontFamily: "Open Sans",
                        itemclick: function (e) { EmpresaCanvas(e); }
                    },
                    data: [obj]
                });
                chart.render();
            } else {
                $("#chartContainer_pieEmpresas").html("<center><b> NINGÚN DATO DISPONIBLE EN ESTA GRAFICA</b></center>");
            }
        }
    });
}

function EmpresaCanvas(e) {

    ARRAY_UNIDADES_NEGOCIO = [];
    EMPRESAID = (e.dataPoint.Id);
    ArrayUnidadesNegocio();
    $TABLA_UNIDADES_FILTRO = $("#tabla-Unidades_Filtros").DataTable({
        "bDestroy": true,
        "ajax": {
            "url": URL_TABLA_UNIDADES_FILTRO,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = null;
                d.empresaId = EMPRESAID;
            }
        },
        "columns": [
             {
                 "data": "Value",
                 "orderable": false,
                 "searchable": false,
                 "width": "5%",
                 "render": function (data, type, full, meta) {
                     return '  <input type="checkbox" value="' + data + '" onclick="SeleccionarUnidadNegocio(this)" class="custom-radio" checked/>';
                 }
             },
            { "data": "Text" }
        ],
        "drawCallback": function (settings) {

        }
    });
}

function ArrayUnidadesNegocio() {
    var parametros = {
        empresaId: EMPRESAID
    };
    $.ajax({
        url: URL_CONSULTAR_UNIDADES_ARRAY,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (respuesta) {
            var tamano = respuesta.data.length;
            for (var i = 0; i < tamano; i++) {
                ARRAY_UNIDADES_NEGOCIO.push("" + respuesta.data[i]['UnidadNegocio']);
            }
            PieUnidadNegocio();
            TablaUnidadNegocio();
        }
    });
}

function PieUnidadNegocio() {
    $("#chartContainer_pieEmpresas").addClass('hidden');
    $("#tabla_Empresas").addClass('hidden');
    fechaInicial = $("#FechaInicio").val();
    fechaFin = $("#FechaFin").val();

    var parameters = {
        FechaInicial: fechaInicial,
        FechaFinal: fechaFin,
        EmpresasId: EMPRESAID,
        ListaUnidadesNegocioId: ARRAY_UNIDADES_NEGOCIO
    };

    $.ajax({
        url: URL_GRAFICA_UNIDADNEGOCIO,
        type: 'POST',
        dataType: 'json',
        data: parameters,
        success: function (data) {
            obj = data;
            var tam = obj.dataPoints.length;
            if (0 != tam) {
                var chart = new CanvasJS.Chart("chartContainer_pieUnidadesNegocio", {
                    backgroundColor: "rgb(232, 232, 232)",
                    title: {
                        text: "Grafica"
                    },
                    exportEnabled: true,
                    animationEnabled: true,
                    legend: {
                        verticalAlign: "center",
                        horizontalAlign: "left",
                        fontSize: 12,
                        fontFamily: "Open Sans",
                        itemclick: function (e) { UnidadNegocioCanvas(e); }
                    },
                    data: [obj]
                });
                chart.render();
            } else {
                $("#chartContainer_pieUnidadesNegocio").html("<center><b> NINGÚN DATO DISPONIBLE EN ESTA GRAFICA</b></center>");
            }
        }
    });
}


function SeleccionarUnidadNegocio(e) {
    var id = $(e).val();

    var tam = ARRAY_UNIDADES_NEGOCIO.length;
    for (var i = 0; i < tam; i++) {
        if (ARRAY_UNIDADES_NEGOCIO[i] == id) {
            ARRAY_UNIDADES_NEGOCIO.splice(i, 1);
            PieUnidadNegocio();
            TablaUnidadNegocio();
            return false;
        }
    }
    ARRAY_UNIDADES_NEGOCIO.push(id);
    PieUnidadNegocio();
    TablaUnidadNegocio();
}


function TablaUnidadNegocio() {
    $("#tabla_UnidadesNegocio").removeClass('hidden');
    var fechaInicial = $("#FechaInicio").val();
    var fechaFin = $("#FechaFin").val();
    var $filtro = '';
    $TABLA_PAISES = $("#tabla-UnidadesNegocio_Reporte").DataTable({
         "info":false,
        "bDestroy": true,
        "ajax": {
            "url": URL_TABLA_UNIDADNEGOCIO,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = null;
                d.fechaInicial = fechaInicial;
                d.fechaFinal = fechaFin;
                d.empresaId = EMPRESAID;
                d.listUnidadesNegocio = ARRAY_UNIDADES_NEGOCIO;

            }
        },
        "columns": [
            { "data": "Empresa", },
            { "data": "Cant" }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}

function UnidadNegocioCanvas(e) {
    DATA_ESTADOS_UNIDAD_NEGOCIO = [];
    var object = {
        Id: 0,
        Nombre: 'Cerradas'
    }
    DATA_ESTADOS_UNIDAD_NEGOCIO.push(object);
    object = {
        Id: 1,
        Nombre: 'Activas'
    }
    DATA_ESTADOS_UNIDAD_NEGOCIO.push(object);
    UNIDADNEGOCIOID = (e.dataPoint.Id);
    $("#tabla_Estado_UnidadNegocio").removeClass('hidden');
    $TABLA_USUARIO = $("#tabla-Estado_UnidadesNegocio_Reporte").dataTable({
        "info":false,
        "destroy": true,
        "serverSide": false,
        "data": DATA_ESTADOS_UNIDAD_NEGOCIO,
        "columns": [
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return '  <input type="checkbox" value="' + data + '" onclick="SeleccionarEstadoUnidadNegocio(this)" class="custom-radio" checked/>';
                }
            },
            { "data": "Nombre" }
        ]
    });

    PieEstadosUnidad();
    TablaEstadoUnidadNegocio();
}

function PieEstadosUnidad() {
    $("#chartContainer_pieUnidadesNegocio").addClass('hidden');
    $("#tabla_UnidadesNegocio").addClass('hidden');
    fechaInicial = $("#FechaInicio").val();
    fechaFin = $("#FechaFin").val();
    var tam = DATA_ESTADOS_UNIDAD_NEGOCIO.length;
    var arrayEstados = [];
    for (var i = 0; i < tam; i++) {
        arrayEstados[i] = DATA_ESTADOS_UNIDAD_NEGOCIO[i]['Id'];
    }
    var parameters = {
        FechaInicial: fechaInicial,
        FechaFinal: fechaFin,
        EmpresasId: EMPRESAID,
        UnidadNegocioId: UNIDADNEGOCIOID,
        listaEstados: arrayEstados
    };

    $.ajax({
        url: URL_GRAFICA_ESTADOS_UNIDADNEGOCIO,
        type: 'POST',
        dataType: 'json',
        data: parameters,
        success: function (data) {
            obj = data;
            var tam = obj.dataPoints.length;
            if (0 != tam) {
                var chart = new CanvasJS.Chart("chartContainer_pieEstadosUnidadNegocio", {
                    backgroundColor: "rgb(232, 232, 232)",
                    title: {
                        text: "Grafica"
                    },
                    exportEnabled: true,
                    animationEnabled: true,
                    legend: {
                        verticalAlign: "center",
                        horizontalAlign: "left",
                        fontSize: 12,
                        fontFamily: "Open Sans",
                        itemclick: function (e) { UnidadEstadoNegocioCanvas(e); }
                    },
                    data: [obj]
                });
                chart.render();
            } else {
                $("#chartContainer_pieEstadosUnidadNegocio").html("<center><b> NINGÚN DATO DISPONIBLE EN ESTA GRAFICA</b></center>");
            }
        }
    });
}


function SeleccionarEstadoUnidadNegocio(e) {
    var id = $(e).val();
    if (id == 0) {
        var object = {
            Id: 0,
            Nombre: 'Cerradas'
        }
    } else {
        var object = {
            Id: 1,
            Nombre: 'Activas'
        }
    }
 
    var tam = DATA_ESTADOS_UNIDAD_NEGOCIO.length;
    for (var i = 0; i < tam; i++) {
        if (DATA_ESTADOS_UNIDAD_NEGOCIO[i]['Id'] == id) {
            DATA_ESTADOS_UNIDAD_NEGOCIO.splice(i, 1);
            PieEstadosUnidad();
            TablaEstadoUnidadNegocio();
            return false;
        }
    }
  
    DATA_ESTADOS_UNIDAD_NEGOCIO.push(object);
    PieEstadosUnidad();
    TablaEstadoUnidadNegocio();
}



function TablaEstadoUnidadNegocio() {
    $("#tabla_EstadosUnidadesNegocio").removeClass('hidden');
    var fechaInicial = $("#FechaInicio").val();
    var fechaFin = $("#FechaFin").val();
    var $filtro = '';
    var tam = DATA_ESTADOS_UNIDAD_NEGOCIO.length;
    var arrayEstados = [];
    for (var i = 0; i < tam; i++) {
        arrayEstados[i] = DATA_ESTADOS_UNIDAD_NEGOCIO[i]['Id'];
    }
    $TABLA_PAISES = $("#tabla-Estado_Unidades_Negocio_Reporte").DataTable({
        "info": false,
        "bDestroy": true,
        "ajax": {
            "url": URL_TABLA_ESTADOS_UNIDADNEGOCIO,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = null;
                d.fechaInicial = fechaInicial;
                d.fechaFinal = fechaFin;
                d.empresaId = EMPRESAID;
                d.unidadNegocioId = UNIDADNEGOCIOID;
                d.ListaEstados = arrayEstados;

            }
        },
        "columns": [
            { "data": "Empresa", },
            { "data": "Cant" }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}


function UnidadEstadoNegocioCanvas(e) {

    ARRAY_CLIENTES = [];
    ESTADOID = (e.dataPoint.Id);
    var fechaInicial = $("#FechaInicio").val();
    var fechaFin = $("#FechaFin").val();
    ArrayCliente();
    $TABLA_CLIENTES = $("#tabla-Clientes").DataTable({
        "bDestroy": true,
        "ajax": {
            "url": URL_TABLA_CLIENTES,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = null;
                d.empresaId = EMPRESAID;
                d.unidadId = UNIDADNEGOCIOID;
                d.estado = ESTADOID;
                d.fechaInicial = fechaInicial;
                d.fechaFin = fechaFin;
            }
        },
        "columns": [
             {
                 "data": "Value",
                 "orderable": false,
                 "searchable": false,
                 "width": "5%",
                 "render": function (data, type, full, meta) {
                     return '  <input type="checkbox" value="' + data + '" onclick="SeleccionarCliente(this)" class="custom-radio" checked/>';
                 }
             },
            { "data": "Text" }
        ],
        "drawCallback": function (settings) {

        }
    });
}

function SeleccionarCliente(e) {
    var id = $(e).val();

    var tam = ARRAY_CLIENTES.length;
    for (var i = 0; i < tam; i++) {
        if (ARRAY_CLIENTES[i] == id) {
            ARRAY_CLIENTES.splice(i, 1);
            PieCliente();
             TablaCliente();
            return false;
        }
    }

    ARRAY_CLIENTES.push(id);
    PieCliente();
    TablaCliente();

}

function ArrayCliente() {
    var fechaInicial = $("#FechaInicio").val();
    var fechaFin = $("#FechaFin").val();
    var parametros = {
        empresaId: EMPRESAID,
        fechaInicial: fechaInicial,
        fechaFin: fechaFin,
        unidadId : UNIDADNEGOCIOID,
        estado :ESTADOID
    };
    $.ajax({
        url: URL_CONSULTAR_CLIENTE_ARRAY,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (respuesta) {
            var tamano = respuesta.data.length;
            for (var i = 0; i < tamano; i++) {
                ARRAY_CLIENTES.push(respuesta.data[i]['ClienteId']);
            }
             PieCliente();
             TablaCliente();
           
        }
    });
}



function TablaCliente() {
    $("#tabla_Clientes").removeClass('hidden');
    var fechaInicial = $("#FechaInicio").val();
    var fechaFin = $("#FechaFin").val();
    var $filtro = '';
 
    $TABLA_PAISES = $("#tabla-Clientes_Por_Estado").DataTable({
        "info": false,
        "bDestroy": true,
        "ajax": {
            "url": URL_TABLA_CLIENTES_DATA,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = null;
                d.fechaInicial = fechaInicial;
                d.fechaFinal = fechaFin;
                d.empresaId = EMPRESAID;
                d.unidadNegocioId = UNIDADNEGOCIOID;
                d.estado = ESTADOID;
                d.listaClientes = ARRAY_CLIENTES;
            }
        },
        "columns": [
            { "data": "Empresa", },
            { "data": "Cant" }
        ],
        "drawCallback": function (settings) {
         
        }
    });
}

function PieCliente() {

    $("chartContainer_pieEstadosUnidadNegocio").addClass('hidden');
    $("#tabla_EstadosUnidadesNegocio").addClass('hidden');
    fechaInicial = $("#FechaInicio").val();
    fechaFin = $("#FechaFin").val();

    var parameters = {
        FechaInicial: fechaInicial,
        FechaFinal: fechaFin,
        EmpresasId: EMPRESAID,
        UnidadNegocioId: UNIDADNEGOCIOID,
        EstadoUnidad: ESTADOID,
        ListaClientes: ARRAY_CLIENTES
    };

    $.ajax({
        url: URL_GRAFICA_CLIENTE,
        type: 'POST',
        dataType: 'json',
        data: parameters,
        success: function (data) {
            obj = data;
            var tam = obj.dataPoints.length;
            if (0 != tam) {
                var chart = new CanvasJS.Chart("chartContainer_pieEstadosUnidadNegocio", {
                    backgroundColor: "rgb(232, 232, 232)",
                    title: {
                        text: "Grafica"
                    },
                    exportEnabled: true,
                    animationEnabled: true,
                    legend: {
                        verticalAlign: "center",
                        horizontalAlign: "left",
                        fontSize: 12,
                        fontFamily: "Open Sans",
                        itemclick: function (e) { Ejecutivos(e); }
                    },
                    data: [obj]
                });
                chart.render();
            } else {
                $("#chartContainer_pieEstadosUnidadNegocio").html("<center><b> NINGÚN DATO DISPONIBLE EN ESTA GRAFICA</b></center>");
            }
        }
    });
}

function Ejecutivos(e) {

    CLIENTEID = (e.dataPoint.Id);
    ARRAY_EJECUTIVOS = [];
    var fechaInicial = $("#FechaInicio").val();
    var fechaFin = $("#FechaFin").val();
    ArrayEjecutivos();
    $TABLA_CLIENTES = $("#tabla-Ejecutivos").DataTable({
        "bDestroy": true,
        "ajax": {
            "url": URL_TABLA_EJECUTIVOS,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = null;
                d.empresaId = EMPRESAID;
                d.unidadId = UNIDADNEGOCIOID;
                d.estado = ESTADOID;
                d.fechaInicial = fechaInicial;
                d.fechaFin = fechaFin;
                d.clienteId = CLIENTEID;
            }
        },
        "columns": [
             {
                 "data": "Value",
                 "orderable": false,
                 "searchable": false,
                 "width": "5%",
                 "render": function (data, type, full, meta) {
                     return '  <input type="checkbox" value="' + data + '" onclick="SeleccionarEjecutivos(this)" class="custom-radio" checked/>';
                 }
             },
            { "data": "Text" }
        ],
        "drawCallback": function (settings) {

        }
    });
}



function ArrayEjecutivos() {

    var fechaInicial = $("#FechaInicio").val();
    var fechaFin = $("#FechaFin").val();

    var parametros = {
        empresaId: EMPRESAID,
        fechaInicial: fechaInicial,
        fechaFin: fechaFin,
        unidadId: UNIDADNEGOCIOID,
        estado: ESTADOID,
        clienteId: CLIENTEID
    };
    $.ajax({
        url: URL_CONSULTAR_EJECUTIVO_ARRAY,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (respuesta) {
            var tamano = respuesta.data.length;
            for (var i = 0; i < tamano; i++) {
                ARRAY_EJECUTIVOS.push(respuesta.data[i]['EjecutivoId']);
            }
            PieEjecutivo();
            TablaEjecutivo();

        }
    });
}


function PieEjecutivo() {

    $("#chartContainer_pieEstadosUnidadNegocio").addClass('hidden');
    $("#tabla_Clientes").addClass('hidden');
    fechaInicial = $("#FechaInicio").val();
    fechaFin = $("#FechaFin").val();

    var parameters = {
        FechaInicial: fechaInicial,
        FechaFinal: fechaFin,
        EmpresasId: EMPRESAID,
        UnidadNegocioId: UNIDADNEGOCIOID,
        EstadoUnidad: ESTADOID,
        clienteId:CLIENTEID,
        ListaEjecutivos: ARRAY_EJECUTIVOS
    };

    $.ajax({
        url: URL_GRAFICA_EJECUTIVO,
        type: 'POST',
        dataType: 'json',
        data: parameters,
        success: function (data) {
            obj = data;
            var tam = obj.dataPoints.length;
            if (0 != tam) {
                var chart = new CanvasJS.Chart("chartContainer_pieEjecutivo", {
                    backgroundColor: "rgb(232, 232, 232)",
                    title: {
                        text: "Grafica"
                    },
                    exportEnabled: true,
                    animationEnabled: true,
                    legend: {
                        verticalAlign: "center",
                        horizontalAlign: "left",
                        fontSize: 12,
                        fontFamily: "Open Sans",
                        itemclick: function (e) { Productos(e); }
                    },
                    data: [obj]
                });
                chart.render();
            } else {
                $("#chartContainer_pieEjecutivo").html("<center><b> NINGÚN DATO DISPONIBLE EN ESTA GRAFICA</b></center>");
            }
        }
    });
}



function TablaEjecutivo() {
    $("#tabla_Ejecutivos").removeClass('hidden');
    var fechaInicial = $("#FechaInicio").val();
    var fechaFin = $("#FechaFin").val();
    var $filtro = '';

    $TABLA_PAISES = $("#tabla-Ejecutivos_Por_Cliente").DataTable({
        "info": false,
        "bDestroy": true,
        "ajax": {
            "url": URL_TABLA_EJECUTIVOS_DATA,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = null;
                d.fechaInicial = fechaInicial;
                d.fechaFinal = fechaFin;
                d.empresaId = EMPRESAID;
                d.unidadNegocioId = UNIDADNEGOCIOID;
                d.estado = ESTADOID;
                d.clienteId = CLIENTEID;
                d.listaEjecutivos = ARRAY_EJECUTIVOS;
            }
        },
        "columns": [
            { "data": "Empresa", },
            { "data": "Cant" }
        ],
        "drawCallback": function (settings) {

        }
    });
}

function SeleccionarEjecutivos(e) {
    var id = $(e).val();

    var tam = ARRAY_EJECUTIVOS.length;
    for (var i = 0; i < tam; i++) {
        if (ARRAY_EJECUTIVOS[i] == id) {
            ARRAY_EJECUTIVOS.splice(i, 1);
            PieEjecutivo();
            TablaEjecutivo();
            return false;
        }
    }
    ARRAY_EJECUTIVOS.push(id);
    PieEjecutivo();
    TablaEjecutivo();

}

function Productos(e) {
    EJECUTIVOID = (e.dataPoint.Id);


    $("#chartContainer_pieEjecutivo").addClass('hidden');
    $("#tabla_Ejecutivos").addClass('hidden');
    fechaInicial = $("#FechaInicio").val();
    fechaFin = $("#FechaFin").val();

    var parameters = {
        FechaInicial: fechaInicial,
        FechaFinal: fechaFin,
        EmpresasId: EMPRESAID,
        UnidadNegocioId: UNIDADNEGOCIOID,
        EstadoUnidad: ESTADOID,
        clienteId: CLIENTEID,
        EjecutivoId: EJECUTIVOID
    };

    $.ajax({
        url: URL_GRAFICA_PRODUCTO,
        type: 'POST',
        dataType: 'json',
        data: parameters,
        success: function (data) {
            obj = data;
            var tam = obj.dataPoints.length;
            if (0 != tam) {
                var chart = new CanvasJS.Chart("chartContainer_pieEProducto", {
                    backgroundColor: "rgb(232, 232, 232)",
                    title: {
                        text: "Grafica"
                    },
                    exportEnabled: true,
                    animationEnabled: true,
                    legend: {
                        verticalAlign: "center",
                        horizontalAlign: "left",
                        fontSize: 12,
                        fontFamily: "Open Sans"
                    },
                    data: [obj]
                });
                chart.render();
            } else {
                $("#chartContainer_pieEProducto").html("<center><b> NINGÚN DATO DISPONIBLE EN ESTA GRAFICA</b></center>");
            }
        }
    });

    TablaProductos();
}




function TablaProductos() {
    $("#tabla_Productos").removeClass('hidden');
    var fechaInicial = $("#FechaInicio").val();
    var fechaFin = $("#FechaFin").val();
    var $filtro = '';

    $TABLA_PAISES = $("#tabla-Productos_Ejecutivo").DataTable({
        "info": false,
        "bDestroy": true,
        "ajax": {
            "url": URL_TABLA_PRODUCTOS_DATA,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = null;
                d.fechaInicial = fechaInicial;
                d.fechaFinal = fechaFin;
                d.empresaId = EMPRESAID;
                d.unidadNegocioId = UNIDADNEGOCIOID;
                d.estado = ESTADOID;
                d.clienteId = CLIENTEID;
                d.ejecutivoId = EJECUTIVOID;
            }
        },
        "columns": [
            { "data": "Empresa", },
            { "data": "Cant" }
        ],
        "drawCallback": function (settings) {

        }
    });
}