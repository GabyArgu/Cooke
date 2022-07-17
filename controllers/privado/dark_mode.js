
//Switch mode
const darkMode = () =>{ 
    localStorage.setItem("style_dark", true);
    document.getElementById('estilos').href = '../../resources/css/style_dark.css'; 
}
const lightMode = () =>{ 
    localStorage.setItem("style_dark", false);
    document.getElementById('estilos').href = ' ' 
}

if(localStorage.getItem("style_dark") === "true"){
    darkMode()
}else{
    
}

document.getElementById("moon").addEventListener("click", ()=>{
    if(localStorage.getItem("style_dark") === "true"){
        lightMode()
    }else{
        darkMode()
    }
})