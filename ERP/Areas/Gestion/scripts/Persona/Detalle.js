var FILE = null;

$(function () {
    $("#FechaNacimiento").datepicker({ maxDate: '0' });
    $("#Foto").val('');
});

function RedireccionarListarPersonas() {
    window.location.href = URL_LISTAR_PERSONAS;
}