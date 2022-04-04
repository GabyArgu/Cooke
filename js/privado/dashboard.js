document.addEventListener("DOMContentLoaded", function(){
  document.querySelectorAll('.sidebar .sidebar-link').forEach(function(element){
    
    element.addEventListener('click', function (e) {

      let nextEl = element.nextElementSibling;
      let parentEl  = element.parentElement;	

        if(nextEl) {
            e.preventDefault();	
            let mycollapse = new bootstrap.Collapse(nextEl);
            
            if(nextEl.classList.contains('show')){
              mycollapse.hide();
            } else {
                mycollapse.show();
                // find other submenus with class=show
                var opened_submenu = parentEl.parentElement.querySelector('.submenu.show');
                // if it exists, then close all of them
                if(opened_submenu){
                  new bootstrap.Collapse(opened_submenu);
                }
            }
        }
    }); // addEventListener
  }) // forEach
}); 

sidebar = document.getElementById('sidebarMenu');
function sidebarToggle ()
{
  if (sidebar.classList.contains('hide')) {
    sidebar.classList.add('show');
    sidebar.classList.remove('hide');
  } else {
    sidebar.classList.add('hide');
    sidebar.classList.remove('show');
  }
}




