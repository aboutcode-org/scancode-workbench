const toggleBtn = document.getElementById('toggle-btn');
const sidebarWrapper = document.getElementById('sidebar-wrapper');
const sideNav = document.getElementsByClassName('sidebar-nav')[0];
const sideNav_para = document.getElementsByClassName('sidebar-nav')[0].getElementsByTagName('p');

toggleBtn.addEventListener('click', () => {
  if (sideNav.style.width === '250px') {
    sideNav.style.width = '50px';
    sidebarWrapper.style.width = '50px';
    Array.from(sideNav_para).forEach((element) => {
      element.style.display = 'none';
    });
  }
  else {
    sideNav.style.width = '250px';
    sidebarWrapper.style.width = '250px';
    sidebarWrapper.style.overflowX = 'hidden';
    Array.from(sideNav_para).forEach((element) => {
      element.style.display = 'inline-block';
    });
  }
}); 