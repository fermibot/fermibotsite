function hierarchical_dendrogram(json_file, object_name) {
    var diameter = 1000, radius = diameter / 2, innerRadius = radius - 100;

    var cluster = d3.cluster()
        .size([360, innerRadius]);

    var line = d3.radialLine()
        .curve(d3.curveBundle.beta(0.85))
        .radius(function (d) {
            return d.y;
        })
        .angle(function (d) {
            return d.x / 180 * Math.PI;
        });

    var svg = d3.select("#" + object_name).append("svg")
        .attr("width", diameter + 120)
        .attr("height", diameter + 120)
        .append("g")
        .attr("transform", "translate(" + (radius + 50) + "," + (radius + 50) + ")");

    var link = svg.append("g").selectAll(".link"), node = svg.append("g").selectAll(".node");

    d3.json(json_file, function (error, classes) {
        if (error) throw error;

        var root = packageHierarchy(classes)
            .sum(function (d) {
                return d.size;
            });

        cluster(root);

        link = link
            .data(packageImports(root.leaves()))
            .enter().append("path")
            .each(function (d) {
                d.source = d[0], d.target = d[d.length - 1];
            })
            .attr("class", "link")
            .attr("d", line);

        node = node
            .data(root.leaves())
            .enter().append("text")
            .attr("class", "node")
            .attr("dy", "0.31em")
            .attr("transform", function (d) {
                return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)");
            })
            .attr("text-anchor", function (d) {
                return d.x < 180 ? "start" : "end";
            })
            .text(function (d) {
                return d.data.key;
            })
            .on("mouseover", mouseovered)
            .on("mouseout", mouseouted);
    });

    function mouseovered(d) {
        node
            .each(function (n) {
                n.target = n.source = false;
            });

        link
            .classed("link--target", function (l) {
                if (l.target === d) return l.source.source = true;
            })
            .classed("link--source", function (l) {
                if (l.source === d) return l.target.target = true;
            })
            .filter(function (l) {
                return l.target === d || l.source === d;
            })
            .raise();

        node
            .classed("node--target", function (n) {
                return n.target;
            })
            .classed("node--source", function (n) {
                return n.source;
            });
    }

    function mouseouted(d) {
        link
            .classed("link--target", false)
            .classed("link--source", false);

        node
            .classed("node--target", false)
            .classed("node--source", false);
    }

    // Lazily construct the package hierarchy from class names.
    function packageHierarchy(classes) {
        var map = {};

        function find(name, data) {
            var node = map[name], i;
            if (!node) {
                node = map[name] = data || {name: name, children: []};
                if (name.length) {
                    node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
                    node.parent.children.push(node);
                    node.key = name.substring(i + 1);
                }
            }
            return node;
        }

        classes.forEach(function (d) {
            find(d.name, d);
        });

        return d3.hierarchy(map[""]);
    }

    // Return a list of imports for the given array of nodes.
    function packageImports(nodes) {
        var map = {}, imports = [];

        // Compute a map from name to node.
        nodes.forEach(function (d) {
            map[d.data.name] = d;
        });

        // For each import, construct a link from the source to target node.
        nodes.forEach(function (d) {
            if (d.data.imports) d.data.imports.forEach(function (i) {
                imports.push(map[d.data.name].path(map[i]));
            });
        });

        return imports;
    }
}