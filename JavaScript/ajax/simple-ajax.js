function ajax(path, mothod, success, error) {
    var xml = new XMLHttpRequest();
    xml.open(mothod, path, true);
    xml.send();
    xml.onload = function() {
        if (xml.readyState == 4 && xml.status == 200) {
            success(xml.responseText);
        } else {
            error(xml.status);
        }
    }
}

