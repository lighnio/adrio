"use strict";

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

// General Simple Functions
function alert(message, type) {
  // Alert
  var alertPlaceholder = document.getElementById("liveAlertPlaceholder");
  var wrapper = document.createElement("div");
  wrapper.innerHTML =
    '<div class="alert alert-' +
    type +
    ' alert-dismissible" role="alert">' +
    message +
    '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';

  alertPlaceholder.append(wrapper);
}

// Board
// Canvas Element
var cy;
window.addEventListener("load", function () {
  if (document.getElementById("canvas_cont")) {
    loadCanvas();
  } else {
    setTimeout(function () {
      loadCanvas();
    }, 1500);
  }

  function loadCanvas() {
    //Cytoscape initializations
    cy = cytoscape({
      container: document.getElementById("canvas_cont"), // Container to render
      // elements: [ // list of graph elements to start with
      //   { // node a
      //     data: { id: 'a' }
      //   },
      //   { // node b
      //     data: { id: 'b' }
      //   },
      //   { // edge ab
      //     data: { id: 'ab', source: 'a', target: 'b' }
      //   }
      // ],
      style: [
        //Stylesheet for graph
        {
          selector: "node",
          style: {
            "background-color": "#984",
            label: "data(name)",
          },
        },

        {
          selector: "edge",
          style: {
            width: 4,
            "line-color": "#030",
            "target-arrow-color": "#003",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
          },
        },
      ],
      layout: {
        name: "dagre",
        rankDir: "LR",
      },
      zoom: 0.5,
      minZoom: 0.6,
      maxZoom: 2,
    });

    cy.on("tap", "node", (evt) => {
      // evt.target.connectedEdges().animate({
      //   style: { lineColor: "red" },
      // });
      console.log(evt.target.size());
    });

  }

  //adding functions
  setTimeout(function () {
    const load_on_canvas = document.getElementById("load_activities");
    load_on_canvas.addEventListener(
      "mousedown",
      function () {
        if (activities.length > 0) {
          load_on_canvas.setAttribute("data-bs-dismiss", "modal");
          // let counter = cy.elements('node[name != ""]').length;

          for (let a in activities) {
            cy.add([
              {
                group: "nodes",
                data: {
                  id: `Nodo ${activities[a].id}`,
                  name: activities[a].name,
                  precedence: activities[a].precedence,
                  time: activities[a].time,
                },
              },
            ]);

            if (activities[a].precedence) {
              // Calculating Edges Number
              for (let e in activities[a].precedence) {
                // console.log(`precedende for ${activities[a].name}`, activities[a].precedence[e]);
                const prec_id = cy
                  .elements(`node[name = "${activities[a].precedence[e]}"]`)
                  .data("id");
                const prec_name = cy
                  .elements(`node[name = "${activities[a].precedence[e]}"]`)
                  .data("name");
                const this_id = cy
                  .elements(`node[name = "${activities[a].name}"]`)
                  .data("id");
                const this_name = cy
                  .elements(`node[name = "${activities[a].name}"]`)
                  .data("name");
                // console.log(`${activities[a].name}: `,prec_id);
                cy.add([
                  {
                    group: "edges",
                    data: {
                      id: `${prec_name} to ${this_name}`,
                      source: `${prec_id}`,
                      target: `${this_id}`,
                    },
                  },
                ]);
              }
            }
          }
          var layout = cy.makeLayout({ name: "dagre", rankDir: "LR" });
          layout.run();
          cy.fit();
        } else {
          alert("Not activities yet.", "danger");
        }
      },
      1000
    );
  });

  setTimeout(function () {
    const see_nodes = document.getElementById("see_nodes");
    see_nodes.addEventListener("mousedown", function () {
      // console.log(cy.filter('[group != "edges"]').length);
      console.log(cy.elements());
    });
  }, 1000);
});
// Modal
// Activities

var activities = [];

// window.onload = function () {
function list_activities() {
  const container_activities = document.getElementById("list_activities");

  // Inputs Form
  const inp_name = document.getElementById("input_name");
  const inp_prec = document.getElementById("input_precedence");
  const inp_time = document.getElementById("input_time");

  if (
    inp_name.value &&
    (inp_prec.value || inp_prec.hasAttribute("disabled")) &&
    inp_time.value
  ) {
    const tr = document.createElement("tr");

    const th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.innerHTML = activities.length + 1;

    const td_name = document.createElement("td");
    td_name.innerHTML = inp_name.value;
    inp_name.value = "";

    const td_prec = document.createElement("td");
    // td_prec.innerHTML = inp_prec.value;
    inp_prec.value
      ? (td_prec.innerHTML = inp_prec.value)
      : (td_prec.innerHTML = "---");
    inp_prec.value = "";

    const td_time = document.createElement("td");
    td_time.innerHTML = inp_time.value;
    inp_time.value = "";

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
      precedence: activities.length
        ? td_prec.innerHTML.split(",").map(function (value) {
            return value.trim();
          })
        : null,
      time: td_time.innerHTML,
    });

    if (activities.length) inp_prec.removeAttribute("disabled");
  } else {
    alert("Error, empty field", "danger");
  }
}
// }
