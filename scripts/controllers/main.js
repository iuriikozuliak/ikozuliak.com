'use strict';

angular.module('homepageApp')
    .controller('MainCtrl', function ($scope, $location) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.navClass = function (page) {
            var currentRoute = $location.path().substring(1) || 'home';
            return page === currentRoute ? 'current' : '';
        };


        var w = 720,
            h = 720,
            r = 360,
            color = d3.scale.category20c();

        var partition = d3.layout.partition()
            .size([2 * Math.PI, r])
            .value(function(d) { return d.size; });

        var arc = d3.svg.arc()
            .startAngle(function(d) { return d.x; })
            .endAngle(function(d) { return d.x + d.dx; })
            .innerRadius(function(d) { return d.y; })
            .outerRadius(function(d) { return d.y + d.dy; });

        var svg = d3.select("#sunburst").append("svg:svg")
            .attr("width", w)
            .attr("height", h)
            .append("svg:g")
            .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

        var group = svg.data([getData()]).selectAll("path")
            .data(partition.nodes)
            .enter().append('svg:g');

//path variable is required by magnify function
        var path = group.append("svg:path")
            .attr("d", arc)
            .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
            .on("click", magnify)
            .each(stash);

        var text = group.append("text");
        text.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .text(function(d) { return d.name; });


// Distort the specified node to 80% of its parent.
        function magnify(node) {
            if (parent = node.parent) {
                var parent,
                    x = parent.x,
                    k = .7;
                parent.children.forEach(function(sibling) {
                    x += reposition(sibling, x, sibling === node
                        ? parent.dx * k / node.value
                        : parent.dx * (1 - k) / (parent.value - node.value));
                });
            } else {
                reposition(node, 0, node.dx / node.value);
            }

            svg.selectAll("text")
                .transition()
                .duration(750)
                .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })


            path.transition()
                .duration(750)
                .attrTween("d", arcTween);
        }

// Recursively reposition the node at position x with scale k.
        function reposition(node, x, k) {
            node.x = x;
            if (node.children && (n = node.children.length)) {
                var i = -1, n;
                while (++i < n) x += reposition(node.children[i], x, k);
            }
            return node.dx = node.value * k;
        }

// Stash the old values for transition.
        function stash(d) {
            d.x0 = d.x;
            d.dx0 = d.dx;
        }

// Interpolate the arcs in data space.
        function arcTween(a) {
            var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
            return function(t) {
                var b = i(t);
                a.x0 = b.x;
                a.dx0 = b.dx;
                return arc(b);
            };
        }

        function getData() {
            return {
                "name": "parent",
                "children": [
                    {
                        "name": "child1",
                        "children": [
                            {
                                "name": "child11",
                                "children": [
                                    {"name": "child111", "size": 20},
                                    {"name": "child111", "size": 20}

                                ]
                            }
                        ]
                    },
                    {
                        "name": "jghjads",
                        "children": [
                            {
                                "name": "child11",
                                "children": [
                                    {"name": "child111", "size": 40},
                                    {"name": "child111", "size": 40}

                                ]
                            }
                        ]
                    },
                    {
                        "name": "ytrjhg",
                        "children": [
                            {
                                "name": "child11",
                                "children": [
                                    {"name": "child111", "size": 8},
                                    {"name": "child111", "size": 25}

                                ]
                            }
                        ]
                    },
                    {
                        "name": "uyt4gfh",
                        "children": [
                            {
                                "name": "child11",
                                "children": [
                                    {"name": "child111", "size": 8},
                                    {"name": "child111", "size": 25}

                                ]
                            }
                        ]
                    }
                ]
            }
        }
    });
