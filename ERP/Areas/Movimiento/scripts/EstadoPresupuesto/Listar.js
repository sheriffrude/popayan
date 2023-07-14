var ARRAY_EMPRESAS = [];
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
    console.info(ARRAY_EMPRESAS);
      PieEmpresa();
    TablaEmpresa();
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
            { "data": "Cantidad" }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}
