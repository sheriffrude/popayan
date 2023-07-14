$(function () {
    EmpresaVer.OnLoad()
});

var EmpresaVer = {
    OnLoad: function () {
        EmpresaVer.CrearTablaDirectores();
        EmpresaVer.CrearTablaRedesSociales();
    },
    CrearTablaDirectores: function () {
        $("#TableDirector").dataTable({
            "order": [[1, "desc"]]
        });
    },
    CrearTablaRedesSociales: function () {
        $("#TableRedes").dataTable({
            "order": [[1, "desc"]]
        });
    }
};