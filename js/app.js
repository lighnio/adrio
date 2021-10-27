"use strict";

// General Simple Functions

// Activities

var activities = [];

// window.onload = function () {
function list_activities() {

  const container_activities = document.getElementById("list_activities");

  // Inputs Form
  const inp_name = document.getElementById("input_name");
  const inp_prec = document.getElementById("input_precedence");
  const inp_time = document.getElementById("input_time");
  
  if (inp_name.value && (inp_prec.value || inp_prec.hasAttribute("disabled")) && inp_time.value ) {
    
    const tr = document.createElement("tr");

    const th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.innerHTML = activities.length + 1;

    const td_name = document.createElement("td");
    td_name.innerHTML = inp_name.value;
    inp_name.value = '';
    
    const td_prec = document.createElement("td");
    // td_prec.innerHTML = inp_prec.value;
    (inp_prec.value ? td_prec.innerHTML = inp_prec.value : td_prec.innerHTML = '---');
    inp_prec.value = '';
    

    const td_time = document.createElement("td");
    td_time.innerHTML = inp_time.value;
    inp_time.value = '';

    // <!-- <tr>
//                         <th scope="row">1</th>
//                         <td>Mark</td>
//                         <td>Otto</td>
//                         <td>@mdo</td>
//                     </tr> -->

    //add and listing

    tr.appendChild(th);
    tr.appendChild(td_name);
    tr.appendChild(td_prec);
    tr.appendChild(td_time);


    // Adding in table
    container_activities.appendChild(tr);

    activities.push({
        id: activities.length,
        name: td_name.innerHTML,
        precedence: activities.length ? td_prec.innerHTML : null,
        time: td_time.innerHTML
    });

    if(activities.length) inp_prec.removeAttribute('disabled');
  } else {

    // Alert
    var alertPlaceholder = document.getElementById("liveAlertPlaceholder");

    function alert(message, type) {
      var wrapper = document.createElement("div");
      wrapper.innerHTML =
        '<div class="alert alert-' +
        type +
        ' alert-dismissible" role="alert">' +
        message +
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';

      alertPlaceholder.append(wrapper);
    }

    alert('Error, empty field', 'danger');
  }
}
// }



// {

//     list: ['a', 'b', 'c'],
//     addActivity: function(name, predecessor = null, time) {
//         this.list.push({
//             name: name,
//             predecessor: predecessor,
//             time: time
//         })
//     },
//     getActivities: function () {
//         return this.list;
//     }
// }

// SPA Functionality

(function () {
  function init() {
    var router = new Router([
      new Route("analize", "analize.html", true),
      new Route("about", "about.html"),
    ]);
  }
  init();
})();

/* ******** */
/*   Nodes  */
/* ******** */
