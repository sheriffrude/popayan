$(function () {
    var d = new Date();

    var month = d.getMonth() + 1;

    var mesActual = month;
    $(".mes").each(function (index) {
        var mes = parseInt($(this).attr("data-mes"));
        if (mes < mesActual)
            $(this).prop("readonly", true);
    });
})

function MonstrarMes() {
    var CentroCostoId = $("#CentroCostoId").val();
    var Anio = $("#Anio").val();
    var ClienteId = $("#ClienteId").val();
   
    var parametros = {
        "CentroCostoId": CentroCostoId,
        "Anio": Anio,
        "ClienteId": ClienteId
    };

    $.ajax({
        url: URL_LISTAR_MESES,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (data) {
            
            $("#meses").show();
            $("#Enero").val(data.Enero);
            $("#Febrero").val(data.Febrero);
            $("#Marzo").val(data.Marzo);
            $("#Abril").val(data.Abril);
            $("#Mayo").val(data.Mayo);
            $("#Junio").val(data.Junio);
            $("#Julio").val(data.Julio);
            $("#Agosto").val(data.Agosto);
            $("#Septiembre").val(data.Septiembre);
            $("#Octubre").val(data.Octubre);
            $("#Noviembre").val(data.Noviembre);
            $("#Diciembre").val(data.Diciembre);

        }
    })
}