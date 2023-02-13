"use strict";

var gl;
var points;
var direction = true;

var NumPoints = 50000;  // number of points
var toggle = 0;         // toggle to go back and forth with num points
var toggle2 = 0;        // toggle to go back and forth with image size
var vertices = [        // variable for vertices 
    vec2( -1, -1 ),
    vec2(  0,  1 ),
    vec2(  1, -1 )
];
var x = 1;              // used as denominator for changing size of verticies of image
var canvas;

var r;                  // variables for r,g,b,a values for fractal
var g;
var b;
var a;

var locationOfR;        // varaibles for locations for r,g,b,a values
var locationOfG;
var locationOfB;
var locationOfA;



window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // Specify a starting point p for our iterations
    // p must lie inside any set of three vertices

    var u = add( vertices[0], vertices[1] );
    var v = add( vertices[0], vertices[2] );
    var p = scale( 0.5, add( u, v ) );

    // And, add our initial point into our array of points

    points = [ p ];

    // Compute new points
    // Each new point is located midway between
    // last point and a randomly chosen vertex

    for ( var i = 0; points.length < NumPoints; ++i ) {
        var j = Math.floor(Math.random() * 3);
        p = add( points[i], vertices[j] );
        p = scale( 0.5, p );
        points.push( p );
    }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );


    render();
};



function numPoints(){             // changes numpoints
    if (NumPoints < 500) {        // changes toggle switch when number of points is
        toggle = 1;               // less than 500 to know to start increasing
    }
    if (NumPoints >= 50000) {     // changes toggle to start subtracting when number
        toggle = 0;               // of points is greater than or equal to 50000  
    }
    if (NumPoints < 500 || toggle == 1){
        NumPoints += 5000;
    } else {
        NumPoints -= 5000;
    }


    var u = add( vertices[0], vertices[1] );
    var v = add( vertices[0], vertices[2] );
    var p = scale( 0.25, add( u, v ) );

    points = [ p ];

    for ( var i = 0; points.length < NumPoints; ++i ) {
        points.push( p );
    }

}     



function sizeColor(){               // changes size of fractal and color
    if (x < 7 && toggle2 == 0) {    // choses to either add or subtract x based on
        x++;                        // current size of fractal
    }
    if (x >= 7 || toggle2 == 1) {
        toggle2 = 1;
        x--;
            if (x == 1) {
                toggle2 = 0;
            }
    }

    vertices = [                    // used to make the verticies of fractal
        vec2( -1/x, -1/x ),         // smaller by putting x over denominator
        vec2(  0,  1/x ),
        vec2(  1/x, -1/x )
    ];

    var canvas = document.getElementById( "gl-canvas" );

    var u = add( vertices[0], vertices[1] );
    var v = add( vertices[0], vertices[2] );
    var p = scale( 0.5, add( u, v ) );

    points = [ p ];

    for ( var i = 0; points.length < NumPoints; ++i ) {
        var j = Math.floor(Math.random() * 3);
        p = add( points[i], vertices[j] );
        p = scale( 0.5, p );
        points.push( p );
    }

    //
    //  Configure WebGL
    //

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and attribute buffers

    r = Math.random()*(1.0-0.0)+0.0;        // randomally selects value between 0.0 and 1.0
    g = Math.random()*(1.0-0.0)+0.0;        // for r,g,b,a values for fractal
    b = Math.random()*(1.0-0.0)+0.0;
    a = Math.random()*(1.0-0.0)+0.0;


    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    locationOfR = gl.getUniformLocation(program, "r");      // finds location for each variable
    locationOfG = gl.getUniformLocation(program, "g");
    locationOfB = gl.getUniformLocation(program, "b");
    locationOfA = gl.getUniformLocation(program, "a");
    gl.useProgram( program );
    gl.uniform1f(locationOfR, r);       // links js varaible to corresponding html variable
    gl.uniform1f(locationOfG, g); 
    gl.uniform1f(locationOfB, b); 
    gl.uniform1f(locationOfA, a); 

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    

}



function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    gl.drawArrays( gl.POINTS, 0, points.length );

    numPoints();

    sizeColor();

    setTimeout( function () {requestAnimationFrame(render);}, 100);
}