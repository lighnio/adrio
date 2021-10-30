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
            // "background-color": "#984",
            label: "data(name)",
          },
        },

        {
          selector: "edge",
          style: {
            width: 4,
            // "line-color": "#030",
            // "target-arrow-color": "#003",
            "curve-style": "bezier",
            "target-arrow-shape": "triangle",
          },
        },
      ],
      layout: {
        name: "dagre",
        rankDir: "LR",
      },
      zoom: 0.5,
      minZoom: 0.4  ,
      maxZoom: 2,
    });

    cy.on("tap", "node", (evt) => {
      // evt.target.connectedEdges().animate({
      //   style: { lineColor: "red" },
      // });
      console.log(evt.target.data());
    });

  }

  //adding functions
  setTimeout(function () {
    const load_on_canvas = document.getElementById("load_activities");

    if(load_on_canvas == null && location.hash != "#about") location.reload(true);

    //Global in function
    var edge_id;

    function createTippy(id, node = 'pre') {
      let ele = cy.getElementById(id);
      // console.log('Ele: ', ele.data());
      // console.log('Source: ', cy.elements(`node[id = "${ele.data().source}"]`).data().name);
      // console.log('Source Time: ', cy.elements(`node[id = "${ele.data().source}"]`).data().time);
      // console.log('Target: ', cy.elements(`node[id = "${ele.data().target}"]`).data().name);
      // console.log('Target Time: ', cy.elements(`node[id = "${ele.data().target}"]`).data().time);

      function makeTippys(ele, node = 'pre') {
        var ref = ele.popperRef();

        // Placeholder for Tippy
        var dummyDomEl = document.createElement('div');

        
        var tip = tippy(dummyDomEl, {
          getReferenceClientRect: ref.getBoundingClientRect,
          trigger: 'manual', //Mandatory
          //dom element inside tippy
          content: function () {
            // Posibble upgrade to performance
            let divCont = document.createElement('div');
            // let bold = document.createElement('div');
            // let info = cy.elements(`node[id = "${ele.data().source}"]`).data().name +
            // ' Time: ' + cy.elements(`node[id = "${ele.data().source}"]`).data().time;
            // console.log(ele.data());
            let info = (node == 'pre' ? (cy.elements(`node[id = "${ele.data().source}"]`).data().name +
            ': ' + cy.elements(`node[id = "${ele.data().source}"]`).data().time)
            :
            (cy.elements(`node[id = "${ele.data().target}"]`).data().name +
            ': ' + cy.elements(`node[id = "${ele.data().target}"]`).data().time)
            )
            divCont.innerHTML = info
            return divCont;
          },
          // Preferences
          arrow: true,
          placement: (node == 'pre' ? 'bottom' : 'top'),
          hideOnClick: false,
          sticky: 'reference',

          // If interactive 
          interactive: true,
          appendTo: document.body
        });
        return tip;
      };

      return makeTippys(ele, node);
    }

    load_on_canvas.addEventListener(
      "mousedown",
      function () {
        cy.elements().remove();
        if (activities.length > 0) {
          load_on_canvas.setAttribute("data-bs-dismiss", "modal");
          // let counter = cy.elements('node[name != ""]').length;

          for (let a in activities) {
            cy.add([
              {
                group: "nodes",
                data: {
                  id: `Nodo_${activities[a].id}`,
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
                edge_id = `${prec_name} to ${this_name}`;
                cy.add([
                  {
                    group: "edges",
                    data: {
                      id: edge_id,
                      source: `${prec_id}`,
                      target: `${this_id}`,
                    },
                  },
                ]);
                createTippy(edge_id).show();
                createTippy(edge_id, 'top').show();
              }
            }
            
            // console.log('a: ', typeof a);
            // console.log('activities: ', typeof activities.length);
            if( a == activities.length-1){
              // console.log(cy.elements(`node[name = "${activities[a].name}"]`).data());
              // console.log('----------------------');
              // console.log('All Leaves');
              let last_node = cy.elements(`node[name = "${activities[a].name}"]`);
              let leaves = cy.nodes().leaves();
              // console.log(`leaves: ${cy.nodes().leaves().length}`);
              for(let n = 0; n < leaves.length; n++){
                  let now_node = leaves[n];
                  // console.log(`nodoactual: ${leaves[n].data('id')}`);
                  // console.log(`iteracion: ${n}`);
                  if (now_node.id() != last_node.id()) {
                    // console.log(cy.nodes().leaves()[n].data());

                    // console.log('Extra Edges');
                    // console.log(`id: ${now_node.data('id')} to ${last_node.data('id')}`);
                    // console.log(`source: ${now_node.data('id')}`);
                    // console.log(`target: ${last_node.data('id')}`);
                    edge_id = `${now_node.id()} to ${last_node.id()}`;
                    cy.add([
                      {
                        group: "edges",
                        data: {
                          id: edge_id,
                          source: `${now_node.id()}`,
                          target: `${last_node.id()}`,
                        },
                      },
                    ]);
                    createTippy(edge_id).show();
                    createTippy(edge_id, 'top').show();
                  }
              }
            }
          }
          var layout = cy.makeLayout({ name: "dagre", rankDir: "LR" });
          layout.run();
          cy.fit();
          document.getElementById('cal_route').removeAttribute('disabled');
        } else {
          alert("No activities yet.", "danger");
        }
      },
      1000
    );
  });

  setTimeout(function () {
    const see_nodes = document.getElementById("cal_route");
    see_nodes.addEventListener("mousedown", function () {
    //   // console.log(cy.filter('[group != "edges"]').length);
    //   console.log(cy.elements());

    // let allPaths = cy.elements().cytoscapeAllPaths(/* {maxPaths: 2, rootIds: ['g', 'e']} */);

    // // Usage example: display each path at regular intervals
    // let maxTimes = allPaths.length;
    // let currentTimes = 0;
    // let selectedEles;
    // let interval = setInterval(() => {
    //   if (currentTimes === maxTimes) {
    //     currentTimes = 0;
    //   } else {
    //     if (selectedEles) selectedEles.unselect();
    //     selectedEles = allPaths[currentTimes];
    //     selectedEles.select();
    //     currentTimes++;
    //   }
    // }, 1000);

    let allPaths = cy.elements().cytoscapeAllPaths();
    let paths = [];
    
    for(let i = 0; i < allPaths.length; i++){
      // console.log('Path: ', i);
      let counter = 0;
      for(let j = 0; j < allPaths[i].length; j++){
        if(j % 2 == 0){
          // console.log(allPaths[i][j].data('id'));
          // paths.push(allPaths[i][j].data('id'));
          // console.log('allPathsTime: ',allPaths[i][j].data('time'));
          counter = counter + parseInt(allPaths[i][j].data('time'));
        }
      }
      paths.push({
        sum: counter,
        path: allPaths[i]
      });
    }
    // console.log('Paths: ');
    // console.log(paths);

    //Sorting
    for(var a = 0; a < paths.length; a++){
      for (var b = 0; b < (paths.length - a - 1); b++) {
        if(paths[b].sum > paths[b+1].sum){
          var temp = paths[b];
          paths[b] = paths[b+1];
          paths[b+1] = temp;
        }
      }
    }
    // Possible issue with route, not use last space
    if(paths.length > 2) paths[paths.length - 2].path.select();
    
    // var dfs = cy.elements().aStar({
    //   root: '#Nodo_0',
    //   goal: '#Nodo_3',
    //   directed: true
    // })
      
    // console.log(dfs.distance)
  });

  }, 3000);
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
